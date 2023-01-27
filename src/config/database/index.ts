import databaseHandler from '@/config/database/handler';
import { Sequelize } from 'sequelize';

const sequelize = databaseHandler.getDB();

export { Sequelize, sequelize };
