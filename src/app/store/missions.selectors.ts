import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MissionsState } from './missions.reducer';

export const selectMissionsState = createFeatureSelector<MissionsState>('missions');

export const selectMissions = createSelector(
  selectMissionsState,
  (state) => state.missions
);

export const selectMissionsLoading = createSelector(
  selectMissionsState,
  (state) => state.loading
);

export const selectMissionsError = createSelector(
  selectMissionsState,
  (state) => state.error
);

export const selectMissionsTotalCount = createSelector(
  selectMissionsState,
  (state) => state.totalCount
);

export const selectMissionsCurrentPage = createSelector(
  selectMissionsState,
  (state) => state.currentPage
);

export const selectMissionsTotalPages = createSelector(
  selectMissionsState,
  (state) => state.totalPages
);

export const selectMissionsFilters = createSelector(
  selectMissionsState,
  (state) => state.filters
);

export const selectMissionsLimit = createSelector(
  selectMissionsState,
  (state) => state.limit
);

export const selectMissionsOffset = createSelector(
  selectMissionsState,
  (state) => state.offset
);

export const selectMissionsLastFetch = createSelector(
  selectMissionsState,
  (state) => state.lastFetch
);

export const selectMissionsCacheExpiry = createSelector(
  selectMissionsState,
  (state) => state.cacheExpiry
);

// Composite selectors
export const selectMissionsPagination = createSelector(
  selectMissionsCurrentPage,
  selectMissionsTotalPages,
  selectMissionsTotalCount,
  selectMissionsLimit,
  selectMissionsOffset,
  (currentPage, totalPages, totalCount, limit, offset) => ({
    currentPage,
    totalPages,
    totalCount,
    limit,
    offset
  })
);

export const selectMissionsUiState = createSelector(
  selectMissions,
  selectMissionsLoading,
  selectMissionsError,
  selectMissionsPagination,
  (missions, loading, error, pagination) => ({
    missions,
    loading,
    error,
    pagination
  })
);
