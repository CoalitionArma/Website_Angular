import { Sequelize, DataTypes } from 'sequelize';
import SQLUsers from '../models/userModel.interface';
import { UserResponse } from '../interfaces/userresponse.interface';

export class CreateUser {
    static async checkIfUserExists(discordid: string): Promise<boolean> {
        const user = await SQLUsers.findOne({ where: { discordid } });
        return user !== null;
    }

    static async createNewUser(user: UserResponse): Promise<void> {
        await SQLUsers.create({
            discordid: user.id,
            steamid: null,
            email: user.email,
            teamspeakid: null,
            username: user.global_name,
            section: 'N/A',
            veterancy: 'N/A',
            armaguid: null
        });
    }
}