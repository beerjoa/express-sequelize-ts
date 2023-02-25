import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import passport from 'passport';
import { Action, HttpError } from 'routing-controllers';
import { Model } from 'sequelize-typescript';
import { Service } from 'typedi';

import { IAuthMiddleware, TAuthType } from '@/interfaces/middleware.interface';
import User from '@/users/user.entity';

type TAction = Action & {
  request: Request;
  response: Response;
  next: NextFunction;
};

export const authorizationChecker = (action: TAction) => {
  const { request: req, response: res, next } = action;
  return new Promise((resolve) => {
    passport.authenticate('jwt', { session: false }, (err: any, user: Model<User>, info: any): void => {
      if (err || !user) {
        return resolve(false);
      }

      req.user = user;
      return resolve(true);
    })(req, res, next);
  });
};

/**
 * @class LocalAuthMiddleware
 * @description Middleware to verify local credentials
 * @implements IAuthMiddleware
 */
@Service()
export class LocalAuthMiddleware implements IAuthMiddleware<Model<User>> {
  public readonly authType: TAuthType;
  constructor() {
    this.authType = 'local';
  }

  public readonly verifyCallback =
    (req: Request, res: Response, next: NextFunction) => (err: any, user: Model<User>, info: any) => {
      if (err || !user) {
        const error = new HttpError(httpStatus.UNAUTHORIZED, info?.message || err.message);
        next(error);
      }
      req.user = user;
      next();
    };

  public readonly authenticate = (callback: any) => passport.authenticate(this.authType, { session: false }, callback);

  public use(req: Request, res: Response, next: NextFunction): void {
    this.authenticate(this.verifyCallback(req, res, next))(req, res, next);
  }
}

/**
 * @class JWTAuthMiddleware
 * @description Middleware to verify JWT-refresh token
 * @implements IAuthMiddleware
 */
@Service()
export class JWTRefreshAuthMiddleware implements IAuthMiddleware<Model<User>> {
  public readonly authType: TAuthType;
  constructor() {
    this.authType = 'jwt-refresh';
  }

  public readonly verifyCallback =
    (req: Request, res: Response, next: NextFunction) => (err: any, user: Model<User>, info: any) => {
      if (err || !user) {
        const error = new HttpError(httpStatus.UNAUTHORIZED, info?.message || err.message);
        next(error);
      }
      req.user = user;
      next();
    };

  public readonly authenticate = (callback: any) => passport.authenticate(this.authType, { session: false }, callback);

  public use(req: Request, res: Response, next: NextFunction): void {
    this.authenticate(this.verifyCallback(req, res, next))(req, res, next);
  }
}
