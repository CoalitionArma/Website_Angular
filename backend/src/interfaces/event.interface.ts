export type GameType = 'TVT' | 'COOP' | 'COTVT';

export interface EventSide {
    id: string;
    name: string;
    color: string;
    groups: EventGroup[];
    discordRoleId?: string; // Discord role ID for this side
    discordLeaderRoleId?: string; // Discord leader role ID for this side
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
    slottedUserId?: string; // Discord ID (primary identifier for authority)
    slottedUserArmaGuid?: string; // ARMA GUID (for reference/display)
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
        discordRoleId?: string; // Discord role ID for this side
        discordLeaderRoleId?: string; // Discord leader role ID for this side
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
        discordRoleId?: string; // Discord role ID for this side
        discordLeaderRoleId?: string; // Discord leader role ID for this side
        groups: Array<{
            id?: string; // Optional for edit mode
            name: string;
            communityRestriction?: number | null;
            roles: Array<{ 
                id?: string; // Optional for edit mode
                name: string;
                communityRestriction?: number | null;
                slottedUser?: string; // Preserve existing slot data
                slottedUserId?: string; // Preserve existing Discord ID data (primary authority)
                slottedUserArmaGuid?: string; // Preserve existing ARMA GUID data
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