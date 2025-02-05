import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { DiscordUserResponse } from '../../../backend/interfaces/userresponse.interface';
import { TokenResponse } from '../../../backend/interfaces/tokenresponse.interface';
import { DBUser, DBUserResponse } from '../interfaces/user.interface';
import { FormGroup } from '@angular/forms';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    CREATEUSER = `${environment.API_URL}/api/users`;
    private TOKENURL = `${environment.API_URL}/api/oauth/token`;
    private UPDATEURL = `${environment.API_URL}/api/update/user`;
    private USERURL = 'https://discord.com/api/users/@me';
    loggedIn = localStorage.getItem('access_token') ? true : false;
    // Response data we care about from discord
    discordUser: DiscordUserResponse | null = null;
    // Response data we care about from our database
    dbUser: DBUser | null = null;
    avatarUrl: string | null = null;

    constructor(private http: HttpClient) {}

    createOrUpdateUser(user: DiscordUserResponse): Observable<any> {
        return this.http.post<any>(this.CREATEUSER, user).pipe(
            tap((response: DBUserResponse) => {
                this.dbUser = response.user;
            })
        )
    };
    
    getToken(code: string): Observable<TokenResponse> {
        return this.http.post<any>(this.TOKENURL, { code });
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
            })
        )
    }

    updateUserInfo(): Observable<any> {
        const token = localStorage.getItem('access_token');
        return this.http.post(this.UPDATEURL, this.dbUser, {
            headers: {
                access_token: `${token}`
            }
        })
    };

    setAvatarUrl(): void {
        this.avatarUrl = `https://cdn.discordapp.com/avatars/${this.discordUser?.id}/${this.discordUser?.avatar}.png`;
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
        }
    }

    logout(): void {
        localStorage.removeItem('access_token');
        this.loggedIn = false;
    }
}