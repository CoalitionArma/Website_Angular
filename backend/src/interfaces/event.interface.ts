export interface EventSide {
    id: string;
    name: string;
    color: string;
    groups: EventGroup[];
}

export interface EventGroup {
    id: string;
    name: string;
    roles: EventRole[];
}

export interface EventRole {
    id: string;
    name: string;
    slottedUser?: string;
    slottedUserId?: string;
}

export interface CreateEventRequest {
    title: string;
    description?: string;
    bannerUrl?: string;
    dateTime: string;
    slotUnlockTime?: string; // When slots become available for signup
    sides: Array<{
        name: string;
        color: string;
        groups: Array<{
            name: string;
            roles: Array<{ name: string }>;
        }>;
    }>;
}

export interface SlotRoleRequest {
    eventId: string;
    sideId: string;
    groupId: string;
    roleId: string;
}