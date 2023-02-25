import { NextFunction, Request, Response } from 'express';
import { ExpressMiddlewareInterface } from 'routing-controllers';

export type TAuthType = 'local' | 'jwt' | 'jwt-refresh';

export interface IAuthMiddleware<TUser> extends ExpressMiddlewareInterface {
  authType: TAuthType;
  verifyCallback: (req: Request, resolve: any, reject: any) => (err: any, user: TUser, info: object) => void;
  authenticate: (req: Request, res: Response, next: NextFunction) => void;
  use: (req: Request, res: Response, next: NextFunction) => void;
}
