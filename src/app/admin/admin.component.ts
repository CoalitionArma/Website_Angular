import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { CommunityManagementComponent } from '../community-management/community-management.component';
import { UserManagementComponent } from '../user-management/user-management.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, CommunityManagementComponent, UserManagementComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  
  selectedView: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    // Double check that user is admin, redirect if not
    if (!this.userService.dbUser?.isAdmin) {
      this.router.navigate(['/']);
    }
  }

  get currentUser() {
    return this.userService.dbUser;
  }

  showCommunityManagement(): void {
    this.selectedView = 'community';
  }

  showUserManagement(): void {
    this.selectedView = 'users';
  }

  showDashboard(): void {
    this.selectedView = '';
  }
}