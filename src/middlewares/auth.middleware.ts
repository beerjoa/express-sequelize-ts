import { NextFunction, Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import passport from 'passport';
import { Model } from 'sequelize-typescript';

import User from '@/users/user.entity';
import ApiError from '@/utils/api-error.util';
import { http } from '@/utils/handler.util';

type TAuthType = 'local' | 'jwt' | 'jwt-refresh';
type TVerifyCallback = {
  [K in TAuthType]: (req: Request, resolve: any, reject: any) => (err: any, user: Model<User>, info: object) => void;
};

const verifyCallback: TVerifyCallback = {
  local:
    (req: Request, resolve: any, reject: any) =>
    (err: any, user: Model<User>, info: any): void => {
      if (err || !user) {
        const error = new ApiError(httpStatus.UNAUTHORIZED, info?.message || err.message);
        reject(error);
      }

      req.user = user;
      resolve();
    },
  jwt:
    (req: Request, resolve: any, reject: any) =>
    (err: any, user: Model<User>, info: any): void => {
      if (err || !user) {
        const error = new ApiError(httpStatus.UNAUTHORIZED, info?.message || err.message);
        reject(error);
      }

      req.user = user;
      resolve();
    },
  'jwt-refresh':
    (req: Request, resolve: any, reject: any) =>
    (err: any, user: Model<User>, info: any): void => {
      if (err || !user) {
        const error = new ApiError(httpStatus.UNAUTHORIZED, info?.message || err.message);
        reject(error);
      }

      req.user = user;
      resolve();
    }
};

const authMiddlewareFn = (req: Request, res: Response, next: NextFunction, authType: TAuthType) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(authType, { session: false }, verifyCallback[authType](req, resolve, reject))(req, res, next);
  });
};

const auth =
  (authType: TAuthType): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    await authMiddlewareFn(req, res, next, authType)
      .then(() => {
        next();
      })
      .catch((err) => {
        return http.sendErrorResponse(res, err.statusCode, err);
      });
  };

export default auth;
