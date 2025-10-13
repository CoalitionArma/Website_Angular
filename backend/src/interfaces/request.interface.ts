import { Request } from 'express';

export interface CreateUserRequest {
    id: string;
    email: string;
    global_name: string | null;
    username: string;
}

export interface UpdateUserRequest {
    id?: string;
    discordid: string;
    steamid?: string;
    email: string;
    teamspeakid?: string;
    username: string;
    section?: string;
    veterancy?: string;
    armaguid?: string;
    callsign?: string;
    isAdmin?: boolean;
    communityId?: number | null;
}

export interface UpdateCallsignRequest {
    targetUserId: string;
    callsign: string;
}

export interface CreateCommunityRequest {
    name: string;
    playercount?: number;
}

export interface UpdateCommunityRequest {
    playercount: number;
}

export interface AuthenticatedRequest extends Request {
    body: any & { id?: string };
}