import * as fs from 'fs';
import * as path from 'path';
import { Sequelize } from 'sequelize-typescript';

import config from '@/config';
import { User } from '@/database/models/user.model';
import logger from '@/utils/logger.util';

type DatabaseInstanceType = Sequelize | any;

interface IDatabaseHandler {
  getDB(): DatabaseInstanceType;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

class SequelizeSQLiteHandler implements IDatabaseHandler {
  private _sequelize: DatabaseInstanceType;
  private _env: string;
  private _dbPath: string;
  constructor() {
    this._env = config.NODE_ENV;
    this._dbPath = path.resolve(__dirname, `../../${this._env}.sqlite`);

    this._sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: this._dbPath,
      models: [User],
      repositoryMode: true,
      define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        freezeTableName: true
      },
      logging: this._env === 'test' ? false : this._queryLogging
    });
  }

  getDB(): DatabaseInstanceType {
    return this._sequelize;
  }
  async connect(): Promise<void> {
    const syncOption = this._env === 'test' ? { force: true } : {};

    await this._sequelize.sync(syncOption);
  }

  private _queryLogging(sql: string, queryObject: any): void {
    logger.debug(sql);
    // logger.debug(inspect(queryObject));
  }

  async disconnect(): Promise<void> {
    await this._sequelize.close();
    if (this._env === 'test') {
      fs.unlinkSync(this._dbPath);
    }
  }
}

const databaseHandler: IDatabaseHandler = new SequelizeSQLiteHandler();

export default databaseHandler;
