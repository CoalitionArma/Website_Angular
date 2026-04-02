import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { CommunityManagementComponent } from '../community-management/community-management.component';
import { UserManagementComponent } from '../user-management/user-management.component';
import { EventSlottingComponent } from './event-slotting/event-slotting.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, CommunityManagementComponent, UserManagementComponent, EventSlottingComponent],
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

  showEventSlotting(): void {
    this.selectedView = 'event-slotting';
  }

  showDashboard(): void {
    this.selectedView = '';
  }
}