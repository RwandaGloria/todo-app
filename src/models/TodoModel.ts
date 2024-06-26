// src/models/todo.model.ts
import { Model, DataTypes, CreationOptional } from 'sequelize';
import sqlConnection from "../db/db";
import { Todo } from "../types/Todo";

export class TodoModel extends Model<Todo> implements Todo {
  public id!: CreationOptional<string>;
  public description!: string;
  public title!: string;
  public isCompleted!: boolean;
  public createdAt!: CreationOptional<Date>;
  public updatedAt!: CreationOptional<Date>;
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize: sqlConnection,
    modelName: 'Todo',
    tableName: 'todos',
    timestamps: true,
  }
);

export default TodoModel;
