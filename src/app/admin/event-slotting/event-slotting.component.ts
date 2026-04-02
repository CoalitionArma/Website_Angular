import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EventsService } from '../../services/events.service';
import { UserService } from '../../services/user.service';
import { Event, EventRole, EventSide, EventGroup, SlotRoleRequest, AdminSlotRequest } from '../../interfaces/event.interface';
import { DBUser } from '../../interfaces/user.interface';

@Component({
  selector: 'app-event-slotting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-slotting.component.html',
  styleUrl: './event-slotting.component.scss'
})
export class EventSlottingComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  users: DBUser[] = [];
  communityMap: Record<number, string> = {};
  selectedEventId: string = '';
  selectedEvent: Event | null = null;

  // Slot panel state
  slottingContext: { role: EventRole; sideId: string; groupId: string } | null = null;
  selectedTargetUserId: string = '';
  userSearchFilter: string = '';

  // UI state
  loading = false;
  submitting = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  private eventsSub?: Subscription;

  constructor(
    private eventsService: EventsService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.eventsSub = this.eventsService.events$.subscribe(events => {
      this.events = events;
      // Keep selectedEvent in sync after any update
      if (this.selectedEventId) {
        this.selectedEvent = this.events.find(e => e.id === this.selectedEventId) || null;
      }
      this.loading = false;
    });

    this.eventsService.loadEvents().subscribe();

    this.userService.getAllUsers().subscribe({
      next: (response: any) => {
        this.users = (response.users || []) as DBUser[];
      },
      error: () => {
        this.showMessage('Failed to load users list', 'error');
      }
    });

    this.userService.getCommunitiesList().subscribe({
      next: (response: any) => {
        const map: Record<number, string> = {};
        for (const c of (response.communities || [])) {
          map[c.id] = c.name;
        }
        this.communityMap = map;
      },
      error: () => {} // non-critical, silent
    });
  }

  ngOnDestroy(): void {
    this.eventsSub?.unsubscribe();
  }

  get filteredUsers(): DBUser[] {
    if (!this.userSearchFilter.trim()) return this.users;
    const q = this.userSearchFilter.trim().toLowerCase();
    return this.users.filter(u => u.username.toLowerCase().includes(q) ||
      (u.callsign && u.callsign.toLowerCase().includes(q)));
  }

  onEventSelect(eventId: string): void {
    this.selectedEventId = eventId;
    this.selectedEvent = this.events.find(e => e.id === eventId) || null;
    this.slottingContext = null;
  }

  openSlotPanel(role: EventRole, sideId: string, groupId: string): void {
    this.slottingContext = { role, sideId, groupId };
    this.selectedTargetUserId = role.slottedUserId || '';
    this.userSearchFilter = '';
  }

  closeSlotPanel(): void {
    this.slottingContext = null;
    this.selectedTargetUserId = '';
    this.userSearchFilter = '';
  }

  submitSlot(): void {
    if (!this.selectedEvent || !this.slottingContext || !this.selectedTargetUserId) return;

    const roleName = this.slottingContext.role.name;
    const payload: AdminSlotRequest = {
      eventId: this.selectedEvent.id,
      sideId: this.slottingContext.sideId,
      groupId: this.slottingContext.groupId,
      roleId: this.slottingContext.role.id,
      targetUserId: this.selectedTargetUserId
    };

    this.submitting = true;
    this.eventsService.adminSlotUser(payload).subscribe({
      next: (response) => {
        this.submitting = false;
        this.closeSlotPanel();
        const targetUser = this.users.find(u => u.discordid === payload.targetUserId);
        this.showMessage(`${targetUser?.username || 'User'} slotted into ${roleName}`, 'success');
      },
      error: (err) => {
        this.submitting = false;
        this.showMessage(err.error?.message || 'Failed to slot user', 'error');
      }
    });
  }

  kickFromRole(role: EventRole, sideId: string, groupId: string): void {
    if (!this.selectedEvent) return;

    const kickData: SlotRoleRequest = {
      eventId: this.selectedEvent.id,
      sideId,
      groupId,
      roleId: role.id
    };

    this.submitting = true;
    this.eventsService.adminKickFromRole(kickData).subscribe({
      next: () => {
        this.submitting = false;
        this.showMessage(`${role.slottedUser} removed from ${role.name}`, 'success');
      },
      error: (err) => {
        this.submitting = false;
        this.showMessage(err.error?.message || 'Failed to kick user', 'error');
      }
    });
  }

  getUserDisplayName(user: DBUser): string {
    const parts = [user.username];
    if (user.callsign) parts.push(`[${user.callsign}]`);
    if (!user.armaguid) parts.push('⚠ no ARMA GUID');
    return parts.join(' ');
  }

  private showMessage(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => { this.message = ''; }, 5000);
  }
}
