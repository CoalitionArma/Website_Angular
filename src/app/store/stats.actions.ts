import { createAction, props } from '@ngrx/store';
import { UserStats, UserRanking } from '../interfaces/user-stats.interface';
import { Mission, MissionStatistics } from '../interfaces/mission.interface';

// Load user stats actions
export const loadUserStats = createAction(
  '[Stats] Load User Stats',
  props<{ userId: string }>()
);

export const loadUserStatsSuccess = createAction(
  '[Stats] Load User Stats Success',
  props<{ stats: UserStats; ranking: UserRanking | null }>()
);

export const loadUserStatsFailure = createAction(
  '[Stats] Load User Stats Failure',
  props<{ error: string }>()
);

// Clear stats on logout
export const clearUserStats = createAction(
  '[Stats] Clear User Stats'
);

// Set loading state
export const setStatsLoading = createAction(
  '[Stats] Set Stats Loading',
  props<{ loading: boolean }>()
);

// Mission statistics actions
export const loadMissionStats = createAction(
  '[Stats] Load Mission Stats',
  props<{ mission: Mission }>()
);

export const loadMissionStatsSuccess = createAction(
  '[Stats] Load Mission Stats Success',
  props<{ missionId: number; stats: MissionStatistics; rawData: any }>()
);

export const loadMissionStatsFailure = createAction(
  '[Stats] Load Mission Stats Failure',
  props<{ missionId: number; error: string }>()
);

export const clearMissionStats = createAction(
  '[Stats] Clear Mission Stats'
);

export const setMissionStatsLoading = createAction(
  '[Stats] Set Mission Stats Loading',
  props<{ missionId: number; loading: boolean }>()
);
