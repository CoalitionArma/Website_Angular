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
    groups: Array<{
        name: string;
        roles: Array<{ name: string }>;
    }>;
}

export interface SlotRoleRequest {
    eventId: string;
    groupId: string;
    roleId: string;
}