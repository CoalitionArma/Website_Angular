import { Request } from 'express';

export interface CreateUserRequest {
    id: string;
    email: string;
    global_name: string;
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
}

export interface UpdateCallsignRequest {
    targetUserId: string;
    callsign: string;
}

export interface AuthenticatedRequest extends Request {
    body: any & { id?: string };
}