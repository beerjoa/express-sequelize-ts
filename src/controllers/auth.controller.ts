import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import httpStatus from 'http-status';

import config from '@/config';
import { IController } from '@/interfaces/controller.interface';
import CreateUserDto from '@/models/dtos/create-user.dto';
import SignInUserDto from '@/models/dtos/sign-in-user.dto';
import AuthService from '@/services/auth.service';
import catchAsync from '@/utils/catch-async.util';
import { http } from '@/utils/handler.util';

class AuthController implements IController {
  // prettier-ignore
  constructor(
    public readonly service: AuthService = new AuthService(),
  ) {}

  public whoAmI = catchAsync(async (req: Request, res: Response): Promise<Response> => {
    const reqUser = req.user;
    return http.sendJsonResponse(res, httpStatus.OK, { user: reqUser });
  });

  public signUp = catchAsync(async (req: Request, res: Response): Promise<Response> => {
    const createUserData = plainToInstance(CreateUserDto, req.body);

    const signUpData = await this.service.signUp(createUserData);

    if (signUpData instanceof Error) {
      return http.sendErrorResponse(res, signUpData.statusCode, signUpData);
    }

    const { user, token } = signUpData;
    this.__setTokenCookie(res, token.refreshToken);

    return http.sendJsonResponse(res, httpStatus.CREATED, { user, access_token: token.accessToken });
  });

  public signIn = catchAsync(async (req: Request, res: Response): Promise<Response> => {
    const signInUserData = plainToInstance(SignInUserDto, req.body);

    const signInData = await this.service.signIn(signInUserData);

    if (signInData instanceof Error) {
      return http.sendErrorResponse(res, signInData.statusCode, signInData);
    }

    const { user, token } = signInData;

    this.__setTokenCookie(res, token.refreshToken);

    return http.sendJsonResponse(res, httpStatus.OK, { user, access_token: token.accessToken });
  });

  public signOut = catchAsync(async (req: Request, res: Response): Promise<Response> => {
    // TODO
    await this.service.signOut();
    const reqUser = req.user;
    res.clearCookie(config.JWT_COOKIE_NAME);
    return http.sendJsonResponse(res, httpStatus.OK, { message: 'Sign out successfully' });
  });

  public refreshToken = catchAsync(async (req: Request, res: Response): Promise<Response> => {
    const refreshToken = req.cookies[config.JWT_COOKIE_NAME];
    const refreshedTokenData = await this.service.refreshToken(refreshToken);

    if (refreshedTokenData instanceof Error) {
      return http.sendErrorResponse(res, refreshedTokenData.statusCode, refreshedTokenData);
    }

    const { token } = refreshedTokenData;

    this.__setTokenCookie(res, token.refreshToken);

    return http.sendJsonResponse(res, httpStatus.OK, {
      access_token: token.accessToken,
      message: 'Tokens refreshed successfully'
    });
  });

  private __setTokenCookie = (res: Response, token: string): void => {
    const cookieOptions = {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      maxAge: config.JWT_EXPIRATION * 24
    };
    res.cookie(config.JWT_COOKIE_NAME, token, cookieOptions);
  };
}

export default AuthController;
