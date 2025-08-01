import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, withLatestFrom, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { MissionService } from '../services/mission.service';
import * as MissionsActions from './missions.actions';
import { selectMissionsState } from './missions.selectors';
import { MissionFilters } from '../interfaces/mission.interface';
import { MissionsState } from './missions.reducer';

@Injectable()
export class MissionsEffects {

  loadMissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MissionsActions.loadMissions),
      withLatestFrom(this.store.select(selectMissionsState)),
      filter(([action, state]) => {
        const missionsState = state as MissionsState;
        
        // Force refresh if explicitly requested
        if (action.forceRefresh) {
          return true;
        }
        
        // Check if cache is still valid
        if (missionsState.lastFetch) {
          const cacheAge = Date.now() - missionsState.lastFetch;
          const isExpired = cacheAge > missionsState.cacheExpiry;
          
          // If cache is not expired and filters haven't changed, don't fetch
          if (!isExpired && this.filtersEqual(action.filters || {}, missionsState.filters)) {
            return false;
          }
        }
        
        return true;
      }),
      mergeMap(([action, state]) => {
        const filters = action.filters || {};
        
        return this.missionService.getMissions(filters).pipe(
          map(response => MissionsActions.loadMissionsSuccess({ 
            response, 
            filters 
          })),
          catchError(error => {
            console.error('Error loading missions:', error);
            return of(MissionsActions.loadMissionsFailure({ 
              error: error?.error?.error || 'Failed to load missions' 
            }));
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private missionService: MissionService
  ) {}

  private filtersEqual(filters1: MissionFilters, filters2: MissionFilters): boolean {
    const keys1 = Object.keys(filters1).sort();
    const keys2 = Object.keys(filters2).sort();
    
    if (keys1.length !== keys2.length) {
      return false;
    }
    
    return keys1.every(key => filters1[key as keyof MissionFilters] === filters2[key as keyof MissionFilters]);
  }
}
