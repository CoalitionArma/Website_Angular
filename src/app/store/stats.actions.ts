import { createAction, props } from '@ngrx/store';
import { UserStats, UserRanking } from '../interfaces/user-stats.interface';

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
