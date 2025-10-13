import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

interface CommunityAttributes {
    id: number;
    name: string;
    playercount: number;
    events_attended: number;
}

interface CommunityCreationAttributes extends Optional<CommunityAttributes, 'id' | 'events_attended'> {}

class Community extends Model<CommunityAttributes, CommunityCreationAttributes> implements CommunityAttributes {
    public id!: number;
    public name!: string;
    public playercount!: number;
    public events_attended!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Community.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        playercount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
        events_attended: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0,
            },
        },
    },
    {
        sequelize,
        tableName: 'a4communities',
        timestamps: false,
        indexes: [
            {
                fields: ['name'],
            },
        ],
    }
);

export default Community;