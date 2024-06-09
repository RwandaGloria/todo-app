import { Sequelize } from "sequelize";
import dotenv from 'dotenv';

dotenv.config();

const SQL_HOST = process.env.SQL_HOST as string;
const SQL_USER_NAME = process.env.SQL_USER_NAME as string;
const SQL_PASSWORD = process.env.SQL_PASSWORD as string;
const SQL_DB_NAME = process.env.SQL_DB_NAME as string;

export const sequelize = new Sequelize(SQL_DB_NAME, SQL_USER_NAME, SQL_PASSWORD, {
  host: SQL_HOST,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

