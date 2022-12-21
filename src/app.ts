import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import { createHttpTerminator } from 'http-terminator';
import https from 'https';

import config from '@/config';
import databaseHandler from '@/config/database';
import { loggerHandler } from '@/middlewares/handler.middleware';
import IndexRoute from '@/routes/index.route';
import logger from '@/utils/logger.util';

type ServerInstanceType = http.Server | https.Server | null;

interface IApp {
  app: express.Application;
  start(): void;
  stop(): void;
}

class App implements IApp {
  private readonly _app: express.Application;
  get app() {
    return this._app;
  }
  private _server: ServerInstanceType;
  private _env: string;
  private _host: string;
  private _port: number;

  constructor() {
    this._app = express();
    this._server = null;
    this._env = config.NODE_ENV;
    this._host = config.HOST;
    this._port = config.PORT;
    this.initMiddleware();
    this.initRoutes();
    this.initDatabase();
  }

  public static async build(): Promise<App> {
    const app = new App();
    return app;
  }

  public start() {
    this._server = this.app.listen(this._port, this._host, () => {
      logger.info(
        `\n🟩 Server is running ✅\n🟩 env: ${this._env}\n🟩 ${this._host}:${this._port}`
      );
    });
  }

  public stop() {
    const httpTerminator = createHttpTerminator({ server: this._server! });

    // Gracefully terminate the server
    httpTerminator.terminate().then(() => {
      logger.info(`\n🛑 Server is closed ❌`);
    });

    // Gracefully terminate the database connection
    databaseHandler.disconnect().then(() => {
      logger.info(`\n🛑 Database disconnected ❌`);
    });
  }
  private initRoutes(): void {
    const route = new IndexRoute();
    this.app.use('/api', route.router);
  }

  private async initDatabase(): Promise<void> {
    await databaseHandler.connect().then(() => {
      logger.info(`\n🟩 Database connected ✅`);
    });
  }
  private initMiddleware(): void {
    if (this._env !== 'test') {
      this.app.use(loggerHandler.success);
      this.app.use(loggerHandler.error);
    }
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(compression());
  }
}

export default App;
