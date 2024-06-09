"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SQL_HOST = process.env.SQL_HOST;
const SQL_USER_NAME = process.env.SQL_USER_NAME;
const SQL_PASSWORD = process.env.SQL_PASSWORD;
const SQL_DB_NAME = process.env.SQL_DB_NAME;
exports.sequelize = new sequelize_1.Sequelize(SQL_DB_NAME, SQL_USER_NAME, SQL_PASSWORD, {
    host: SQL_HOST,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
});
