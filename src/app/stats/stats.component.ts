import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Mission, MissionsResponse, MissionFilters } from '../interfaces/mission.interface';
import { MissionService } from '../services/mission.service';

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
export class StatsComponent implements OnInit {
  missions: Mission[] = [];
  loading = false;
  error: string | null = null;
  
  // Pagination
  totalMissions = 0;
  pageSize = 20;
  currentPage = 0;
  
  // Filters
  searchTerm = '';
  selectedGametype = '';
  selectedTerrain = '';
  selectedAuthor = '';
  
  // Table columns
  displayedColumns: string[] = ['name', 'author', 'terrain', 'gametype', 'players', 'description'];
  
  // Filter options (will be populated from data)
  gametypes: string[] = [];
  terrains: string[] = [];
  authors: string[] = [];

  constructor(private missionService: MissionService) {}

  ngOnInit() {
    this.loadMissions();
  }

  loadMissions() {
    this.loading = true;
    this.error = null;
    
    const filters: MissionFilters = {
      limit: this.pageSize,
      offset: this.currentPage * this.pageSize,
      search: this.searchTerm || undefined,
      gametype: this.selectedGametype || undefined,
      terrain: this.selectedTerrain || undefined,
      author: this.selectedAuthor || undefined
    };

    this.missionService.getMissions(filters).subscribe({
      next: (response: MissionsResponse) => {
        this.missions = response.missions;
        this.totalMissions = response.total_count;
        this.updateFilterOptions();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading missions:', error);
        this.error = 'Failed to load missions. Please try again.';
        this.loading = false;
      }
    });
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

  clearFilters() {
    this.searchTerm = '';
    this.selectedGametype = '';
    this.selectedTerrain = '';
    this.selectedAuthor = '';
    this.currentPage = 0;
    this.loadMissions();
  }

  private updateFilterOptions() {
    // Extract unique values for filter dropdowns
    this.gametypes = [...new Set(this.missions.map(m => m.gametype))].sort();
    this.terrains = [...new Set(this.missions.map(m => m.terrain))].sort();
    this.authors = [...new Set(this.missions.map(m => m.author))].sort();
  }
}
