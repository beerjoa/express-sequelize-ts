import { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import {
  ExpressErrorMiddlewareInterface,
  ExpressMiddlewareInterface,
  HttpError,
  Middleware,
  UnauthorizedError
} from 'routing-controllers';
import { Service } from 'typedi';

import config from '@/config';
import logger from '@/utils/logger.util';

/**
 * @class HttpErrorHandler
 * @description Handle all errors thrown by routing-controllers
 * @param {unknown} error - error object
 * @param {Request} request - Express request object
 * @param {Response} response - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} void
 *
 * @middlewareType after
 * @middlewarePriority 0
 */
@Middleware({ type: 'after', priority: 0 })
@Service()
export class HttpErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: unknown, request: Request, response: Response, next: NextFunction): void {
    if (error instanceof UnauthorizedError) {
      response.status(error.httpCode).json({ ...error, message: 'Unauthorized' });
      return next();
    }

    if (error instanceof HttpError) {
      response.status(error.httpCode).json(error);
    }

    return next();
  }
}

/**
 * @class LoggingHandler
 * @description Log all requests and responses
 * @param {Request} request - Express request object
 * @param {Response} response - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} void
 *
 * @middlewareType after
 * @middlewarePriority 0
 * @middlewareSkipInTest
 */
@Middleware({ type: 'after', priority: 0 })
@Service()
export class LoggingHandler implements ExpressMiddlewareInterface {
  private _IpFormat: string = config.NODE_ENV === 'production' ? ':remote-addr - ' : '';
  private _successResponseFormat: string = `${this._IpFormat}:method :url :status - :response-time ms`;
  private _errorResponseFormat: string = `${this._IpFormat}:method :url :status - :response-time ms - message: :message`;

  constructor() {
    morgan.token('message', (req: Request, res: Response) => res.locals.errorMessage || '');
  }
  private _successHandler = morgan(this._successResponseFormat, {
    skip: (req: Request, res: Response) => res.statusCode >= 400,
    stream: { write: (message: string) => logger.info(message.trim()) }
  });
  private _errorHandler = morgan(this._errorResponseFormat, {
    skip: (req: Request, res: Response) => res.statusCode < 400,
    stream: { write: (message: string) => logger.error(message.trim()) }
  });

  use(request: Request, response: Response, next: NextFunction): void {
    if (config.NODE_ENV === 'test') {
      next();
    } else {
      if (response.statusCode >= 400) {
        this._errorHandler(request, response, next);
      } else {
        this._successHandler(request, response, next);
      }
      next();
    }
  }
}
