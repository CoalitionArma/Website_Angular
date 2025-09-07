import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StatsService } from '../services/stats.service';

@Component({
  selector: 'app-user-stats',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  template: "",
  styles: []
})
export class UserStatsComponent implements OnInit {
  public userStats$ = this.statsService.stats$;
  public userRanking$ = this.statsService.ranking$;
  public statsLoading$ = this.statsService.loading$;
  public statsError$ = this.statsService.error$;
  public hasStats$ = this.statsService.hasStats$;
  public formattedPlaytime$ = this.statsService.formattedPlaytime$;
  public rankInfo$ = this.statsService.rankInfo$;

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    // Component will receive stats from the parent component or service
    // No need to load stats here as it's handled by the UserService
  }
}
