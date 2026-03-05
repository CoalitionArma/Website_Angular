import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../environments/environment';

export type SortCol =
  | 'tvt_kdr' | 'kills' | 'deaths' | 'missions_attended' | 'total_missions_attended'
  | 'accuracy_percentage' | 'ai_kills' | 'healing_done'
  | 'distance_walked' | 'level' | 'coop_kdr';

export interface LeaderboardPlayer {
  id: number;
  name: string;
  guid: string;
  kills: number;
  deaths: number;
  tvt_kdr: number;
  missions_attended: number;
  total_missions_attended: number;
  ai_kills: number;
  coop_kdr: number;
  shots_fired: number;
  accuracy_percentage: number;
  distance_walked: number;
  distance_driven: number;
  healing_done: number;
  session_duration: number;
  level: number;
  friendly_fire_events: number;
  civilians_killed: number;
  total_players: number;
  rank_position: number;
  is_ranked: number;
}

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.scss'
})
export class LeaderboardComponent implements OnInit {

  loading = signal(true);
  error = signal<string | null>(null);
  allPlayers = signal<LeaderboardPlayer[]>([]);

  sortCol = signal<SortCol>('tvt_kdr');
  sortDir = signal<'asc' | 'desc'>('desc');
  rankedOnly = signal(false);
  searchQuery = signal('');

  totalPlayers = signal(0);

  displayedPlayers = computed(() => {
    let players = this.allPlayers();

    // Filter: ranked only
    if (this.rankedOnly()) {
      players = players.filter(p => p.is_ranked == 1);
    }

    // Filter: search
    const q = this.searchQuery().trim().toLowerCase();
    if (q) {
      players = players.filter(p => p.name?.toLowerCase().includes(q));
    }

    // Sort
    const col = this.sortCol();
    const dir = this.sortDir() === 'asc' ? 1 : -1;
    players = [...players].sort((a, b) => {
      const av = parseFloat(String((a as any)[col])) || 0;
      const bv = parseFloat(String((b as any)[col])) || 0;
      return (av > bv ? 1 : av < bv ? -1 : 0) * dir;
    });

    return players;
  });

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  loadLeaderboard(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<{ success: boolean; players: LeaderboardPlayer[]; total: number }>(
      `${environment.apiUrl}/leaderboard?limit=500`
    ).subscribe({
      next: (res) => {
        if (res.success) {
          this.allPlayers.set(res.players);
          this.totalPlayers.set(res.players[0]?.total_players ?? res.total);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Leaderboard load error', err);
        this.error.set('Failed to load leaderboard data.');
        this.loading.set(false);
      }
    });
  }

  toggleRankedOnly(): void {
    this.rankedOnly.update(v => !v);
  }

  sortBy(col: SortCol): void {
    if (this.sortCol() === col) {
      this.sortDir.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortCol.set(col);
      this.sortDir.set('desc');
    }
  }

  sortIcon(col: SortCol): string {
    if (this.sortCol() !== col) return '';
    return this.sortDir() === 'asc' ? '▲' : '▼';
  }

  isActive(col: SortCol): boolean {
    return this.sortCol() === col;
  }

  rowClass(player: LeaderboardPlayer, index: number): string {
    const classes: string[] = [];
    if (player.is_ranked != 1) classes.push('unranked');
    if (index === 0) classes.push('rank-gold');
    else if (index === 1) classes.push('rank-silver');
    else if (index === 2) classes.push('rank-bronze');
    return classes.join(' ');
  }

  formatDist(m: number): string {
    if (!m) return '0 m';
    return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
  }

  formatTime(seconds: number): string {
    if (!seconds) return '0h';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  formatKdr(v: number): string {
    if (!v) return '0.00';
    return parseFloat(String(v)).toFixed(2);
  }

  formatPct(v: number): string {
    if (!v) return '0%';
    return `${parseFloat(String(v)).toFixed(1)}%`;
  }

  formatHeal(v: number): string {
    if (!v) return '0';
    return v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(Math.round(v));
  }
}
