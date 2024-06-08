"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoModel = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db/db"));
class TodoModel extends sequelize_1.Model {
}
exports.TodoModel = TodoModel;
TodoModel.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    isCompleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
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
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
}, {
    sequelize: db_1.default,
    modelName: 'Todo',
    tableName: 'todos',
    timestamps: true,
});
exports.default = TodoModel;
