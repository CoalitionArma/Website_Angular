import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

// Define the Event attributes interface
export interface EventAttributes {
  id: string;
  title: string;
  description?: string;
  bannerUrl?: string;
  warno?: string; // Warning Order
  discordEventThread?: string; // Discord Event Thread URL
  dateTime: Date;
  slotUnlockTime?: Date; // When slots become available for signup
  createdBy: string; // Discord ID
  createdByUsername: string;
  groups: string; // JSON string containing groups and roles
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the creation attributes interface (optional fields for creation)
export interface EventCreationAttributes extends Optional<EventAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Define the Event model class
export class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
  public id!: string;
  public title!: string;
  public description!: string;
  public bannerUrl!: string;
  public warno!: string;
  public discordEventThread!: string;
  public dateTime!: Date;
  public slotUnlockTime!: Date;
  public createdBy!: string;
  public createdByUsername!: string;
  public groups!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Event model
Event.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    bannerUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    warno: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    discordEventThread: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    dateTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    slotUnlockTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    createdByUsername: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    groups: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'coalition_events',
    timestamps: true,
  }
);

export default Event;
