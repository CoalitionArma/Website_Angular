import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

class SQLUsers extends Model {
    public discordid!: string;
    public steamid!: string;
    public email!: string;
    public teamspeakid!: string;
    public username!: string;
    public section!: string;
    public veterancy!: string;
    public armaguid!: string;
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
    }
}, {
    sequelize,
    tableName: 'users'
});

export default SQLUsers;
