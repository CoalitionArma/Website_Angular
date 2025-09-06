import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReplaysState } from './replays.reducer';

export const selectReplaysState = createFeatureSelector<ReplaysState>('replays');

export const selectReplays = createSelector(
  selectReplaysState,
  (state) => state.replays
);

export const selectReplaysLoading = createSelector(
  selectReplaysState,
  (state) => state.loading
);

export const selectReplaysError = createSelector(
  selectReplaysState,
  (state) => state.error
);

export const selectReplaysTotalCount = createSelector(
  selectReplaysState,
  (state) => state.totalCount
);

export const selectReplaysDirectory = createSelector(
  selectReplaysState,
  (state) => state.directory
);

export const selectReplaysBaseUrl = createSelector(
  selectReplaysState,
  (state) => state.baseUrl
);

export const selectReplaysLastFetch = createSelector(
  selectReplaysState,
  (state) => state.lastFetch
);

// Composite selectors
export const selectReplaysUiState = createSelector(
  selectReplays,
  selectReplaysLoading,
  selectReplaysError,
  selectReplaysTotalCount,
  (replays, loading, error, totalCount) => ({
    replays,
    loading,
    error,
    totalCount
  })
);
