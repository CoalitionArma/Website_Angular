import { createReducer, on } from '@ngrx/store';
import { UserStats, UserRanking } from '../interfaces/user-stats.interface';
import { MissionStatistics } from '../interfaces/mission.interface';
import * as StatsActions from './stats.actions';

export interface MissionStatsEntry {
  missionId: number;
  stats: MissionStatistics;
  rawData: any;
  loading: boolean;
  error: string | null;
  lastUpdated: Date;
}

export interface StatsState {
  // User stats
  stats: UserStats | null;
  ranking: UserRanking | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // Mission stats
  missionStats: { [missionId: number]: MissionStatsEntry };
  currentMissionStatsLoading: number | null;
}

export const initialState: StatsState = {
  stats: null,
  ranking: null,
  loading: false,
  error: null,
  lastUpdated: null,
  missionStats: {},
  currentMissionStatsLoading: null
};

export const statsReducer = createReducer(
  initialState,
  
  // User stats reducers
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
  
  on(StatsActions.clearUserStats, (state) => ({
    ...state,
    stats: null,
    ranking: null,
    loading: false,
    error: null,
    lastUpdated: null
  })),
  
  on(StatsActions.setStatsLoading, (state, { loading }) => ({
    ...state,
    loading
  })),
  
  // Mission stats reducers
  on(StatsActions.loadMissionStats, (state, { mission }) => ({
    ...state,
    currentMissionStatsLoading: mission.id,
    missionStats: {
      ...state.missionStats,
      [mission.id]: {
        ...state.missionStats[mission.id],
        missionId: mission.id,
        loading: true,
        error: null,
        stats: state.missionStats[mission.id]?.stats || {
          events: [],
          summary: { totalEvents: 0, playerCount: 0, totalKills: 0 }
        },
        rawData: state.missionStats[mission.id]?.rawData || null,
        lastUpdated: state.missionStats[mission.id]?.lastUpdated || new Date()
      }
    }
  })),
  
  on(StatsActions.loadMissionStatsSuccess, (state, { missionId, stats, rawData }) => ({
    ...state,
    currentMissionStatsLoading: state.currentMissionStatsLoading === missionId ? null : state.currentMissionStatsLoading,
    missionStats: {
      ...state.missionStats,
      [missionId]: {
        missionId,
        stats,
        rawData,
        loading: false,
        error: null,
        lastUpdated: new Date()
      }
    }
  })),
  
  on(StatsActions.loadMissionStatsFailure, (state, { missionId, error }) => ({
    ...state,
    currentMissionStatsLoading: state.currentMissionStatsLoading === missionId ? null : state.currentMissionStatsLoading,
    missionStats: {
      ...state.missionStats,
      [missionId]: {
        missionId,
        stats: {
          events: [],
          summary: { totalEvents: 0, playerCount: 0, totalKills: 0, outcome: `Error: ${error}` }
        },
        rawData: null,
        loading: false,
        error,
        lastUpdated: new Date()
      }
    }
  })),
  
  on(StatsActions.setMissionStatsLoading, (state, { missionId, loading }) => ({
    ...state,
    currentMissionStatsLoading: loading ? missionId : (state.currentMissionStatsLoading === missionId ? null : state.currentMissionStatsLoading),
    missionStats: {
      ...state.missionStats,
      [missionId]: {
        ...state.missionStats[missionId],
        missionId,
        loading,
        stats: state.missionStats[missionId]?.stats || {
          events: [],
          summary: { totalEvents: 0, playerCount: 0, totalKills: 0 }
        },
        rawData: state.missionStats[missionId]?.rawData || null,
        error: state.missionStats[missionId]?.error || null,
        lastUpdated: state.missionStats[missionId]?.lastUpdated || new Date()
      }
    }
  })),
  
  on(StatsActions.clearMissionStats, (state) => ({
    ...state,
    missionStats: {},
    currentMissionStatsLoading: null
  }))
);
