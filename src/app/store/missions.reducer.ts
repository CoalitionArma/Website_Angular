import { createReducer, on } from '@ngrx/store';
import { Mission, MissionFilters } from '../interfaces/mission.interface';
import * as MissionsActions from './missions.actions';

export interface MissionsState {
  missions: Mission[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  offset: number;
  filters: MissionFilters;
  lastFetch: number | null; // Timestamp of last fetch
  cacheExpiry: number; // Cache expiry time in milliseconds (default 5 minutes)
}

const initialState: MissionsState = {
  missions: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 0,
  totalPages: 0,
  limit: 20,
  offset: 0,
  filters: {},
  lastFetch: null,
  cacheExpiry: 5 * 60 * 1000 // 5 minutes
};

export const missionsReducer = createReducer(
  initialState,
  
  on(MissionsActions.loadMissions, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(MissionsActions.loadMissionsSuccess, (state, { response, filters }) => ({
    ...state,
    missions: response.missions,
    loading: false,
    error: null,
    totalCount: response.total_count,
    currentPage: response.current_page,
    totalPages: response.total_pages,
    limit: response.limit,
    offset: response.offset,
    filters: filters,
    lastFetch: Date.now()
  })),
  
  on(MissionsActions.loadMissionsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error
  })),
  
  on(MissionsActions.clearMissionsCache, (state) => ({
    ...state,
    missions: [],
    totalCount: 0,
    currentPage: 0,
    totalPages: 0,
    lastFetch: null,
    error: null
  })),
  
  on(MissionsActions.setMissionsFilters, (state, { filters }) => ({
    ...state,
    filters: filters
  }))
);
