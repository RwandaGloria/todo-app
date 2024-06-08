// src/db/index.ts
import { Sequelize } from "sequelize";
import mysql2 from "mysql2"
import dotenv from 'dotenv';

dotenv.config();

 let SQL_HOST = process.env.SQL_HOST as string;
 let SQL_USER_NAME = process.env.SQL_USER_NAME as string;
let SQL_PASSWORD = process.env.SQL_PASSWORD as string;
let SQL_PORT = 3306 as number;
let SQL_DB_NAME = process.env.SQL_DB_NAME as string;


const sqlConnection = new Sequelize(SQL_DB_NAME, SQL_USER_NAME, SQL_PASSWORD, {
  host: SQL_HOST,
  dialect: 'mysql',
});

export async function checkConnection() {
    try {
      await sqlConnection.authenticate();
      console.log('Connection to the database has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }

export default sqlConnection;
