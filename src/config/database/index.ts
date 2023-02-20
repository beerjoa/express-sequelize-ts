import { Sequelize } from 'sequelize';

import databaseHandler from '@/config/database/handler';

const sequelize = databaseHandler.getDB();

export { Sequelize, sequelize };
