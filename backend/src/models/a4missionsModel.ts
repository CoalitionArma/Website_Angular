import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

class A4Missions extends Model {
    public id!: number;
    public name!: string;
    public author!: string;
    public terrain!: string;
    public details!: string;  // Changed from description to details
    public gametype!: string;
    public players!: string;
    public sidecounts!: string;
    public jsonlink!: string;
    public jsondata!: string;
}

A4Missions.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    author: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    terrain: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    gametype: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    players: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    sidecounts: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    jsonlink: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    jsondata: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'a4missions',
    schema: 'coalition',
    timestamps: false,
});

export default A4Missions;
