import IndexRoute from '@routes/index.route';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

const app = express();

const route = new IndexRoute();

app.use(helmet());
app.use(cors());
app.use(compression());

app.use('/api', route.router);

export default app;
