import databaseHandler from '@/config/database';
import { Sequelize } from 'sequelize';

const sequelize = databaseHandler.getDB();

export { Sequelize, sequelize };
