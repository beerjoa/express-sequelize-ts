import { Request, Response } from 'express';
import morgan from 'morgan';

import config from '@/config';
import logger from '@/utils/logger.util';

morgan.token('message', (req: Request, res: Response) => res.locals.errorMessage || '');

const getIpFormat = () => (config.NODE_ENV === 'production' ? ':remote-addr - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) }
});

const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) }
});

export const loggerHandler = {
  success: successHandler,
  error: errorHandler
};
