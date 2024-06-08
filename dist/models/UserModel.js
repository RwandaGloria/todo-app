"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db/db"));
const TodoModel_1 = __importDefault(require("./TodoModel"));
class UserModel extends sequelize_1.Model {
}
UserModel.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: db_1.default,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
});
UserModel.hasMany(TodoModel_1.default, { foreignKey: 'userId', as: 'todos' });
TodoModel_1.default.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });
exports.default = UserModel;
