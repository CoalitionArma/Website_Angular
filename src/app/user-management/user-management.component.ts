import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { DBUser } from '../interfaces/user.interface';
import { EditUserDialogComponent } from './edit-user-dialog.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  // Table configuration
  displayedColumns: string[] = ['username', 'callsign', 'section', 'veterancy', 'community', 'actions'];
  dataSource: DBUser[] = [];
  filteredDataSource: DBUser[] = [];
  
  // Loading states
  loading = false;
  updating = false;
  
  // Search and filter
  searchForm: FormGroup;
  
  // Communities list for dropdown
  communitiesList: any[] = [];
  
  // Toast notifications
  showSuccess = false;
  showError = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialog: MatDialog
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      section: [''],
      veterancy: ['']
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadCommunities();
    this.setupSearchFilter();
  }

  setupSearchFilter(): void {
    this.searchForm.valueChanges.subscribe(filters => {
      this.filterUsers(filters);
    });
  }

  filterUsers(filters: any): void {
    let filtered = [...this.dataSource];
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(term) ||
        (user.callsign && user.callsign.toLowerCase().includes(term)) ||
        user.email.toLowerCase().includes(term)
      );
    }
    
    if (filters.section && filters.section !== '') {
      filtered = filtered.filter(user => user.section === filters.section);
    }
    
    if (filters.veterancy && filters.veterancy !== '') {
      filtered = filtered.filter(user => user.veterancy === filters.veterancy);
    }
    
    this.filteredDataSource = filtered;
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        this.dataSource = response.users || [];
        this.filteredDataSource = [...this.dataSource];
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Failed to load users:', error);
        this.loading = false;
        this.showErrorToast('Failed to load users: ' + (error.error?.message || error.message));
        this.dataSource = [];
        this.filteredDataSource = [];
      }
    });
  }

  loadCommunities(): void {
    this.userService.getCommunitiesList().subscribe({
      next: (response: any) => {
        this.communitiesList = response.communities || [];
      },
      error: (error: any) => {
        console.error('Failed to load communities:', error);
        this.communitiesList = [];
      }
    });
  }

  getCommunityName(communityId: number | null): string {
    if (!communityId) return 'No Community';
    const community = this.communitiesList.find(c => c.id === communityId);
    return community ? community.name : 'Unknown Community';
  }

  // Toast notification methods
  showSuccessToast(message: string): void {
    this.successMessage = message;
    this.showSuccess = true;
    setTimeout(() => {
      this.showSuccess = false;
      this.successMessage = '';
    }, 4000);
  }

  showErrorToast(message: string): void {
    this.errorMessage = message;
    this.showError = true;
    setTimeout(() => {
      this.showError = false;
      this.errorMessage = '';
    }, 5000);
  }

  // Open edit user dialog
  editUser(user: DBUser): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '650px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: { user: user },
      disableClose: true,
      panelClass: 'edit-user-dialog-panel',
      hasBackdrop: true,
      backdropClass: 'edit-user-dialog-backdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User was successfully updated, refresh the data
        this.refreshData();
        this.showSuccessToast('User updated successfully!');
      }
    });
  }

  dismissToast(): void {
    this.showSuccess = false;
    this.showError = false;
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Refresh data
  refreshData(): void {
    this.loadUsers();
    this.loadCommunities();
  }
}