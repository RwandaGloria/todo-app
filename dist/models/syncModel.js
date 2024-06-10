"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncModels = void 0;
const db_1 = require("../db/db");
const UserModel_1 = require("./UserModel");
const TodoModel_1 = require("./TodoModel");
const syncModels = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.sequelize.authenticate();
        console.log('Connection has been established successfully.');
        UserModel_1.UserModel.hasMany(TodoModel_1.TodoModel, { foreignKey: 'userId' });
        TodoModel_1.TodoModel.belongsTo(UserModel_1.UserModel, { foreignKey: 'userId' });
        yield UserModel_1.UserModel.sync();
        console.log('User table has been synchronized.');
        yield TodoModel_1.TodoModel.sync();
        console.log('Todo table has been synchronized.');
    }
    catch (error) {
        console.error('Unable to synchronize the database:', error);
    }
});
exports.syncModels = syncModels;
