import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommunityService } from '../services/community.service';
import { Community, CreateCommunityRequest } from '../interfaces/community.interface';

@Component({
  selector: 'app-community-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './community-management.component.html',
  styleUrl: './community-management.component.scss'
})
export class CommunityManagementComponent implements OnInit {
  communities: Community[] = [];
  loading = false;
  error = '';
  
  // Form data for adding new community
  newCommunity: CreateCommunityRequest = {
    name: '',
    playercount: 0
  };
  
  // Form validation
  showForm = false;

  constructor(private communityService: CommunityService) {}

  ngOnInit(): void {
    this.loadCommunities();
  }

  loadCommunities(): void {
    this.loading = true;
    this.error = '';
    
    this.communityService.getCommunities().subscribe({
      next: (response) => {
        this.communities = response.communities || [];
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load communities. Please try again.';
        this.loading = false;
        console.error('Error loading communities:', error);
      }
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.newCommunity = {
      name: '',
      playercount: 0
    };
    this.error = '';
  }

  addCommunity(): void {
    if (!this.newCommunity.name.trim()) {
      this.error = 'Community name is required.';
      return;
    }

    this.loading = true;
    this.error = '';

    this.communityService.createCommunity(this.newCommunity).subscribe({
      next: (community) => {
        this.communities.push(community);
        this.communities.sort((a, b) => a.name.localeCompare(b.name));
        this.resetForm();
        this.showForm = false;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to add community. Please try again.';
        this.loading = false;
        console.error('Error adding community:', error);
      }
    });
  }

  deleteCommunity(community: Community): void {
    if (!confirm(`Are you sure you want to delete "${community.name}"?`)) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.communityService.deleteCommunity(community.id).subscribe({
      next: () => {
        this.communities = this.communities.filter(c => c.id !== community.id);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to delete community. Please try again.';
        this.loading = false;
        console.error('Error deleting community:', error);
      }
    });
  }

  updatePlayerCount(community: Community, event: Event): void {
    const target = event.target as HTMLInputElement;
    const newCount = parseInt(target.value);
    
    if (isNaN(newCount) || newCount < 0) {
      // Reset to original value if invalid
      target.value = community.playercount.toString();
      return;
    }

    this.communityService.updateCommunityPlayerCount(community.id, newCount).subscribe({
      next: (updatedCommunity) => {
        const index = this.communities.findIndex(c => c.id === community.id);
        if (index !== -1) {
          this.communities[index] = updatedCommunity;
        }
      },
      error: (error) => {
        this.error = 'Failed to update player count.';
        // Reset to original value on error
        target.value = community.playercount.toString();
        console.error('Error updating player count:', error);
      }
    });
  }

  getTotalPlayers(): number {
    return this.communities.reduce((total, community) => total + community.playercount, 0);
  }

  getTotalEventsAttended(): number {
    return this.communities.reduce((total, community) => total + community.events_attended, 0);
  }
}