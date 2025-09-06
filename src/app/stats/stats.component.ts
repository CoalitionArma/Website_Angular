import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Mission, MissionFilters, MissionStatistics } from '../interfaces/mission.interface';
import { ReplayFile } from '../interfaces/replay.interface';
import { ReplayService } from '../services/replay.service';
import * as MissionsActions from '../store/missions.actions';
import * as MissionsSelectors from '../store/missions.selectors';
import * as ReplaysActions from '../store/replays.actions';
import * as ReplaysSelectors from '../store/replays.selectors';
import * as StatsActions from '../store/stats.actions';
import * as StatsSelectors from '../store/stats.selectors';
import { MissionStatsDialogComponent } from './mission-stats-dialog/mission-stats-dialog.component';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatIconModule,
    MatSortModule,
    MatDialogModule,
    MissionStatsDialogComponent
  ],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  // Mission properties
  missions$: Observable<Mission[]>;
  missions: Mission[] | null = null;
  missionsLoading$: Observable<boolean>;
  missionsError$: Observable<string | null>;
  sortedMissions: Mission[] = [];
  filteredMissions: Mission[] = [];

  // Replay properties
  replays$: Observable<ReplayFile[]>;
  replaysLoading$: Observable<boolean>;
  replaysError$: Observable<string | null>;

  // Template compatibility properties (map to correct observables)
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  totalMissions$: Observable<number>;
  totalReplays$: Observable<number>;

  // Pagination and filtering
  currentPage = 0;
  pageSize = 25;
  searchTerm = '';
  selectedGametype = '';
  selectedTerrain = '';
  selectedAuthor = '';

  // Sorting
  currentSort: Sort = { active: '', direction: '' };

  // Filter options
  gametypes: string[] = [];
  terrains: string[] = [];
  authors: string[] = [];

  // Table columns
  displayedColumns: string[] = ['name', 'author', 'terrain', 'gametype', 'players', 'sidecounts', 'description'];
  replayColumns: string[] = ['name', 'date', 'size', 'actions'];

  // Processing state
  processingMission = false;

  constructor(
    private store: Store,
    private dialog: MatDialog,
    private replayService: ReplayService
  ) {
    // Initialize observables
    this.missions$ = this.store.select(MissionsSelectors.selectMissions);
    this.missionsLoading$ = this.store.select(MissionsSelectors.selectMissionsLoading);
    this.missionsError$ = this.store.select(MissionsSelectors.selectMissionsError);

    this.replays$ = this.store.select(ReplaysSelectors.selectReplays);
    this.replaysLoading$ = this.store.select(ReplaysSelectors.selectReplaysLoading);
    this.replaysError$ = this.store.select(ReplaysSelectors.selectReplaysError);

    // Template compatibility
    this.loading$ = this.missionsLoading$;
    this.error$ = this.missionsError$;
    this.totalMissions$ = this.missions$.pipe(map((missions: Mission[]) => missions.length));
    this.totalReplays$ = this.replays$.pipe(map((replays: ReplayFile[]) => replays.length));
  }

  ngOnInit() {
    // Load initial data
    this.loadMissions();
    this.loadReplays();

    // Subscribe to missions data
    this.missions$.pipe(takeUntil(this.destroy$)).subscribe(missions => {
      this.missions = missions;
      if (missions) {
        this.updateFilterOptions(missions);
        this.sortedMissions = this.sortMissions(missions, this.currentSort);
      }
    });

    // Set up search debouncing
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.onFilterChange();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Missions methods
  loadMissions(forceRefresh: boolean = false) {
    const filters: MissionFilters = {
      limit: this.pageSize,
      offset: this.currentPage * this.pageSize,
      search: this.searchTerm || undefined,
      gametype: this.selectedGametype || undefined,
      terrain: this.selectedTerrain || undefined,
      author: this.selectedAuthor || undefined
    };

    this.store.dispatch(MissionsActions.loadMissions({ filters, forceRefresh }));
  }

  // Replays methods
  loadReplays(forceRefresh: boolean = false) {
    this.store.dispatch(ReplaysActions.loadReplays({ forceRefresh }));
  }

  refreshReplays() {
    this.loadReplays(true);
  }

  downloadReplay(replay: ReplayFile) {
    this.replayService.downloadReplay(replay);
  }

  openReplayInNewTab(replay: ReplayFile) {
    this.replayService.openReplayInNewTab(replay);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadMissions();
  }

  onFilterChange() {
    this.currentPage = 0; // Reset to first page when filtering
    this.loadMissions();
  }

  onSearchInput(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchTerm);
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedGametype = '';
    this.selectedTerrain = '';
    this.selectedAuthor = '';
    this.currentPage = 0;
    this.loadMissions();
  }

  refreshMissions() {
    this.loadMissions(true); // Force refresh
  }

  onSort(sort: Sort) {
    this.currentSort = sort;
    if (this.missions) {
      this.sortedMissions = this.sortMissions(this.missions, sort);
    }
  }

  // Alias for template compatibility
  onSortChange(sort: Sort) {
    this.onSort(sort);
  }

  // Helper method to parse sidecounts for template
  parseSideCounts(sidecounts: string): { blufor: number, opfor: number, independent: number, civilian: number } {
    let parts: number[] = [];
    
    if (!sidecounts) {
      return { blufor: 0, opfor: 0, independent: 0, civilian: 0 };
    }
    
    // Handle JSON array format like "[27,40,0,0]"
    if (sidecounts.trim().startsWith('[') && sidecounts.trim().endsWith(']')) {
      try {
        const parsed = JSON.parse(sidecounts.trim());
        if (Array.isArray(parsed)) {
          parts = parsed.map(n => parseInt(n) || 0);
        }
      } catch (error) {
        // Fall back to manual parsing without brackets
        const cleaned = sidecounts.replace(/[\[\]]/g, '');
        parts = cleaned.split(',').map(s => parseInt(s.trim()) || 0);
      }
    }
    // Try comma-separated format
    else if (sidecounts.includes(',')) {
      parts = sidecounts.split(',').map(s => parseInt(s.trim()) || 0);
    } 
    // Try space-separated format
    else if (sidecounts.includes(' ')) {
      parts = sidecounts.split(/\s+/).map(s => parseInt(s.trim()) || 0);
    }
    // Single number or unknown format
    else {
      const num = parseInt(sidecounts);
      if (!isNaN(num)) {
        parts = [num];
      }
    }
    
    // Ensure we have at least 4 values
    while (parts.length < 4) {
      parts.push(0);
    }
    
    return {
      blufor: parts[0] || 0,
      opfor: parts[1] || 0,
      independent: parts[2] || 0,
      civilian: parts[3] || 0
    };
  }

  // Open mission stats dialog
  openMissionStatsDialog(mission: Mission): void {
    // Set processing flag to avoid multiple clicks
    this.processingMission = true;
    
    // Open the dialog
    const dialogRef = this.dialog.open(MissionStatsDialogComponent, {
      width: '1000px',
      maxWidth: '100vw',
      height: '80vh',
      data: { mission },
      disableClose: false,
      autoFocus: false,
      panelClass: 'mission-stats-dialog-panel',
      backdropClass: 'mission-stats-backdrop',
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '200ms'
    });
    
    // Reset processing flag when dialog is closed
    dialogRef.afterClosed().subscribe(() => {
      this.processingMission = false;
    });
  }
  
  private sortMissions(missions: Mission[], sort: Sort): Mission[] {
    if (!sort.active || sort.direction === '') {
      return missions;
    }

    return missions.slice().sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      
      switch (sort.active) {
        case 'name':
          return this.compare(a.name.toLowerCase(), b.name.toLowerCase(), isAsc);
        case 'author':
          return this.compare(a.author.toLowerCase(), b.author.toLowerCase(), isAsc);
        case 'terrain':
          return this.compare(a.terrain.toLowerCase(), b.terrain.toLowerCase(), isAsc);
        case 'gametype':
          return this.compare(a.gametype.toLowerCase(), b.gametype.toLowerCase(), isAsc);
        case 'players':
          return this.compare(a.players.toLowerCase(), b.players.toLowerCase(), isAsc);
        case 'sidecounts':
          return this.compare(a.sidecounts.toLowerCase(), b.sidecounts.toLowerCase(), isAsc);
        case 'description':
          return this.compare(a.description.toLowerCase(), b.description.toLowerCase(), isAsc);
        default:
          return 0;
      }
    });
  }

  private compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private updateFilterOptions(missions: Mission[]) {
    // Extract unique values for filter dropdowns
    this.gametypes = [...new Set(missions.map(m => m.gametype))].sort();
    this.terrains = [...new Set(missions.map(m => m.terrain))].sort();
    this.authors = [...new Set(missions.map(m => m.author))].sort();
  }

  // Helper method to format sidecounts for display
  formatSidecounts(sidecounts: string): string {
    if (!sidecounts) return 'N/A';
    
    let parts: number[] = [];
    
    // Handle JSON array format like "[27,40,0,0]"
    if (sidecounts.trim().startsWith('[') && sidecounts.trim().endsWith(']')) {
      try {
        const parsed = JSON.parse(sidecounts.trim());
        if (Array.isArray(parsed)) {
          parts = parsed.map(n => parseInt(n) || 0);
        }
      } catch (error) {
        // Fall back to manual parsing without brackets
        const cleaned = sidecounts.replace(/[\[\]]/g, '');
        parts = cleaned.split(',').map(s => parseInt(s.trim()) || 0);
      }
    }
    // Try comma-separated format
    else if (sidecounts.includes(',')) {
      parts = sidecounts.split(',').map(s => parseInt(s.trim()) || 0);
    } 
    // Try space-separated format
    else if (sidecounts.includes(' ')) {
      parts = sidecounts.split(/\s+/).map(s => parseInt(s.trim()) || 0);
    }
    // Single number or unknown format
    else {
      const num = parseInt(sidecounts);
      if (!isNaN(num)) {
        parts = [num];
      } else {
        return sidecounts; // Return as-is if we can't parse it
      }
    }
    
    // Filter out zeros and format
    const nonZero = parts.filter(n => n > 0);
    if (nonZero.length === 0) {
      return 'N/A';
    }
    
    return nonZero.join(' vs ');
  }
}
