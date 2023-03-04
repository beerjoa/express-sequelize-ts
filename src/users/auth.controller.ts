import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  Authorized,
  Body,
  Get,
  HeaderParam,
  HttpCode,
  HttpError,
  JsonController,
  Post,
  Req,
  Res,
  UseBefore
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';

import config from '@/config';
import { HttpErrorResponseDto } from '@/dtos/response.dto';
import { IController } from '@/interfaces/controller.interface';
import { JWTRefreshAuthMiddleware, LocalAuthMiddleware } from '@/middlewares/auth.middleware';
import AuthService from '@/users/auth.service';
import { UserResponseDto } from '@/users/dtos/response.dto';
import UserDto, { CreateUserDto, SignInUserDto } from '@/users/dtos/user.dto';

@JsonController('/auth')
@OpenAPI({
  summary: 'Auth',
  description: 'Auth Controller'
})
@Service()
class AuthController implements IController {
  // prettier-ignore
  constructor(
    public readonly service: AuthService,
  ) {}

  @Get('/who-am-i')
  @OpenAPI({
    summary: 'Who am I',
    description: 'Get current user',
    security: [{ jwtAuth: [] }]
  })
  @Authorized()
  @HttpCode(httpStatus.OK)
  @ResponseSchema(UserResponseDto, { statusCode: httpStatus.OK })
  @ResponseSchema(HttpErrorResponseDto, { statusCode: httpStatus.UNAUTHORIZED, description: 'No auth token' })
  public async whoAmI(
    @Req() req: Request,
    @HeaderParam('Authorization') token: string
  ): Promise<undefined | HttpError | UserResponseDto> {
    try {
      const reqUser = req.user as UserDto;
      const rawToken = token.split(' ')[1];

      const responseUser = new UserResponseDto();
      responseUser.user = reqUser;
      responseUser.accessToken = rawToken;

      return responseUser;
    } catch (error) {
      if (error instanceof Error) {
        const httpError = new HttpError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
        return httpError;
      }
    }
  }

  @Post('/sign-up')
  @OpenAPI({
    summary: 'Sign up',
    description: 'Sign up with email and password'
  })
  @HttpCode(httpStatus.CREATED)
  @ResponseSchema(UserResponseDto, { statusCode: httpStatus.CREATED, description: 'User created' })
  @ResponseSchema(HttpErrorResponseDto, { statusCode: httpStatus.BAD_REQUEST, description: 'User already exists' })
  public async signUp(
    @Body({ type: CreateUserDto, required: true, validate: true }) userBody: CreateUserDto,
    @Res() res: Response
  ): Promise<Response | undefined | HttpError | UserResponseDto> {
    try {
      const signUpData = await this.service.signUp(userBody);

      if (signUpData instanceof Error) {
        throw signUpData;
      }

      const { user, token } = signUpData;
      this.__setTokenCookie(res, token.refreshToken);

      const userResponse = new UserResponseDto();
      userResponse.user = user;
      userResponse.accessToken = token.accessToken;
      return userResponse;
    } catch (error) {
      if (error instanceof HttpError) {
        return error;
      }

      if (error instanceof Error) {
        const httpError = new HttpError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
        return httpError;
      }
    }
  }

  @Post('/sign-in')
  @OpenAPI({
    summary: 'Sign in',
    description: 'Sign in with email and password'
  })
  @HttpCode(httpStatus.OK)
  @ResponseSchema(UserResponseDto, { statusCode: httpStatus.OK, description: 'Sign in successfully' })
  @ResponseSchema(HttpErrorResponseDto, {
    statusCode: httpStatus.BAD_REQUEST,
    description: 'User not found | Invalid password'
  })
  @ResponseSchema(HttpErrorResponseDto, { statusCode: httpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @UseBefore(LocalAuthMiddleware)
  public async signIn(
    @Body({ required: true, validate: true }) userBody: SignInUserDto,
    @Res() res: Response
  ): Promise<undefined | UserResponseDto | HttpError> {
    try {
      const signInData = await this.service.signIn(userBody);

      if (signInData instanceof Error) {
        throw signInData;
      }

      const { user, token } = signInData;

      this.__setTokenCookie(res, token.refreshToken);

      const userResponse = new UserResponseDto();
      userResponse.user = user;
      userResponse.accessToken = token.accessToken;

      return userResponse;
    } catch (error) {
      if (error instanceof HttpError) {
        return error;
      }

      if (error instanceof Error) {
        const httpError = new HttpError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
        return httpError;
      }
    }
  }

  @Get('/sign-out')
  @OpenAPI({
    summary: 'Sign out',
    description: 'Sign out with email and password',
    security: [{ jwtAuth: [] }]
  })
  @Authorized()
  @HttpCode(httpStatus.OK)
  @ResponseSchema(UserResponseDto, { statusCode: httpStatus.OK, description: 'Sign out successfully' })
  @ResponseSchema(HttpErrorResponseDto, { statusCode: httpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  public async signOut(@Req() req: Request, @Res() res: Response): Promise<Response | any> {
    // TODO
    await this.service.signOut();
    const reqUser = req.user;
    res.clearCookie(config.JWT_COOKIE_NAME);
    return { message: 'Sign out successfully' };
  }

  @Get('/refresh-token')
  @OpenAPI({
    summary: 'Refresh token',
    description: 'Refresh token'
  })
  @HttpCode(httpStatus.OK)
  @ResponseSchema(UserResponseDto, { statusCode: httpStatus.OK, description: 'Tokens refreshed successfully' })
  @ResponseSchema(HttpErrorResponseDto, { statusCode: httpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @UseBefore(JWTRefreshAuthMiddleware)
  public async refreshToken(@Req() req: Request, @Res() res: Response): Promise<Response | undefined | any> {
    try {
      const refreshToken = req.cookies[config.JWT_COOKIE_NAME];
      const refreshedTokenData = await this.service.refreshToken(refreshToken);

      if (refreshedTokenData instanceof Error) {
        throw refreshedTokenData;
      }

      const { token } = refreshedTokenData;

      this.__setTokenCookie(res, token.refreshToken);

      return {
        message: 'Tokens refreshed successfully',
        accessToken: token.accessToken
      };
    } catch (error) {
      if (error instanceof HttpError) {
        return error;
      }

      if (error instanceof Error) {
        const httpError = new HttpError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
        return httpError;
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
