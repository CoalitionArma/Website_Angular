import { createAction, props } from '@ngrx/store';
import { ReplaysResponse } from '../interfaces/replay.interface';

export const loadReplays = createAction(
  '[Replays] Load Replays',
  props<{ forceRefresh?: boolean }>()
);

export const loadReplaysSuccess = createAction(
  '[Replays] Load Replays Success',
  props<{ response: ReplaysResponse }>()
);

export const loadReplaysFailure = createAction(
  '[Replays] Load Replays Failure',
  props<{ error: string }>()
);

export const clearReplaysCache = createAction(
  '[Replays] Clear Cache'
);
