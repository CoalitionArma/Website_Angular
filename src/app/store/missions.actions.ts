import { createAction, props } from '@ngrx/store';
import { Mission, MissionsResponse, MissionFilters } from '../interfaces/mission.interface';

export const loadMissions = createAction(
  '[Missions] Load Missions',
  props<{ filters?: MissionFilters; forceRefresh?: boolean }>()
);

export const loadMissionsSuccess = createAction(
  '[Missions] Load Missions Success',
  props<{ response: MissionsResponse; filters: MissionFilters }>()
);

export const loadMissionsFailure = createAction(
  '[Missions] Load Missions Failure',
  props<{ error: string }>()
);

export const clearMissionsCache = createAction(
  '[Missions] Clear Cache'
);

export const setMissionsFilters = createAction(
  '[Missions] Set Filters',
  props<{ filters: MissionFilters }>()
);
