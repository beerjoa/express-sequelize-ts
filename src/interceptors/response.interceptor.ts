import { Request, Response } from 'express';
import { Action, HttpError, Interceptor, InterceptorInterface } from 'routing-controllers';
import { Service } from 'typedi';

import logger from '@/utils/logger.util';

/**
 * @class ResponseInterceptor
 * @description Interceptor to handle debug logging for all responses
 * @param {Action} action - routing-controllers action object
 * @param {any} content - response content
 * @returns {any} response content
 *
 * @interceptorPriority 0
 */
@Interceptor({ priority: 0 })
@Service()
export class ResponseInterceptor implements InterceptorInterface {
  intercept(action: Action, content: any) {
    const { response, request }: { response: Response; request: Request } = action;

    if (content instanceof HttpError) {
      logger.debug(`{ api: ${request.url}, status: ${content.httpCode}, data: ${JSON.stringify(content)} }`);
      return response.status(content.httpCode).json(content);
    } else {
      logger.debug(`{ api: ${request.url}, status: ${response.statusCode}, data: ${JSON.stringify(content)} }`);
      return content;
    }
  }
}
