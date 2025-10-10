export interface Token {
    token: string;
}

export interface DiscordUserResponse {
    id: string;
    avatar: string;
    global_name: string | null;
    username: string;
    email: string;
}