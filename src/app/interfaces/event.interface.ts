export interface EventRole {
  id: string;
  name: string;
  slottedUser?: string; // Discord username of slotted user, undefined if OPEN
  slottedUserId?: string; // Discord ID of slotted user
}

export interface EventGroup {
  id: string;
  name: string;
  roles: EventRole[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  bannerUrl?: string;
  dateTime: Date;
  createdBy: string; // Discord ID of creator
  createdByUsername: string; // Discord username of creator
  groups: EventGroup[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  bannerUrl?: string;
  dateTime: Date;
  groups: Omit<EventGroup, 'id'>[];
}

export interface CreateEventResponse {
  event: Event;
  success: boolean;
  message: string;
}

export interface SlotRoleRequest {
  eventId: string;
  groupId: string;
  roleId: string;
}

export interface SlotRoleResponse {
  event: Event;
  success: boolean;
  message: string;
}
