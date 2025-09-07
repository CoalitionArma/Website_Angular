import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

class A4Stats extends Model {
    public id!: number;
    public steamid!: string;
    public name!: string;
    public guid!: string;
    public tvt_kills!: number;
    public tvt_deaths!: number;
    public tvt_kdr!: number;
    public ai_kills!: number;
    public ai_deaths!: number;
    public coop_kdr!: number;
    public shots_fired!: number;
    public ff_events!: number;
    public grenades_thrown!: number;
    public civs_killed!: number;
    public leaves!: number;
    public connections!: number;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

A4Stats.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    steamid: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    guid: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    tvt_kills: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    tvt_deaths: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    tvt_kdr: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0
    },
    ai_kills: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    ai_deaths: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    coop_kdr: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0
    },
    shots_fired: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    grenades_thrown: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    ff_events: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    civs_killed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    leaves: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    connections: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize,
    tableName: 'a4stats',
    schema: 'coalition',
    timestamps: true,
});

export default A4Stats;
