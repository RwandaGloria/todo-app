import { Model, DataTypes, CreationOptional, Sequelize } from 'sequelize';
import { User } from '../types/User';
import {sequelize} from '../db/db';
import {TodoModel} from './TodoModel';

export class UserModel extends Model<User> implements User {
  public id!: CreationOptional<string>;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);

