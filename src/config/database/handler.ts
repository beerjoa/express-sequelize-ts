import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize-typescript';

import config from '@/config';
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
  private _modelPath: string;

  constructor() {
    this._env = config.NODE_ENV;
    this._dbPath = path.join(process.cwd(), `${this._env}.sqlite`);
    this._modelPath = path.join(process.cwd(), '/src/**/*.entity.ts');

    this._sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: this._dbPath,
      models: [this._modelPath],
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
      if (fs.existsSync(this._dbPath)) {
        fs.unlinkSync(this._dbPath);
      }
    }
  }
}

const databaseHandler: IDatabaseHandler = new SequelizeSQLiteHandler();

export default databaseHandler;
