import { DataTypes, Model } from 'sequelize';
import sequelize from '../db';

/**
 * Maps coalition.a4stats — coalition-specific stats tracked by Coalition_Bot
 * via the COAServerLog.txt CSV pipeline.
 *
 * Vanilla engine stats (shots, distance, medical, XP, bans, etc.) live in
 * reforgerjs.playerstats and are joined at query time in GetUserA4Stats.
 */
class A4Stats extends Model {
    public id!: number;
    public steamid!: string;
    public name!: string;
    public guid!: string;

    // Kill / death (faction-aware, coalition-tracked)
    public tvt_kills!: number;
    public tvt_deaths!: number;
    public tvt_kdr!: number;

    // Attendance & conduct (coalition-tracked)
    public missions_attended!: number;
    public ff_events!: number;
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
        allowNull: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true
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
    missions_attended: {
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

