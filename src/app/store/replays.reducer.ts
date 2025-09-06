import { createReducer, on } from '@ngrx/store';
import { ReplayFile } from '../interfaces/replay.interface';
import * as ReplaysActions from './replays.actions';

export interface ReplaysState {
  replays: ReplayFile[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  directory: string;
  baseUrl: string;
  lastFetch: number | null;
  cacheExpiry: number; // Cache expiry time in milliseconds (default 2 minutes for replays)
}

const initialState: ReplaysState = {
  replays: [],
  loading: false,
  error: null,
  totalCount: 0,
  directory: '',
  baseUrl: '',
  lastFetch: null,
  cacheExpiry: 2 * 60 * 1000 // 2 minutes (replays change less frequently)
};

export const replaysReducer = createReducer(
  initialState,
  
  on(ReplaysActions.loadReplays, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(ReplaysActions.loadReplaysSuccess, (state, { response }) => ({
    ...state,
    replays: response.replays,
    loading: false,
    error: null,
    totalCount: response.total_count,
    directory: response.directory,
    baseUrl: response.base_url,
    lastFetch: Date.now()
  })),
  
  on(ReplaysActions.loadReplaysFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error
  })),
  
  on(ReplaysActions.clearReplaysCache, (state) => ({
    ...state,
    replays: [],
    totalCount: 0,
    lastFetch: null,
    error: null
  }))
);
