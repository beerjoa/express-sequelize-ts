import { User } from '@/database/models/user.model';
import httpStatus from 'http-status';
import passport from 'passport';

import ApiError from '@/utils/api-error.util';
import logger from '@/utils/logger.util';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { Model } from 'sequelize-typescript';
import { inspect } from 'util';

type TAuthType = 'local';
type TVerifyCallback = {
  [K in TAuthType]: (
    req: Request,
    resolve: any,
    reject: any
  ) => (err: any, user: Model<User>, info: object) => void;
};

const verifyCallback: TVerifyCallback = {
  local:
    (req: Request, resolve: any, reject: any) =>
    (err: any, user: Model<User>, info: object): void => {
      if (err || !user) {
        const error = new ApiError(
          httpStatus.UNAUTHORIZED,
          'Please authenticate'
        );
        reject(error);
      }

      req.user = user;
      resolve();
    }
};

const authMiddlewareFn = (
  req: Request,
  res: Response,
  next: NextFunction,
  authType: TAuthType
) => {
  logger.debug(inspect(verifyCallback));
  return new Promise((resolve, reject) => {
    passport.authenticate(
      authType,
      { session: false },
      verifyCallback[authType](req, resolve, reject)
    );
    next();
  });
};

const auth =
  (authType: TAuthType): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    return await authMiddlewareFn(req, res, next, authType)
      .then(() => {
        next();
      })
      .catch((err) => {
        next(err);
      });
  };
export default auth;
