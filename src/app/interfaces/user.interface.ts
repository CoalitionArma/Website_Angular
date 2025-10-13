export interface DBUser {
    discordid: string;
    steamid: string | null;
    email: string;
    teamspeakid: string | null;
    username: string;
    section: string | null;
    veterancy: string | null;
    armaguid: string | null;
    isAdmin: boolean;
    callsign: string | null;
    communityId: number | null;
}

export interface DBUserResponse extends DBUser {
    token: string;
    user: DBUser;
}