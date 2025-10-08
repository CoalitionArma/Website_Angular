import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { NativeDateAdapter } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Event, SlotRoleRequest } from '../interfaces/event.interface';
import { EventsService } from '../services/events.service';
import { UserService } from '../services/user.service';
import { CreateEventDialogComponent } from './create-event-dialog/create-event-dialog.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' }
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  allEvents: Event[] = [];
  selectedEvent: Event | null = null;
  isLoading = false;
  highlightedRoleId: string | null = null;
  highlightedGroupId: string | null = null;
  
  // Group collapse state - stores which groups are expanded
  expandedGroups: Set<string> = new Set();
  
  // Pagination properties
  currentPage = 0;
  pageSize = 1; // One event per page
  
  private eventsSubscription?: Subscription;

  constructor(
    private eventsService: EventsService,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    
    // Subscribe to events updates
    this.eventsSubscription = this.eventsService.events$.subscribe(events => {
      this.allEvents = events.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
      this.filterFutureEvents();
      
      // Check for URL fragment after events are loaded
      this.checkForRoleFragment();
    });

    // Listen for URL fragment changes
    this.route.fragment.subscribe(fragment => {
      this.handleFragment(fragment);
    });
  }

  private checkForRoleFragment(): void {
    const fragment = this.route.snapshot.fragment;
    if (fragment) {
      this.handleFragment(fragment);
    }
  }

  private handleFragment(fragment: string | null): void {
    if (!fragment) {
      this.highlightedRoleId = null;
      this.highlightedGroupId = null;
      return;
    }

    // Check if fragment starts with 'role-'
    if (fragment.startsWith('role-')) {
      const roleId = fragment.substring(5); // Remove 'role-' prefix
      this.highlightedRoleId = roleId;
      this.highlightedGroupId = null;
      
      // Find the event containing this role and expand it
      const eventWithRole = this.allEvents.find(event => 
        event.sides.some(side =>
          side.groups.some(group => 
            group.roles.some(role => role.id === roleId)
          )
        )
      );
      
      if (eventWithRole) {
        this.selectedEvent = eventWithRole;
        
        // Find and expand the group containing the highlighted role
        eventWithRole.sides.forEach(side => {
          side.groups.forEach(group => {
            if (group.roles.some(role => role.id === roleId)) {
              this.expandedGroups.add(group.id);
            }
          });
        });
        
        // Scroll to the role after a short delay to ensure DOM is updated
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 100);
      }
    }
    // Check if fragment starts with 'group-'
    else if (fragment.startsWith('group-')) {
      const groupId = fragment.substring(6); // Remove 'group-' prefix
      this.highlightedGroupId = groupId;
      this.highlightedRoleId = null;
      
      // Find the event containing this group and expand it
      const eventWithGroup = this.allEvents.find(event => 
        event.sides.some(side =>
          side.groups.some(group => group.id === groupId)
        )
      );
      
      if (eventWithGroup) {
        this.selectedEvent = eventWithGroup;
        
        // Expand the highlighted group
        this.expandedGroups.add(groupId);
        
        // Scroll to the group after a short delay to ensure DOM is updated
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 100);
      }
    }
  }

  private filterFutureEvents(): void {
    const now = new Date();
    this.events = this.allEvents.filter(event => new Date(event.dateTime) > now);
    
    // Reset pagination when events change
    if (this.currentPage >= this.events.length) {
      this.currentPage = Math.max(0, this.events.length - 1);
    }
    
    // If selected event is now in the past, deselect it
    if (this.selectedEvent && new Date(this.selectedEvent.dateTime) <= now) {
      this.selectedEvent = null;
    }
  }

  ngOnDestroy(): void {
    this.eventsSubscription?.unsubscribe();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventsService.loadEvents().subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to load events', 'Close', { 
          duration: 3000,
          politeness: 'polite'
        });
        console.error('Error loading events:', error);
      }
    });
  }

  openCreateEventDialog(): void {
    if (!this.userService.loggedIn) {
      this.snackBar.open('You must be logged in to create events', 'Close', { 
        duration: 3000,
        politeness: 'polite'
      });
      return;
    }
    
    if (!this.isAdmin) {
      this.snackBar.open('Only administrators can create events', 'Close', { 
        duration: 3000,
        politeness: 'polite'
      });
      return;
    }

    const dialogRef = this.dialog.open(CreateEventDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: false,
      autoFocus: false,
      panelClass: ['scrollable-dialog', 'events-dialog-container'],
      hasBackdrop: true,
      backdropClass: 'events-dialog-backdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createEvent(result);
      }
    });
  }

  createEvent(eventData: any): void {
    this.eventsService.createEvent(eventData).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Event created successfully!', 'Close', { 
            duration: 3000,
            politeness: 'polite'
          });
        } else {
          this.snackBar.open(response.message || 'Failed to create event', 'Close', { 
            duration: 3000,
            politeness: 'polite'
          });
        }
      },
      error: (error) => {
        this.snackBar.open('Failed to create event', 'Close', { 
          duration: 3000,
          politeness: 'polite'
        });
        console.error('Error creating event:', error);
      }
    });
  }

  editEvent(event: Event): void {
    if (!this.isAdmin) {
      this.snackBar.open('Only administrators can edit events', 'Close', { 
        duration: 3000,
        politeness: 'polite'
      });
      return;
    }

    const dialogRef = this.dialog.open(CreateEventDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      disableClose: false,
      autoFocus: false,
      panelClass: ['scrollable-dialog', 'events-dialog-container'],
      hasBackdrop: true,
      backdropClass: 'events-dialog-backdrop',
      data: { editMode: true, event: event } // Pass event data for editing
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateEvent(event.id, result);
      }
    });
  }

  openDiscordThread(url: string): void {
    window.open(url, '_blank');
  }

  updateEvent(eventId: string, eventData: any): void {
    this.eventsService.updateEvent(eventId, eventData).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Event updated successfully!', 'Close', { 
            duration: 3000,
            politeness: 'polite'
          });
        } else {
          this.snackBar.open(response.message || 'Failed to update event', 'Close', { 
            duration: 3000,
            politeness: 'polite'
          });
        }
      },
      error: (error) => {
        this.snackBar.open('Failed to update event', 'Close', { 
          duration: 3000,
          politeness: 'polite'
        });
        console.error('Error updating event:', error);
      }
    });
  }

  slotRole(eventId: string, sideId: string, groupId: string, roleId: string): void {
    if (!this.userService.loggedIn) {
      this.snackBar.open('You must be logged in to slot into roles', 'Close', { 
        duration: 3000,
        politeness: 'polite'
      });
      return;
    }

    if (!this.userService.dbUser?.armaguid) {
      this.snackBar.open('You must add your ARMA GUID to your profile before slotting into roles', 'Close', { 
        duration: 5000,
        politeness: 'polite'
      });
      return;
    }

    const slotData: SlotRoleRequest = {
      eventId,
      sideId,
      groupId,
      roleId
    };

    this.eventsService.slotRole(slotData).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Successfully slotted into role!', 'Close', { 
            duration: 3000,
            politeness: 'polite'
          });
        } else {
          this.snackBar.open(response.message || 'Failed to slot into role', 'Close', { 
            duration: 3000,
            politeness: 'polite'
          });
        }
      },
      error: (error) => {
        this.snackBar.open('Failed to slot into role', 'Close', { 
          duration: 3000,
          politeness: 'polite'
        });
        console.error('Error slotting role:', error);
      }
    });
  }

  unslotRole(eventId: string, sideId: string, groupId: string, roleId: string): void {
    if (!this.userService.loggedIn) {
      this.snackBar.open('You must be logged in to unslot from roles', 'Close', { 
        duration: 3000,
        politeness: 'polite'
      });
      return;
    }

    const slotData: SlotRoleRequest = {
      eventId,
      sideId,
      groupId,
      roleId
    };

    this.eventsService.unslotRole(slotData).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Successfully unslotted from role!', 'Close', { 
            duration: 3000,
            politeness: 'polite'
          });
        } else {
          this.snackBar.open(response.message || 'Failed to unslot from role', 'Close', { 
            duration: 3000,
            politeness: 'polite'
          });
        }
      },
      error: (error) => {
        this.snackBar.open('Failed to unslot from role', 'Close', { 
          duration: 3000,
          politeness: 'polite'
        });
        console.error('Error unslotting role:', error);
      }
    });
  }

  kickUserFromRole(eventId: string, sideId: string, groupId: string, roleId: string): void {
    if (!this.isAdmin) {
      this.snackBar.open('Only administrators can kick users from roles', 'Close', { 
        duration: 3000,
        politeness: 'polite'
      });
      return;
    }

    const slotData: SlotRoleRequest = {
      eventId,
      sideId,
      groupId,
      roleId
    };

    this.eventsService.adminKickFromRole(slotData).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open(response.message || 'Successfully kicked user from role!', 'Close', { 
            duration: 3000,
            politeness: 'polite'
          });
        } else {
          this.snackBar.open(response.message || 'Failed to kick user from role', 'Close', { 
            duration: 3000,
            politeness: 'polite'
          });
        }
      },
      error: (error) => {
        this.snackBar.open('Failed to kick user from role', 'Close', { 
          duration: 3000,
          politeness: 'polite'
        });
        console.error('Error kicking user from role:', error);
      }
    });
  }

  canSlotRole(event: Event, sideId: string, groupId: string, roleId: string): boolean {
    if (!this.userService.loggedIn || !this.userService.dbUser) {
      return false;
    }

    // Check if user has ARMA GUID in their profile
    if (!this.userService.dbUser.armaguid) {
      return false;
    }

    // Check if slots are unlocked (if slotUnlockTime is set)
    if (event.slotUnlockTime && new Date() < new Date(event.slotUnlockTime)) {
      return false;
    }

    const side = event.sides.find(s => s.id === sideId);
    if (!side) return false;

    const group = side.groups.find(g => g.id === groupId);
    if (!group) return false;

    const role = group.roles.find(r => r.id === roleId);
    if (!role) return false;

    // User can slot if role is open or if they are already slotted in it
    return !role.slottedUserId || role.slottedUserId === this.userService.dbUser.discordid;
  }

  areSlotsLocked(event: Event): boolean {
    return event.slotUnlockTime ? new Date() < new Date(event.slotUnlockTime) : false;
  }

  getSlotLockMessage(event: Event): string {
    if (!event.slotUnlockTime) return '';
    
    const unlockTime = new Date(event.slotUnlockTime);
    const now = new Date();
    
    if (now >= unlockTime) return '';
    
    return `Slots will unlock on ${this.formatDateTime(unlockTime)}`;
  }

  isUserSlottedInRole(event: Event, sideId: string, groupId: string, roleId: string): boolean {
    if (!this.userService.loggedIn || !this.userService.dbUser) {
      return false;
    }

    const side = event.sides.find(s => s.id === sideId);
    if (!side) return false;

    const group = side.groups.find(g => g.id === groupId);
    if (!group) return false;

    const role = group.roles.find(r => r.id === roleId);
    if (!role) return false;

    return role.slottedUserId === this.userService.dbUser.discordid;
  }

  deleteEvent(eventId: string): void {
    if (!this.userService.loggedIn) {
      this.snackBar.open('You must be logged in to delete events', 'Close', { 
        duration: 3000,
        politeness: 'polite'
      });
      return;
    }

    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      this.eventsService.deleteEvent(eventId).subscribe({
        next: () => {
          this.snackBar.open('Event deleted successfully!', 'Close', { 
            duration: 3000,
            politeness: 'polite'
          });
        },
        error: (error) => {
          this.snackBar.open('Failed to delete event', 'Close', { 
            duration: 3000,
            politeness: 'polite'
          });
          console.error('Error deleting event:', error);
        }
      });
    }
  }

  canDeleteEvent(event: Event): boolean {
    return this.userService.loggedIn && 
           this.userService.dbUser?.discordid === event.createdBy;
  }

  get isLoggedIn(): boolean {
    return this.userService.loggedIn;
  }

  get isAdmin(): boolean {
    return this.userService.loggedIn && this.userService.dbUser?.isAdmin === true;
  }

  get hasArmaGuid(): boolean {
    return !!(this.userService.dbUser?.armaguid);
  }

  getSlotButtonTooltip(event: Event, sideId: string, groupId: string, roleId: string): string {
    if (!this.userService.loggedIn) {
      return 'You must be logged in to slot into roles';
    }

    if (!this.userService.dbUser?.armaguid) {
      return 'You must add your ARMA GUID to your profile before slotting';
    }

    if (event.slotUnlockTime && new Date() < new Date(event.slotUnlockTime)) {
      return 'Slots are locked until: ' + this.formatDateTime(event.slotUnlockTime);
    }

    const side = event.sides.find(s => s.id === sideId);
    const group = side?.groups.find(g => g.id === groupId);
    const role = group?.roles.find(r => r.id === roleId);

    if (role?.slottedUserId && role.slottedUserId !== this.userService.dbUser?.discordid) {
      return `Role is occupied by ${role.slottedUser || 'another user'}`;
    }

    return 'Click to slot into this role';
  }

  formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(date);
  }

  isEventInPast(date: Date): boolean {
    return new Date() > date;
  }

  selectEvent(event: Event): void {
    this.selectedEvent = this.selectedEvent?.id === event.id ? null : event;
  }

  isEventSelected(event: Event): boolean {
    return this.selectedEvent?.id === event.id;
  }

  // Pagination methods
  get currentEvent(): Event | null {
    return this.events.length > 0 && this.currentPage < this.events.length 
      ? this.events[this.currentPage] 
      : null;
  }

  get totalPages(): number {
    return this.events.length;
  }

  get hasPreviousPage(): boolean {
    return this.currentPage > 0;
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.events.length - 1;
  }

  previousPage(): void {
    if (this.hasPreviousPage) {
      this.currentPage--;
      this.selectedEvent = null; // Reset selection when changing page
    }
  }

  nextPage(): void {
    if (this.hasNextPage) {
      this.currentPage++;
      this.selectedEvent = null; // Reset selection when changing page
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.events.length) {
      this.currentPage = page;
      this.selectedEvent = null; // Reset selection when changing page
    }
  }

  copyRoleLink(roleId: string): void {
    const currentUrl = window.location.origin + window.location.pathname;
    const roleAnchorUrl = `${currentUrl}#role-${roleId}`;
    
    // Use the modern Clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(roleAnchorUrl).then(() => {
        this.snackBar.open('Role link copied!', 'Close', { 
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          politeness: 'polite'
        });
      }).catch(err => {
        console.error('Failed to copy to clipboard:', err);
        this.fallbackCopyTextToClipboard(roleAnchorUrl);
      });
    } else {
      // Fallback for older browsers or non-secure contexts
      this.fallbackCopyTextToClipboard(roleAnchorUrl);
    }
  }

  copyGroupLink(groupId: string): void {
    const currentUrl = window.location.origin + window.location.pathname;
    const groupAnchorUrl = `${currentUrl}#group-${groupId}`;
    
    // Use the modern Clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(groupAnchorUrl).then(() => {
        this.snackBar.open('Group link copied!', 'Close', { 
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          politeness: 'polite'
        });
      }).catch(err => {
        console.error('Failed to copy to clipboard:', err);
        this.fallbackCopyTextToClipboard(groupAnchorUrl);
      });
    } else {
      // Fallback for older browsers or non-secure contexts
      this.fallbackCopyTextToClipboard(groupAnchorUrl);
    }
  }

  private fallbackCopyTextToClipboard(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        const message = text.includes('#group-') ? 'Group link copied!' : 'Role link copied!';
        this.snackBar.open(message, 'Close', { 
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          politeness: 'polite'
        });
      } else {
        this.snackBar.open('Failed to copy link', 'Close', { 
          duration: 3000,
          politeness: 'polite'
        });
      }
    } catch (err) {
      console.error('Fallback: Could not copy text:', err);
      this.snackBar.open('Failed to copy link', 'Close', { 
        duration: 3000,
        politeness: 'polite'
      });
    }
    
    document.body.removeChild(textArea);
  }

  // Slot counting methods
  getSlottedCount(event: Event): number {
    let slottedCount = 0;
    event.sides.forEach(side => {
      side.groups.forEach(group => {
        group.roles.forEach(role => {
          if (role.slottedUserId) {
            slottedCount++;
          }
        });
      });
    });
    return slottedCount;
  }

  getTotalRoles(event: Event): number {
    let totalRoles = 0;
    event.sides.forEach(side => {
      side.groups.forEach(group => {
        totalRoles += group.roles.length;
      });
    });
    return totalRoles;
  }

  getSlotSummary(event: Event): string {
    const slotted = this.getSlottedCount(event);
    const total = this.getTotalRoles(event);
    return `${slotted} / ${total}`;
  }

  // Group collapse/expand methods
  toggleGroup(groupId: string): void {
    if (this.expandedGroups.has(groupId)) {
      this.expandedGroups.delete(groupId);
    } else {
      this.expandedGroups.add(groupId);
    }
  }

  isGroupExpanded(groupId: string): boolean {
    return this.expandedGroups.has(groupId);
  }

  getGroupSlotSummary(group: any): string {
    const slottedCount = group.roles.filter((role: any) => role.slottedUserId).length;
    const totalCount = group.roles.length;
    return `${slottedCount}/${totalCount}`;
  }

  getGroupSlotClass(group: any): string {
    const slottedCount = group.roles.filter((role: any) => role.slottedUserId).length;
    const totalCount = group.roles.length;
    
    if (slottedCount === 0) {
      return 'group-empty';
    } else if (slottedCount === totalCount) {
      return 'group-full';
    } else {
      return 'group-partial';
    }
  }

  expandAllGroups(event: Event): void {
    event.sides.forEach(side => {
      side.groups.forEach(group => {
        this.expandedGroups.add(group.id);
      });
    });
  }

  collapseAllGroups(event: Event): void {
    event.sides.forEach(side => {
      side.groups.forEach(group => {
        this.expandedGroups.delete(group.id);
      });
    });
  }
}
