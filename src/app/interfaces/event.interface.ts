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

export interface EventSide {
  id: string;
  name: string;
  color?: string; // Optional color for the side (e.g., "#4a7c59" for coalition, "#b64141" for opposition)
  groups: EventGroup[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  bannerUrl?: string;
  dateTime: Date;
  slotUnlockTime?: Date; // When slots become available for signup
  createdBy: string; // Discord ID of creator
  createdByUsername: string; // Discord username of creator
  sides: EventSide[]; // Multi-side support
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  bannerUrl?: string;
  dateTime: Date;
  slotUnlockTime?: Date;
  sides: Omit<EventSide, 'id'>[];
}

export interface CreateEventResponse {
  event: Event;
  success: boolean;
  message: string;
}

export interface SlotRoleRequest {
  eventId: string;
  sideId: string;
  groupId: string;
  roleId: string;
}

export interface SlotRoleResponse {
  event: Event;
  success: boolean;
  message: string;
}
