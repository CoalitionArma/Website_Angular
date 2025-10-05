import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

class SQLUsers extends Model {
    public discordid!: string;
    public steamid!: string | null;
    public email!: string;
    public teamspeakid!: string | null;
    public username!: string;
    public section!: string;
    public veterancy!: string;
    public armaguid!: string | null;
    public callsign!: string | null;
    public isAdmin!: boolean;
}

SQLUsers.init({
    discordid: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    steamid: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    teamspeakid: {
        type: DataTypes.STRING,
        allowNull: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    section: {
        type: DataTypes.STRING,
        allowNull: false
    },
    veterancy: {
        type: DataTypes.STRING,
        allowNull: false
    },
    armaguid: {
        type: DataTypes.STRING,
        allowNull: true
    },
    callsign: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    tableName: 'users',
    timestamps: false
});

export default SQLUsers;
