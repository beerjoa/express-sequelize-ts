import ApiError from '@/utils/api-error.util';
import logger from '@/utils/logger.util';
import { Response } from 'express';

export const http = {
  sendJsonResponse: (res: Response, status: number, responseData: any) => {
    logger.info(`{ status: ${status}, data: ${JSON.stringify(responseData)} }`);
    return res.status(status).json(responseData).end();
  },
  sendErrorResponse: (res: Response, status: number, error: ApiError) => {
    logger.error(`{ status: ${error.statusCode}, error: ${error.message} }`);
    return res
      .status(status)
      .json({ ...error, message: error.message })
      .end();
  }
};
