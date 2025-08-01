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
