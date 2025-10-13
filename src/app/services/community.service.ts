import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Community, CreateCommunityRequest, CommunityResponse } from '../interfaces/community.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private readonly COMMUNITY_URL = `${environment.apiUrl}/communities`;

  constructor(private http: HttpClient) {}

  // Handle HTTP errors
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    console.error('Community service error:', error);
    return throwError(() => error);
  };

  // Get all communities
  getCommunities(): Observable<CommunityResponse> {
    const jwtToken = localStorage.getItem('jwt_token');
    if (!jwtToken) {
      return throwError(() => new Error('No JWT token found. Please log in again.'));
    }

    return this.http.get<CommunityResponse>(this.COMMUNITY_URL, {
      headers: {
        'access_token': jwtToken,
        'Content-Type': 'application/json'
      }
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Create a new community
  createCommunity(community: CreateCommunityRequest): Observable<Community> {
    const jwtToken = localStorage.getItem('jwt_token');
    if (!jwtToken) {
      return throwError(() => new Error('No JWT token found. Please log in again.'));
    }

    return this.http.post<Community>(this.COMMUNITY_URL, community, {
      headers: {
        'access_token': jwtToken,
        'Content-Type': 'application/json'
      }
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Delete a community
  deleteCommunity(id: number): Observable<any> {
    const jwtToken = localStorage.getItem('jwt_token');
    if (!jwtToken) {
      return throwError(() => new Error('No JWT token found. Please log in again.'));
    }

    return this.http.delete(`${this.COMMUNITY_URL}/${id}`, {
      headers: {
        'access_token': jwtToken,
        'Content-Type': 'application/json'
      }
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Update community player count
  updateCommunityPlayerCount(id: number, playercount: number): Observable<Community> {
    const jwtToken = localStorage.getItem('jwt_token');
    if (!jwtToken) {
      return throwError(() => new Error('No JWT token found. Please log in again.'));
    }

    return this.http.put<Community>(`${this.COMMUNITY_URL}/${id}`, { playercount }, {
      headers: {
        'access_token': jwtToken,
        'Content-Type': 'application/json'
      }
    }).pipe(
      catchError(this.handleError)
    );
  }
}