import {sequelize} from '../db/db';
import {UserModel} from './UserModel';
import {TodoModel} from './TodoModel';

export const syncModels = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    UserModel.hasMany(TodoModel, { foreignKey: 'userId' });
    TodoModel.belongsTo(UserModel, { foreignKey: 'userId' });
    await UserModel.sync();
    console.log('User table has been synchronized.');

    await TodoModel.sync();
    console.log('Todo table has been synchronized.');
  } catch (error) {
    console.error('Unable to synchronize the database:', error);
  }
};