import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Body, Get, JsonController, Post, Req, Res, UseBefore } from 'routing-controllers';

import config from '@/config';
import { IController } from '@/interfaces/controller.interface';
import auth from '@/middlewares/auth.middleware';
import validateSchemas from '@/middlewares/validate.middleware';
import AuthService from '@/users/auth.service';
import CreateUserDto from '@/users/dtos/create-user.dto';
import SignInUserDto from '@/users/dtos/sign-in-user.dto';
import ApiError from '@/utils/api-error.util';
import { http } from '@/utils/handler.util';

@JsonController('/auth')
class AuthController implements IController {
  // prettier-ignore
  constructor(
    public readonly service: AuthService = new AuthService(),
  ) {}

  @Get('/who-am-i')
  @UseBefore(auth('jwt'))
  public whoAmI(@Req() req: Request, @Res() res: Response): Response | undefined {
    try {
      const reqUser = req.user;
      return http.sendJsonResponse(res, httpStatus.OK, { user: reqUser });
    } catch (error) {
      if (error instanceof Error) {
        const apiError = new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'INTERNAL_SERVER_ERROR');
        return http.sendErrorResponse(res, apiError.statusCode, apiError);
      }
    }
  }

  @Post('/sign-up')
  @UseBefore(validateSchemas({ body: CreateUserDto }))
  public async signUp(@Body() userBody: CreateUserDto, @Res() res: Response): Promise<Response | undefined> {
    try {
      const signUpData = await this.service.signUp(userBody);

      if (signUpData instanceof Error) {
        throw signUpData;
      }

      const { user, token } = signUpData;
      this.__setTokenCookie(res, token.refreshToken);

      return http.sendJsonResponse(res, httpStatus.CREATED, { user, access_token: token.accessToken });
    } catch (error) {
      if (error instanceof ApiError) {
        return http.sendErrorResponse(res, error.statusCode, error);
      }

      if (error instanceof Error) {
        const apiError = new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
        return http.sendErrorResponse(res, apiError.statusCode, apiError);
      }
    }
  }

  @Post('/sign-in')
  @UseBefore(validateSchemas({ body: SignInUserDto }), auth('local'))
  public async signIn(@Body() userBody: SignInUserDto, @Res() res: Response): Promise<Response | undefined> {
    try {
      const signInData = await this.service.signIn(userBody);

      if (signInData instanceof Error) {
        throw signInData;
      }

      const { user, token } = signInData;

      this.__setTokenCookie(res, token.refreshToken);

      return http.sendJsonResponse(res, httpStatus.OK, { user, access_token: token.accessToken });
    } catch (error) {
      if (error instanceof ApiError) {
        return http.sendErrorResponse(res, error.statusCode, error);
      }

      if (error instanceof Error) {
        const apiError = new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
        return http.sendErrorResponse(res, apiError.statusCode, apiError);
      }
    }
  }

  @Get('/sign-out')
  @UseBefore(auth('jwt'))
  public async signOut(@Req() req: Request, @Res() res: Response): Promise<Response> {
    // TODO
    await this.service.signOut();
    const reqUser = req.user;
    res.clearCookie(config.JWT_COOKIE_NAME);
    return http.sendJsonResponse(res, httpStatus.OK, { message: 'Sign out successfully' });
  }

  // public refreshToken = catchAsync(async (req: Request, res: Response): Promise<Response> => {
  @Get('/refresh-token')
  @UseBefore(auth('jwt-refresh'))
  public async refreshToken(@Req() req: Request, @Res() res: Response): Promise<Response | undefined> {
    try {
      const refreshToken = req.cookies[config.JWT_COOKIE_NAME];
      const refreshedTokenData = await this.service.refreshToken(refreshToken);

      if (refreshedTokenData instanceof Error) {
        throw refreshedTokenData;
      }

      const { token } = refreshedTokenData;

      this.__setTokenCookie(res, token.refreshToken);

      return http.sendJsonResponse(res, httpStatus.OK, {
        access_token: token.accessToken,
        message: 'Tokens refreshed successfully'
      });
    } catch (error) {
      if (error instanceof ApiError) {
        return http.sendErrorResponse(res, error.statusCode, error);
      }

      if (error instanceof Error) {
        const apiError = new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
        return http.sendErrorResponse(res, apiError.statusCode, apiError);
      }
    }
  }

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
