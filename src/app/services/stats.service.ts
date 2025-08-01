import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserStats, UserRanking } from '../interfaces/user-stats.interface';
import * as StatsActions from '../store/stats.actions';
import * as StatsSelectors from '../store/stats.selectors';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  
  // Observable selectors
  public stats$ = this.store.select(StatsSelectors.selectUserStats);
  public ranking$ = this.store.select(StatsSelectors.selectUserRanking);
  public loading$ = this.store.select(StatsSelectors.selectStatsLoading);
  public error$ = this.store.select(StatsSelectors.selectStatsError);
  public hasStats$ = this.store.select(StatsSelectors.selectHasStats);
  public combatScore$ = this.store.select(StatsSelectors.selectCombatScore);
  public rankInfo$ = this.store.select(StatsSelectors.selectRankInfo);

  constructor(private store: Store) {}

  /**
   * Load user statistics from the backend
   * @param userId - The user ID to load stats for
   */
  loadUserStats(userId: string): void {
    this.store.dispatch(StatsActions.loadUserStats({ userId }));
  }

  /**
   * Clear all user statistics (typically called on logout)
   */
  clearUserStats(): void {
    this.store.dispatch(StatsActions.clearUserStats());
  }

  /**
   * Set loading state manually
   * @param loading - Whether stats are loading
   */
  setLoading(loading: boolean): void {
    this.store.dispatch(StatsActions.setStatsLoading({ loading }));
  }

  /**
   * Get current stats synchronously (snapshot)
   */
  getCurrentStats(): UserStats | null {
    let currentStats: UserStats | null = null;
    this.stats$.subscribe(stats => currentStats = stats).unsubscribe();
    return currentStats;
  }

  /**
   * Get current ranking synchronously (snapshot)
   */
  getCurrentRanking(): UserRanking | null {
    let currentRanking: UserRanking | null = null;
    this.ranking$.subscribe(ranking => currentRanking = ranking).unsubscribe();
    return currentRanking;
  }

  /**
   * Check if stats are currently loading
   */
  isLoading(): boolean {
    let loading = false;
    this.loading$.subscribe(state => loading = state).unsubscribe();
    return loading;
  }
}
