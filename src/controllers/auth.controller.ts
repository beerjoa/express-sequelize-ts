import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import config from '@/config';
import { User } from '@/database/models/user.model';
import CreateUserDto from '@/dtos/create-user.dto';
import SignInUserDto from '@/dtos/sign-in-user.dto';
import { IController } from '@/interfaces/controller.interface';
import AuthService from '@/services/auth.service';
import catchAsync from '@/utils/catch-async.util';
import { http } from '@/utils/handler.util';
import { Model } from 'sequelize-typescript';

class AuthController implements IController {
  // prettier-ignore
  constructor(
    public readonly service: AuthService = new AuthService(),
  ) {}

  public signUp = catchAsync(async (req: Request, res: Response): Promise<Response> => {
    const createUserData = plainToInstance(CreateUserDto, req.body);

    const user = await this.service.signUp(createUserData);

    if (user instanceof Error) {
      return http.sendErrorResponse(res, 400, user);
    }
    const token = await this.__createToken(user);
    this.__setTokenCookie(res, token);

    return http.sendJsonResponse(res, 200, user);
  });

  public signIn = catchAsync(async (req: Request, res: Response): Promise<Response> => {
    const signInUserData = plainToInstance(SignInUserDto, req.body);

    const user = await this.service.signIn(signInUserData);

    if (user instanceof Error) {
      return http.sendErrorResponse(res, 400, user);
    }
    const token = await this.__createToken(user);
    this.__setTokenCookie(res, token);

    return http.sendJsonResponse(res, 200, user);
  });

  private __setTokenCookie = (res: Response, token: string): void => {
    const cookieOptions = {
      httpOnly: true,
      maxAge: config.JWT_EXPIRATION,
      secure: config.NODE_ENV === 'production' ? true : false
    };
    res.cookie(config.JWT_COOKIE_NAME, token, cookieOptions);
  };
  private async __createToken(user: Model<User>): Promise<string> {
    return jwt.sign({ user }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRATION });
  }
}

export default AuthController;
