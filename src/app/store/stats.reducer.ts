import { createReducer, on } from '@ngrx/store';
import { UserStats, UserRanking } from '../interfaces/user-stats.interface';
import * as StatsActions from './stats.actions';

export interface StatsState {
  stats: UserStats | null;
  ranking: UserRanking | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const initialState: StatsState = {
  stats: null,
  ranking: null,
  loading: false,
  error: null,
  lastUpdated: null
};

export const statsReducer = createReducer(
  initialState,
  
  on(StatsActions.loadUserStats, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(StatsActions.loadUserStatsSuccess, (state, { stats, ranking }) => ({
    ...state,
    stats,
    ranking,
    loading: false,
    error: null,
    lastUpdated: new Date()
  })),
  
  on(StatsActions.loadUserStatsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    stats: null,
    ranking: null
  })),
  
  on(StatsActions.clearUserStats, () => initialState),
  
  on(StatsActions.setStatsLoading, (state, { loading }) => ({
    ...state,
    loading
  }))
);
