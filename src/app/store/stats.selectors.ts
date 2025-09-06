import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StatsState } from './stats.reducer';

export const selectStatsState = createFeatureSelector<StatsState>('stats');

export const selectUserStats = createSelector(
  selectStatsState,
  (state: StatsState) => state.stats
);

export const selectUserRanking = createSelector(
  selectStatsState,
  (state: StatsState) => state.ranking
);

export const selectStatsLoading = createSelector(
  selectStatsState,
  (state: StatsState) => state.loading
);

export const selectStatsError = createSelector(
  selectStatsState,
  (state: StatsState) => state.error
);

export const selectLastUpdated = createSelector(
  selectStatsState,
  (state: StatsState) => state.lastUpdated
);

export const selectHasStats = createSelector(
  selectStatsState,
  (state: StatsState) => state.stats !== null
);

// Mission stats selectors
export const selectMissionStats = createSelector(
  selectStatsState,
  (state: StatsState) => state.missionStats
);

export const selectCurrentMissionStatsLoading = createSelector(
  selectStatsState,
  (state: StatsState) => state.currentMissionStatsLoading
);

export const selectMissionStatsById = (missionId: number) => createSelector(
  selectMissionStats,
  (missionStats) => missionStats[missionId] || null
);

export const selectMissionStatsLoading = (missionId: number) => createSelector(
  selectMissionStatsById(missionId),
  (missionStatsEntry) => missionStatsEntry?.loading || false
);

export const selectMissionStatsData = (missionId: number) => createSelector(
  selectMissionStatsById(missionId),
  (missionStatsEntry) => missionStatsEntry?.stats || null
);

export const selectMissionRawData = (missionId: number) => createSelector(
  selectMissionStatsById(missionId),
  (missionStatsEntry) => missionStatsEntry?.rawData || null
);

export const selectMissionStatsError = (missionId: number) => createSelector(
  selectMissionStatsById(missionId),
  (missionStatsEntry) => missionStatsEntry?.error || null
);

export const selectHasMissionStats = (missionId: number) => createSelector(
  selectMissionStatsById(missionId),
  (missionStatsEntry) => missionStatsEntry !== null && missionStatsEntry.stats !== null
);

// Calculate total combat effectiveness score
export const selectCombatScore = createSelector(
  selectUserStats,
  (stats) => {
    if (!stats) return 0;
    
    const killScore = stats.kills * 10;
    const deathPenalty = stats.deaths * 5;
    const accuracyBonus = stats.accuracy_percentage * 2; // Bonus for kill accuracy
    const aiKillBonus = stats.ai_kills * 2;
    const ffPenalty = stats.friendly_fire_events * 20;
    const civPenalty = stats.civilians_killed * 50; // Heavy penalty for civilian casualties
    
    return Math.max(0, killScore - deathPenalty + accuracyBonus + aiKillBonus - ffPenalty - civPenalty);
  }
);

export const selectRankInfo = createSelector(
  selectUserStats,
  selectUserRanking,
  (stats, ranking) => {
    if (!stats || !ranking) return null;
    return {
      position: ranking.rank_position,
      totalPlayers: ranking.total_players
    };
  }
);
