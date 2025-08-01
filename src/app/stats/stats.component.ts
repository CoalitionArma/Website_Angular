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
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Mission, MissionFilters } from '../interfaces/mission.interface';
import * as MissionsActions from '../store/missions.actions';
import * as MissionsSelectors from '../store/missions.selectors';

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
    MatProgressSpinnerModule
  ],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  
  // Observables from store
  missions$: Observable<Mission[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  totalMissions$: Observable<number>;
  currentPage$: Observable<number>;
  totalPages$: Observable<number>;
  
  // Local component state
  pageSize = 20;
  currentPage = 0;
  
  // Filters
  searchTerm = '';
  selectedGametype = '';
  selectedTerrain = '';
  selectedAuthor = '';
  
  // Table columns
  displayedColumns: string[] = ['name', 'author', 'terrain', 'gametype', 'players', 'description'];
  
  // Filter options (computed from store data)
  gametypes: string[] = [];
  terrains: string[] = [];
  authors: string[] = [];

  constructor(private store: Store) {
    // Initialize observables
    this.missions$ = this.store.select(MissionsSelectors.selectMissions);
    this.loading$ = this.store.select(MissionsSelectors.selectMissionsLoading);
    this.error$ = this.store.select(MissionsSelectors.selectMissionsError);
    this.totalMissions$ = this.store.select(MissionsSelectors.selectMissionsTotalCount);
    this.currentPage$ = this.store.select(MissionsSelectors.selectMissionsCurrentPage);
    this.totalPages$ = this.store.select(MissionsSelectors.selectMissionsTotalPages);
  }

  ngOnInit() {
    // Set up search debouncing
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.onFilterChange();
    });

    // Subscribe to missions to update filter options
    this.missions$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(missions => {
      this.updateFilterOptions(missions);
    });

    // Load initial missions
    this.loadMissions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

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

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadMissions();
  }

  onFilterChange() {
    this.currentPage = 0; // Reset to first page when filtering
    this.loadMissions();
  }

  onSearchInput(searchTerm: string) {
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

  private updateFilterOptions(missions: Mission[]) {
    // Extract unique values for filter dropdowns
    this.gametypes = [...new Set(missions.map(m => m.gametype))].sort();
    this.terrains = [...new Set(missions.map(m => m.terrain))].sort();
    this.authors = [...new Set(missions.map(m => m.author))].sort();
  }
}
