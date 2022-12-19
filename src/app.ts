import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import config from '@/config';
import { loggerHandler } from '@/middlewares/handler.middleware';
import IndexRoute from '@/routes/index.route';

const app = express();

const route = new IndexRoute();

if (config.NODE_ENV !== 'test') {
  app.use(loggerHandler.success);
  app.use(loggerHandler.error);
}
app.use(helmet());
app.use(cors());
app.use(compression());

app.use('/api', route.router);

export default app;
