import { HOST, PORT } from '@config';
import express, { NextFunction, Request, Response } from 'express';

const app = express();

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World!');
});

app.listen(PORT, HOST, () => {
  console.log(`
  ################################################
  ##              Server is running             ##
  ##                 ${HOST}:${PORT}               ##
  ################################################
  `);
});
