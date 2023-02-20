import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  Authorized,
  Body,
  Get,
  HeaderParam,
  HttpCode,
  JsonController,
  Post,
  Req,
  Res,
  UseBefore
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

import config from '@/config';
import { IController } from '@/interfaces/controller.interface';
import auth from '@/middlewares/auth.middleware';
import validateSchemas from '@/middlewares/validate.middleware';
import AuthService from '@/users/auth.service';
import { UserErrorResponseDto, UserResponseDto } from '@/users/dtos/response.dto';
import { CreateUserDto, SignInUserDto } from '@/users/dtos/user.dto';
import ApiError from '@/utils/api-error.util';
import { http } from '@/utils/handler.util';

@JsonController('/auth')
@Service()
class AuthController implements IController {
  // prettier-ignore
  constructor(
    public readonly service: AuthService,
  ) {}

  @Get('/who-am-i')
  @OpenAPI({
    summary: 'Who am I',
    description: 'Get current user'
  })
  @Authorized()
  @HttpCode(httpStatus.OK)
  @ResponseSchema(UserResponseDto, { statusCode: httpStatus.OK })
  @ResponseSchema(UserErrorResponseDto, { statusCode: httpStatus.UNAUTHORIZED, description: 'No auth token' })
  public whoAmI(
    @Req() req: Request,
    @Res() res: Response,
    @HeaderParam('authorization') token: string
  ): Response | undefined {
    try {
      const reqUser = req.user;
      const rawToken = token.split(' ')[1];
      return http.sendJsonResponse(res, httpStatus.OK, { user: reqUser, accessToken: rawToken });
    } catch (error) {
      if (error instanceof Error) {
        const apiError = new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'INTERNAL_SERVER_ERROR');
        return http.sendErrorResponse(res, apiError.statusCode, apiError);
      }
    }
  }

  @Post('/sign-up')
  @OpenAPI({
    summary: 'Sign up',
    description: 'Sign up with email and password'
  })
  @UseBefore(validateSchemas({ body: CreateUserDto }))
  @HttpCode(httpStatus.CREATED)
  @ResponseSchema(UserResponseDto, { statusCode: httpStatus.CREATED, description: 'User created' })
  @ResponseSchema(UserErrorResponseDto, { statusCode: httpStatus.BAD_REQUEST, description: 'User already exists' })
  public async signUp(
    @Body({ type: CreateUserDto }) userBody: CreateUserDto,
    @Res() res: Response
  ): Promise<Response | undefined> {
    try {
      const signUpData = await this.service.signUp(userBody);

      if (signUpData instanceof Error) {
        throw signUpData;
      }

      const { user, token } = signUpData;
      this.__setTokenCookie(res, token.refreshToken);

      return http.sendJsonResponse(res, httpStatus.CREATED, { user, accessToken: token.accessToken });
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
  @OpenAPI({
    summary: 'Sign in',
    description: 'Sign in with email and password'
  })
  @HttpCode(httpStatus.OK)
  @UseBefore(validateSchemas({ body: SignInUserDto }), auth('local'))
  @ResponseSchema(UserResponseDto, { statusCode: httpStatus.OK, description: 'Sign in successfully' })
  @ResponseSchema(UserErrorResponseDto, {
    statusCode: httpStatus.BAD_REQUEST,
    description: 'User not found | Invalid password'
  })
  @ResponseSchema(UserErrorResponseDto, { statusCode: httpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  public async signIn(@Body() userBody: SignInUserDto, @Res() res: Response): Promise<Response | undefined> {
    try {
      const signInData = await this.service.signIn(userBody);

      if (signInData instanceof Error) {
        throw signInData;
      }

      const { user, token } = signInData;

      this.__setTokenCookie(res, token.refreshToken);

      return http.sendJsonResponse(res, httpStatus.OK, { user, accessToken: token.accessToken });
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
  @OpenAPI({
    summary: 'Sign out',
    description: 'Sign out with email and password'
  })
  @Authorized()
  @HttpCode(httpStatus.OK)
  @ResponseSchema(UserResponseDto, { statusCode: httpStatus.OK, description: 'Sign out successfully' })
  @ResponseSchema(UserErrorResponseDto, { statusCode: httpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  public async signOut(@Req() req: Request, @Res() res: Response): Promise<Response> {
    // TODO
    await this.service.signOut();
    const reqUser = req.user;
    res.clearCookie(config.JWT_COOKIE_NAME);
    return http.sendJsonResponse(res, httpStatus.OK, { message: 'Sign out successfully' });
  }

  @Get('/refresh-token')
  @OpenAPI({
    summary: 'Refresh token',
    description: 'Refresh token'
  })
  @Authorized()
  @HttpCode(httpStatus.OK)
  @ResponseSchema(UserResponseDto, { statusCode: httpStatus.OK, description: 'Tokens refreshed successfully' })
  @ResponseSchema(UserErrorResponseDto, { statusCode: httpStatus.UNAUTHORIZED, description: 'Unauthorized' })
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
        accessToken: token.accessToken,
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
