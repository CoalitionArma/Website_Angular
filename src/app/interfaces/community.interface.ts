export interface Community {
    id: number;
    name: string;
    playercount: number;
    events_attended: number;
}

export interface CreateCommunityRequest {
    name: string;
    playercount?: number;
}

export interface CommunityResponse {
    communities: Community[];
}