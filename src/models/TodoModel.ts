import { Model, DataTypes, CreationOptional } from 'sequelize';
import {sequelize} from "../db/db";
import { Todo } from "../types/Todo";

export class TodoModel extends Model<Todo> {
  // public id!: CreationOptional<string>;
  public description!: string;
  public title!: string;
  public isCompleted!: boolean;
  public userId!: string;
}

TodoModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },

    userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    }
  }
  },
  {
    sequelize: sequelize,
    modelName: 'Todo',
    tableName: 'todos',
    timestamps: true,
  }
);