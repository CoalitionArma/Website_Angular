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
  isLoading = false;
  private eventsSubscription?: Subscription;

  constructor(
    private eventsService: EventsService,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    
    // Subscribe to events updates
    this.eventsSubscription = this.eventsService.events$.subscribe(events => {
      this.events = events.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    });
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
        this.snackBar.open('Failed to load events', 'Close', { duration: 3000 });
        console.error('Error loading events:', error);
      }
    });
  }

  openCreateEventDialog(): void {
    if (!this.userService.loggedIn) {
      this.snackBar.open('You must be logged in to create events', 'Close', { duration: 3000 });
      return;
    }
    
    if (!this.isAdmin) {
      this.snackBar.open('Only administrators can create events', 'Close', { duration: 3000 });
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
          this.snackBar.open('Event created successfully!', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open(response.message || 'Failed to create event', 'Close', { duration: 3000 });
        }
      },
      error: (error) => {
        this.snackBar.open('Failed to create event', 'Close', { duration: 3000 });
        console.error('Error creating event:', error);
      }
    });
  }

  slotRole(eventId: string, groupId: string, roleId: string): void {
    if (!this.userService.loggedIn) {
      this.snackBar.open('You must be logged in to slot into roles', 'Close', { duration: 3000 });
      return;
    }

    const slotData: SlotRoleRequest = {
      eventId,
      groupId,
      roleId
    };

    this.eventsService.slotRole(slotData).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Successfully slotted into role!', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open(response.message || 'Failed to slot into role', 'Close', { duration: 3000 });
        }
      },
      error: (error) => {
        this.snackBar.open('Failed to slot into role', 'Close', { duration: 3000 });
        console.error('Error slotting role:', error);
      }
    });
  }

  unslotRole(eventId: string, groupId: string, roleId: string): void {
    if (!this.userService.loggedIn) {
      this.snackBar.open('You must be logged in to unslot from roles', 'Close', { duration: 3000 });
      return;
    }

    const slotData: SlotRoleRequest = {
      eventId,
      groupId,
      roleId
    };

    this.eventsService.unslotRole(slotData).subscribe({
      next: (response) => {
        if (response.success) {
          this.snackBar.open('Successfully unslotted from role!', 'Close', { duration: 3000 });
        } else {
          this.snackBar.open(response.message || 'Failed to unslot from role', 'Close', { duration: 3000 });
        }
      },
      error: (error) => {
        this.snackBar.open('Failed to unslot from role', 'Close', { duration: 3000 });
        console.error('Error unslotting role:', error);
      }
    });
  }

  canSlotRole(event: Event, groupId: string, roleId: string): boolean {
    if (!this.userService.loggedIn || !this.userService.dbUser) {
      return false;
    }

    const group = event.groups.find(g => g.id === groupId);
    if (!group) return false;

    const role = group.roles.find(r => r.id === roleId);
    if (!role) return false;

    // User can slot if role is open or if they are already slotted in it
    return !role.slottedUserId || role.slottedUserId === this.userService.dbUser.discordid;
  }

  isUserSlottedInRole(event: Event, groupId: string, roleId: string): boolean {
    if (!this.userService.loggedIn || !this.userService.dbUser) {
      return false;
    }

    const group = event.groups.find(g => g.id === groupId);
    if (!group) return false;

    const role = group.roles.find(r => r.id === roleId);
    if (!role) return false;

    return role.slottedUserId === this.userService.dbUser.discordid;
  }

  deleteEvent(eventId: string): void {
    if (!this.userService.loggedIn) {
      this.snackBar.open('You must be logged in to delete events', 'Close', { duration: 3000 });
      return;
    }

    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      this.eventsService.deleteEvent(eventId).subscribe({
        next: () => {
          this.snackBar.open('Event deleted successfully!', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Failed to delete event', 'Close', { duration: 3000 });
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
}
