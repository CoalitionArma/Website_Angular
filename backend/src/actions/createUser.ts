import { Sequelize, DataTypes } from 'sequelize';
import SQLUsers from '../models/userModel.interface';
import { DiscordUserResponse } from '../interfaces/userresponse.interface';

export class CreateUser {
    static async checkIfUserExists(discordid: string): Promise<boolean> {
        const user = await SQLUsers.findOne({ where: { discordid } });
        return user !== null;
    }

    static async createNewUser(user: DiscordUserResponse): Promise<void> {
        // Use global_name if available, otherwise fallback to username
        const displayName = user.global_name || user.username;
        
        await SQLUsers.create({
            discordid: user.id,
            steamid: null,
            email: user.email,
            teamspeakid: null,
            username: displayName,
            section: 'N/A',
            veterancy: 'N/A',
            armaguid: null
        });
    }
}