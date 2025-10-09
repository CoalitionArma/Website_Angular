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

  // Asynchronous toast message helper to prevent UI freezing
  private showToast(message: string, action: string = 'Close', duration: number = 3000): void {
    // Use setTimeout to make the toast asynchronous and prevent UI blocking
    setTimeout(() => {
      this.snackBar.open(message, action, {
        duration: duration,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        // Remove politeness to prevent accessibility blocking
        panelClass: ['custom-snackbar']
      });
    }, 0);
  }

  ngOnInit(): void {
    this.loadEvents();
    
    // Subscribe to events updates
    this.eventsSubscription = this.eventsService.events$.subscribe(events => {
      this.allEvents = events.sort((a, b) => {
        const dateA = new Date(a.dateTime);
        const dateB = new Date(b.dateTime);
        
        // Handle invalid dates - put them at the end
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;
        
        return dateA.getTime() - dateB.getTime();
      });
      this.filterFutureEvents();
      
      // Check for URL fragment after events are loaded
      this.checkForUrlFragment();
    });

    // Listen for URL fragment changes
    this.route.fragment.subscribe(fragment => {
      this.handleFragment(fragment);
    });
  }

  private checkForUrlFragment(): void {
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

    // Check if fragment starts with 'event-'
    if (fragment.startsWith('event-')) {
      const eventId = fragment.substring(6); // Remove 'event-' prefix
      this.highlightedRoleId = null;
      this.highlightedGroupId = null;
      
      // Find the event with this ID
      const targetEvent = this.allEvents.find(event => event.id === eventId);
      
      if (targetEvent) {
        // Set the target event as selected
        this.selectedEvent = targetEvent;
        
        // Find the index of this event in the filtered events array
        const eventIndex = this.events.findIndex(event => event.id === eventId);
        if (eventIndex !== -1) {
          this.currentPage = eventIndex;
        }
        
        // Scroll to the event after a short delay to ensure DOM is updated
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            });
          }
        }, 100);
      }
    }
    // Check if fragment starts with 'role-'
    else if (fragment.startsWith('role-')) {
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
    this.events = this.allEvents.filter(event => {
      const eventDate = new Date(event.dateTime);
      
      // Skip events with invalid dates
      if (isNaN(eventDate.getTime())) {
        console.error('Event with invalid dateTime:', event.id, event.dateTime);
        return false;
      }
      
      return eventDate > now;
    });
    
    // Reset pagination when events change
    if (this.currentPage >= this.events.length) {
      this.currentPage = Math.max(0, this.events.length - 1);
    }
    
    // If selected event is now in the past, deselect it
    if (this.selectedEvent) {
      const selectedEventDate = new Date(this.selectedEvent.dateTime);
      if (isNaN(selectedEventDate.getTime()) || selectedEventDate <= now) {
        this.selectedEvent = null;
      }
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
        this.showToast('Failed to load events');
        console.error('Error loading events:', error);
      }
    });
  }

  openCreateEventDialog(): void {
    if (!this.userService.loggedIn) {
      this.showToast('You must be logged in to create events');
      return;
    }
    
    if (!this.isAdmin) {
      this.showToast('Only administrators can create events');
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
          this.showToast('Event created successfully!');
        } else {
          this.showToast(response.message || 'Failed to create event');
        }
      },
      error: (error) => {
        this.showToast('Failed to create event');
        console.error('Error creating event:', error);
      }
    });
  }

  editEvent(event: Event): void {
    if (!this.isAdmin) {
      this.showToast('Only administrators can edit events');
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
          this.showToast('Event updated successfully!');
        } else {
          this.showToast(response.message || 'Failed to update event');
        }
      },
      error: (error) => {
        this.showToast('Failed to update event');
        console.error('Error updating event:', error);
      }
    });
  }

  slotRole(eventId: string, sideId: string, groupId: string, roleId: string): void {
    if (!this.userService.loggedIn) {
      this.showToast('You must be logged in to slot into roles');
      return;
    }

    if (!this.userService.dbUser?.armaguid) {
      this.showToast('You must add your ARMA GUID to your profile before slotting into roles', 'Close', 5000);
      return;
    }

    // Find the event to check timing restrictions for non-admins
    const event = this.events.find(e => e.id === eventId);
    if (event && event.slotUnlockTime && new Date() < new Date(event.slotUnlockTime) && !this.isAdmin) {
      this.showToast('Slot signups are not yet available for this event', 'Close', 3000);
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
          this.showToast('Successfully slotted into role!');
        } else {
          this.showToast(response.message || 'Failed to slot into role');
        }
      },
      error: (error) => {
        this.showToast('Failed to slot into role');
        console.error('Error slotting role:', error);
      }
    });
  }

  unslotRole(eventId: string, sideId: string, groupId: string, roleId: string): void {
    if (!this.userService.loggedIn) {
      this.showToast('You must be logged in to unslot from roles');
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
          this.showToast('Successfully unslotted from role!');
        } else {
          this.showToast(response.message || 'Failed to unslot from role');
        }
      },
      error: (error) => {
        this.showToast('Failed to unslot from role');
        console.error('Error unslotting role:', error);
      }
    });
  }

  kickUserFromRole(eventId: string, sideId: string, groupId: string, roleId: string): void {
    if (!this.isAdmin) {
      this.showToast('Only administrators can kick users from roles');
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
          this.showToast(response.message || 'Successfully kicked user from role!');
        } else {
          this.showToast(response.message || 'Failed to kick user from role');
        }
      },
      error: (error) => {
        this.showToast('Failed to kick user from role');
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

    // Check if slots are unlocked (if slotUnlockTime is set) - admins can bypass this
    if (event.slotUnlockTime && new Date() < new Date(event.slotUnlockTime) && !this.isAdmin) {
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
    if (!event.slotUnlockTime) return false;
    
    const unlockTime = new Date(event.slotUnlockTime);
    
    // If unlock time is invalid, assume slots are not locked (safer default)
    if (isNaN(unlockTime.getTime())) {
      console.error('Invalid slotUnlockTime in areSlotsLocked:', event.slotUnlockTime);
      return false;
    }
    
    return new Date() < unlockTime;
  }

  getSlotLockMessage(event: Event): string {
    if (!event.slotUnlockTime) return '';
    
    const unlockTime = new Date(event.slotUnlockTime);
    const now = new Date();
    
    // Check if unlock time is valid
    if (isNaN(unlockTime.getTime())) {
      console.error('Invalid slotUnlockTime in event:', event.slotUnlockTime);
      return '';
    }
    
    if (now >= unlockTime) return '';
    
    if (this.isAdmin) {
      return `Slots locked for regular users until ${this.formatDateTime(unlockTime)} (Admin: You can slot anyway)`;
    }
    
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
      this.showToast('You must be logged in to delete events', 'Close', 3000);
      return;
    }

    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      this.eventsService.deleteEvent(eventId).subscribe({
        next: () => {
          this.showToast('Event deleted successfully!', 'Close', 3000);
        },
        error: (error) => {
          this.showToast('Failed to delete event', 'Close', 3000);
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
      if (this.isAdmin) {
        return 'Admin: Click to slot (slots are locked for regular users until: ' + this.formatDateTime(event.slotUnlockTime) + ')';
      }
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

  formatDateTime(date: Date | string): string {
    const dateObj = new Date(date);
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date provided to formatDateTime:', date);
      return 'Invalid Date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(dateObj);
  }

  isEventInPast(date: Date | string): boolean {
    const dateObj = new Date(date);
    
    // If date is invalid, consider it not in the past (safer default)
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date provided to isEventInPast:', date);
      return false;
    }
    
    return new Date() > dateObj;
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
        this.showToast('Role link copied!', 'Close', 2000);
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
        this.showToast('Group link copied!', 'Close', 2000);
      }).catch(err => {
        console.error('Failed to copy to clipboard:', err);
        this.fallbackCopyTextToClipboard(groupAnchorUrl);
      });
    } else {
      // Fallback for older browsers or non-secure contexts
      this.fallbackCopyTextToClipboard(groupAnchorUrl);
    }
  }

  copyEventLink(eventId: string): void {
    const currentUrl = window.location.origin + window.location.pathname;
    const eventAnchorUrl = `${currentUrl}#event-${eventId}`;
    
    // Use the modern Clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(eventAnchorUrl).then(() => {
        this.showToast('Event link copied!', 'Close', 2000);
      }).catch(err => {
        console.error('Failed to copy to clipboard:', err);
        this.fallbackCopyTextToClipboard(eventAnchorUrl);
      });
    } else {
      // Fallback for older browsers or non-secure contexts
      this.fallbackCopyTextToClipboard(eventAnchorUrl);
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
        this.showToast(message, 'Close', 2000);
      } else {
        this.showToast('Failed to copy link', 'Close', 3000);
      }
    } catch (err) {
      console.error('Fallback: Could not copy text:', err);
      this.showToast('Failed to copy link', 'Close', 3000);
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
