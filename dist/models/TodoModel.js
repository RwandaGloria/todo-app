"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoModel = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db/db");
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
    sequelize: db_1.sequelize,
    modelName: 'Todo',
    timestamps: true,
});
