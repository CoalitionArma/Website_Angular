export type GameType = 'TVT' | 'COOP' | 'COTVT';

export interface EventSide {
    id: string;
    name: string;
    color: string;
    groups: EventGroup[];
}

export interface EventGroup {
    id: string;
    name: string;
    communityRestriction?: number | null;
    roles: EventRole[];
}

export interface EventRole {
    id: string;
    name: string;
    communityRestriction?: number | null;
    slottedUser?: string;
    slottedUserId?: string;
}

export interface CreateEventRequest {
    title: string;
    description?: string;
    gametype?: GameType; // Game type: TVT, COOP, or COTVT
    bannerUrl?: string;
    warno?: string; // Warning Order
    discordEventThread?: string; // Discord Event Thread URL
    dateTime: string;
    slotUnlockTime?: string; // When slots become available for signup
    sides: Array<{
        name: string;
        color: string;
        groups: Array<{
            name: string;
            communityRestriction?: number | null;
            roles: Array<{ 
                name: string;
                communityRestriction?: number | null;
            }>;
        }>;
    }>;
}

export interface UpdateEventRequest {
    title: string;
    description?: string;
    gametype?: GameType; // Game type: TVT, COOP, or COTVT
    bannerUrl?: string;
    warno?: string; // Warning Order
    discordEventThread?: string; // Discord Event Thread URL
    dateTime: string;
    slotUnlockTime?: string;
    sides: Array<{
        id?: string; // Optional for edit mode
        name: string;
        color: string;
        groups: Array<{
            id?: string; // Optional for edit mode
            name: string;
            communityRestriction?: number | null;
            roles: Array<{ 
                id?: string; // Optional for edit mode
                name: string;
                communityRestriction?: number | null;
                slottedUser?: string; // Preserve existing slot data
                slottedUserId?: string; // Preserve existing slot data
            }>;
        }>;
    }>;
}

export interface SlotRoleRequest {
    eventId: string;
    sideId: string;
    groupId: string;
    roleId: string;
}