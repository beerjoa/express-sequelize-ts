import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import config from '@/config';
import { loggerHandler } from '@/middlewares/handler.middleware';
import IndexRoute from '@/routes/index.route';

class App {
  public app: express.Application;
  private _env: string;
  private _host: string;
  private _port: number;

  constructor() {
    this.app = express();
    this._env = config.NODE_ENV;
    this._host = config.HOST;
    this._port = config.PORT;
    this.initMiddlewares();
    this.initRoutes();
  }
  public listen() {
    this.app.listen(this._port, this._host, () => {
      console.log(`
        Server is running
        env: ${this._env}
        ${this._host}:${this._port}
      `);
    });
  }
  private initRoutes(): void {
    const route = new IndexRoute();

    this.app.use('/api', route.router);
  }
  private initMiddlewares(): void {
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
