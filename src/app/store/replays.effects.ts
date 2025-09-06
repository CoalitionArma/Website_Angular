import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, withLatestFrom, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { ReplayService } from '../services/replay.service';
import * as ReplaysActions from './replays.actions';
import { selectReplaysState } from './replays.selectors';
import { ReplaysState } from './replays.reducer';

@Injectable()
export class ReplaysEffects {

  loadReplays$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReplaysActions.loadReplays),
      withLatestFrom(this.store.select(selectReplaysState)),
      filter(([action, state]) => {
        const replaysState = state as ReplaysState;
        
        // Force refresh if explicitly requested
        if (action.forceRefresh) {
          return true;
        }
        
        // Check if cache is still valid
        if (replaysState.lastFetch) {
          const cacheAge = Date.now() - replaysState.lastFetch;
          const isExpired = cacheAge > replaysState.cacheExpiry;
          
          // If cache is not expired, don't fetch
          if (!isExpired) {
            return false;
          }
        }
        
        return true;
      }),
      mergeMap(([action, state]) => {
        return this.replayService.getReplays().pipe(
          map(response => ReplaysActions.loadReplaysSuccess({ response })),
          catchError(error => {
            console.error('Error loading replays:', error);
            return of(ReplaysActions.loadReplaysFailure({ 
              error: error?.error?.error || 'Failed to load replay files' 
            }));
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private replayService: ReplayService
  ) {}
}
