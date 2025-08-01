import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, throwError, BehaviorSubject } from 'rxjs';
import { DiscordUserResponse } from '../../../backend/src/interfaces/userresponse.interface';
import { TokenResponse } from '../../../backend/src/interfaces/tokenresponse.interface';
import { DBUser, DBUserResponse } from '../interfaces/user.interface';
import { FormGroup } from '@angular/forms';
import { environment } from '../../environments/environment';
import { StatsService } from './stats.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private CREATEUSER = `${environment.apiUrl}/users`;
    private TOKENURL = `${environment.apiUrl}/oauth/token`;
    private USERURL = `${environment.discordApiUrl}/users/@me`;
    private UPDATEURL = `${environment.apiUrl}/update/user`;
    
    // Use BehaviorSubject for reactive login state
    private loggedInSubject = new BehaviorSubject<boolean>(this.isTokenValid());
    public loggedIn$ = this.loggedInSubject.asObservable();
    
    // Response data we care about from discord
    discordUser: DiscordUserResponse | null = null;
    // Response data we care about from our database
    dbUser: DBUser | null = null;
    avatarUrl: string | null = null;

    constructor(private http: HttpClient, private statsService: StatsService) {
        // Check token validity on service initialization
        this.checkTokenValidity();
        
        // Initialize user data if token is valid
        this.initializeUserData();
        
        // Set up periodic token validation (every 5 minutes)
        setInterval(() => {
            this.checkTokenValidity();
        }, 5 * 60 * 1000);
    }

    // Check if current token is valid (not expired)
    private isTokenValid(): boolean {
        const token = localStorage.getItem('access_token');
        const tokenExpiry = localStorage.getItem('token_expiry');
        
        if (!token || !tokenExpiry) {
            return false;
        }
        
        const now = new Date().getTime();
        const expiry = parseInt(tokenExpiry);
        
        // Check if token expires within next 5 minutes (buffer time)
        return now < (expiry - 5 * 60 * 1000);
    }

    // Check token validity and update login state
    private checkTokenValidity(): void {
        const isValid = this.isTokenValid();
        if (!isValid && this.loggedInSubject.value) {
            this.logout();
        }
        this.loggedInSubject.next(isValid);
    }

    // Initialize user data from stored tokens on app startup
    private initializeUserData(): void {
        if (this.isTokenValid()) {
            // First, try to restore user data from localStorage for immediate UI update
            this.restoreUserData();
            
            const token = localStorage.getItem('access_token');
            if (token) {
                // Then validate and refresh user data from server
                this.getDiscordUser(token).subscribe({
                    next: (discordUser) => {
                        // Update with fresh data and store it
                        this.storeUserData();
                        
                        // Also refresh database user info
                        this.createOrUpdateUser(discordUser).subscribe({
                            next: (dbResponse) => {
                                this.storeUserData();
                                console.log('User session restored and refreshed');
                            },
                            error: (error) => {
                                console.log('Database user info refresh failed, using cached data');
                            }
                        });
                    },
                    error: (error) => {
                        // If token is invalid, the handleError method will call logout
                        console.log('Failed to restore user session, token may be expired');
                    }
                });
            }
        }
    }

    // Handle HTTP errors, especially 401 (unauthorized)
    private handleError = (error: HttpErrorResponse): Observable<never> => {
        if (error.status === 401) {
            // Token is invalid or expired
            this.logout();
        }
        return throwError(() => error);
    };

    // Store token with expiration time
    private storeToken(tokenResponse: TokenResponse): void {
        localStorage.setItem('access_token', tokenResponse.access_token);
        
        // Calculate expiration time (token expires in 1 hour)
        const expiryTime = new Date().getTime() + (tokenResponse.expires_in * 1000);
        localStorage.setItem('token_expiry', expiryTime.toString());
        
        this.loggedInSubject.next(true);
    }

    // Store user data for persistence
    private storeUserData(): void {
        if (this.discordUser) {
            localStorage.setItem('discord_user', JSON.stringify(this.discordUser));
        }
        if (this.dbUser) {
            localStorage.setItem('db_user', JSON.stringify(this.dbUser));
        }
        if (this.avatarUrl) {
            localStorage.setItem('avatar_url', this.avatarUrl);
        }
    }

    // Restore user data from localStorage
    private restoreUserData(): void {
        const discordUserData = localStorage.getItem('discord_user');
        const dbUserData = localStorage.getItem('db_user');
        const avatarUrl = localStorage.getItem('avatar_url');

        if (discordUserData) {
            this.discordUser = JSON.parse(discordUserData);
        }
        if (dbUserData) {
            this.dbUser = JSON.parse(dbUserData);
        }
        if (avatarUrl) {
            this.avatarUrl = avatarUrl;
        }
    }

    // Get current login state
    get loggedIn(): boolean {
        return this.loggedInSubject.value;
    }

    createOrUpdateUser(user: DiscordUserResponse): Observable<any> {
        this.checkTokenValidity(); // Check token before making request
        return this.http.post<any>(this.CREATEUSER, user).pipe(
            tap((response: any) => {
                this.dbUser = response.user || response.newUser;
                
                // Store the JWT token returned from the backend
                if (response.token) {
                    localStorage.setItem('jwt_token', response.token);
                    console.log('JWT token stored:', response.token.substring(0, 20) + '...');
                }
                
                this.storeUserData(); // Store updated user data
                
                // Load user stats after successful login/update
                if (this.dbUser?.discordid) {
                    console.log('Loading user stats for:', this.dbUser.discordid);
                    this.statsService.loadUserStats(this.dbUser.discordid);
                }
            }),
            catchError(this.handleError)
        );
    }
    
    getToken(code: string): Observable<TokenResponse> {
        return this.http.post<TokenResponse>(this.TOKENURL, { code }).pipe(
            tap((tokenResponse: TokenResponse) => {
                this.storeToken(tokenResponse);
            }),
            catchError(this.handleError)
        );
    }

    getDiscordUser(token: string): Observable<any> {
        return this.http.get<any>(this.USERURL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).pipe(
            tap((user: DiscordUserResponse) => {
                this.discordUser = user;
                this.setAvatarUrl();
                this.storeUserData(); // Store updated user data
            }),
            catchError(this.handleError)
        );
    }

    updateUserInfo(): Observable<any> {
        // Check for JWT token first
        const jwtToken = localStorage.getItem('jwt_token');
        if (!jwtToken) {
            console.warn('No JWT token found, user needs to log in again');
            return throwError(() => new Error('No JWT token found. Please log out and log back in.'));
        }
        
        // Check Discord token validity for additional validation
        if (!this.isTokenValid()) {
            console.warn('Discord token expired');
            return throwError(() => new Error('Session expired. Please log in again.'));
        }
        
        console.log('Using JWT token for update:', jwtToken.substring(0, 20) + '...');
        console.log('Sending user data:', this.dbUser);
        
        return this.http.post(this.UPDATEURL, this.dbUser, {
            headers: {
                'access_token': `${jwtToken}`,
                'Content-Type': 'application/json'
            }
        }).pipe(
            tap((response: any) => {
                // Store updated user data after successful update
                this.storeUserData();
                console.log('User info updated successfully:', response);
            }),
            catchError((error) => {
                console.error('HTTP request failed:', error);
                return this.handleError(error);
            })
        );
    }

    setAvatarUrl(): void {
        this.avatarUrl = `${environment.discordCdnUrl}/avatars/${this.discordUser?.id}/${this.discordUser?.avatar}.png`;
    }

    getAvatarUrl(): string {
        return this.avatarUrl || '';
    }

    updateLocalUser(form: FormGroup): void {
        this.dbUser = {
            discordid: this.dbUser?.discordid || '',
            steamid: form.value.steamID ? form.value.steamID : this.dbUser?.steamid,
            email: form.value.email ? form.value.email : this.dbUser?.email,
            teamspeakid: this.dbUser?.teamspeakid || null,
            username: this.dbUser?.username || '',
            section: this.dbUser?.section || null,
            veterancy: this.dbUser?.veterancy || null,
            armaguid: form.value.armaID,
        };
    }

    logout(): void {
        // Clear tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('token_expiry');
        
        // Clear user data
        localStorage.removeItem('discord_user');
        localStorage.removeItem('db_user');
        localStorage.removeItem('avatar_url');
        
        // Clear user stats from store
        this.statsService.clearUserStats();
        
        // Reset service state
        this.loggedInSubject.next(false);
        this.discordUser = null;
        this.dbUser = null;
        this.avatarUrl = null;
    }

    // Method to manually refresh token status (can be called periodically)
    refreshTokenStatus(): void {
        this.checkTokenValidity();
    }

    // Method to check if user needs to re-authenticate soon
    shouldRefreshSoon(): boolean {
        const tokenExpiry = localStorage.getItem('token_expiry');
        if (!tokenExpiry) return true;
        
        const now = new Date().getTime();
        const expiry = parseInt(tokenExpiry);
        
        // Return true if token expires within next 10 minutes
        return now > (expiry - 10 * 60 * 1000);
    }
}