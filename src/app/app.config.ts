import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { statsReducer } from './store/stats.reducer';
import { StatsEffects } from './store/stats.effects';
import { missionsReducer } from './store/missions.reducer';
import { MissionsEffects } from './store/missions.effects';
import { replaysReducer } from './store/replays.reducer';
import { ReplaysEffects } from './store/replays.effects';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideAnimations(), 
    provideHttpClient(), 
    provideAnimationsAsync(),
    provideStore({
      stats: statsReducer,
      missions: missionsReducer,
      replays: replaysReducer
    }),
    provideEffects(StatsEffects, MissionsEffects, ReplaysEffects),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production
    })
  ]
};
