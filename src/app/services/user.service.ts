import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UserResponse } from '../../../backend/interfaces/userresponse.interface';
import { TokenResponse } from '../../../backend/interfaces/tokenresponse.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private CREATEUSER = 'http://localhost:3000/api/users';
    private TOKENURL = 'http://localhost:3000/api/oauth/token';
    private USERURL = 'https://discord.com/api/users/@me';
    private UPDATEURL = 'http://localhost:3000/api/update/user';
    loggedIn = localStorage.getItem('access_token') ? true : false;
    user: UserResponse | null = null;
    avatarUrl: string | null = null;

    constructor(private http: HttpClient) {}

    createOrUpdateUser(user: UserResponse): Observable<any> {
        return this.http.post<any>(this.CREATEUSER, user);
    }

    getToken(code: string): Observable<TokenResponse> {
        return this.http.post<any>(this.TOKENURL, { code });
    }

    getUser(token: string): Observable<any> {
        return this.http.get<any>(this.USERURL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).pipe(
            tap((user: UserResponse) => {
                this.user = user;
                this.setAvatarUrl();
            })
        )
    }

    setAvatarUrl(): void {
        this.avatarUrl = `https://cdn.discordapp.com/avatars/${this.user?.id}/${this.user?.avatar}.png`;
    }

    getAvatarUrl(): string {
        return this.avatarUrl || '';
    }

    updateEmail(email: string): Observable<any> {
        const token = localStorage.getItem('access_token');
        return this.http.post(this.UPDATEURL, { email }, {
            headers: {
                access_token: `${token}`
            }
        });
    }

    logout(): void {
        localStorage.removeItem('access_token');
        this.loggedIn = false;
    }
}