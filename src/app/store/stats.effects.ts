import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as StatsActions from './stats.actions';
import { UserStatsResponse } from '../interfaces/user-stats.interface';
import { environment } from '../../environments/environment';

@Injectable()
export class StatsEffects {
  
  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}

  loadUserStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StatsActions.loadUserStats),
      mergeMap(({ userId }) => {
        console.log('🔄 Loading stats for user:', userId);
        const token = localStorage.getItem('jwt_token');
        console.log('🔑 Token available:', !!token);
        
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'access_token': token || ''
        });

        const url = `${environment.apiUrl}/user/stats/${userId}`;
        console.log('📡 Making request to:', url);

        return this.http.get<UserStatsResponse>(url, { headers }).pipe(
          map((response) => {
            console.log('✅ Stats loaded successfully:', response);
            return StatsActions.loadUserStatsSuccess({ 
              stats: response.stats, 
              ranking: response.ranking 
            });
          }),
          catchError((error) => {
            console.error('❌ Error loading user stats:', error);
            const errorMessage = error.error?.error || error.message || 'Failed to load user statistics';
            return of(StatsActions.loadUserStatsFailure({ error: errorMessage }));
          })
        );
      })
    )
  );
}
