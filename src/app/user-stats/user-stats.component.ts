import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StatsService } from '../services/stats.service';
import { Observable } from 'rxjs';
import { UserStats, UserRanking } from '../interfaces/user-stats.interface';

@Component({
  selector: 'app-user-stats',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './user-stats.component.html',
  styleUrl: './user-stats.component.scss'
})
export class UserStatsComponent implements OnInit {
  public userStats$ = this.statsService.stats$;
  public userRanking$ = this.statsService.ranking$;
  public statsLoading$ = this.statsService.loading$;
  public statsError$ = this.statsService.error$;
  public hasStats$ = this.statsService.hasStats$;
  public combatScore$ = this.statsService.combatScore$;
  public rankInfo$ = this.statsService.rankInfo$;

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    // Component will receive stats from the parent component or service
    // No need to load stats here as it's handled by the UserService
    
    // Debug logging
    this.userStats$.subscribe(stats => {
      console.log('📊 User stats in component:', stats);
    });
    
    this.statsLoading$.subscribe(loading => {
      console.log('⏳ Stats loading state:', loading);
    });
    
    this.statsError$.subscribe(error => {
      console.log('❌ Stats error:', error);
    });
  }

  /** Returns a 0–100 percentage for a distance value relative to the max of the three distance types. */
  getDistPct(value: number, stats: any): number {
    const max = Math.max(
      stats.distance_walked ?? 0,
      stats.distance_driven ?? 0,
      stats.distance_as_occupant ?? 0
    );
    return max > 0 ? Math.round((value / max) * 100) : 0;
  }
}
