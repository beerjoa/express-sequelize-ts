import { getMockReq, getMockRes } from '@jest-mock/express';
import httpStatus from 'http-status';
import { HttpError } from 'routing-controllers';

import config from '@/config';
import { TResultToken } from '@/config/token';
import AuthController from '@/users/auth.controller';
import AuthService from '@/users/auth.service';
import { UserResponseDto } from '@/users/dtos/response.dto';
import UserDto, { CreateUserDto, SignInUserDto } from '@/users/dtos/user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  beforeEach(async () => {
    service = new AuthService() as jest.Mocked<AuthService>;
    controller = new AuthController(service);
  });

  const signUpInput: CreateUserDto = {
    name: 'tester',
    email: 'tester@email.com',
    password: 'retset'
  };
  const signedUpUser: UserDto = {
    ...signUpInput,
    id: expect.any(Number),
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date)
  };

  const signInInput: SignInUserDto = {
    email: 'tester@email.com',
    password: 'retset'
  };
  const signedInUser: UserDto = {
    ...signUpInput,
    id: expect.any(Number),
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date)
  };

  describe('whoAmI', () => {
    it('should be defined', () => {
      expect(controller.whoAmI).toBeDefined();
    });

    it('should return 200 & valid response', async () => {
      const req = getMockReq({
        user: signedInUser as UserDto
      });

      const { res, next, clearMockRes } = getMockRes({
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        cookie: jest.fn().mockReturnThis()
      });

      const mockTokenWithAuthType = `${config.JWT_AUTH_TYPE} mock_token`;
      const result = await controller.whoAmI(req, mockTokenWithAuthType);
      const mockToken = mockTokenWithAuthType.split(' ')[1];

      expect(result).toBeInstanceOf(UserResponseDto);
      expect(result).toMatchObject({
        user: signedInUser,
        accessToken: mockToken
      });

      clearMockRes();
    });
  });

  describe('signUp', () => {
    it('should be defined', () => {
      expect(controller.signUp).toBeDefined();
    });

    it('should return 201 & valid response', async () => {
      service.signUp = jest.fn().mockResolvedValue({
        user: signedUpUser as UserDto,
        token: {
          accessToken: expect.any(String),
          refreshToken: expect.any(String)
        } as TResultToken
      });

      const req = getMockReq({
        body: signUpInput
      });
      const { res, next, clearMockRes } = getMockRes({
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        cookie: jest.fn().mockReturnThis()
      });

      const result = await controller.signUp(signedUpUser, res);

      expect(result).toBeInstanceOf(UserResponseDto);
      expect(result).toMatchObject({
        user: signedUpUser,
        accessToken: expect.any(String)
      });
      expect(res.cookie).toBeCalledWith(
        config.JWT_COOKIE_NAME,
        expect.any(String),
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          maxAge: expect.any(Number)
        })
      );
      clearMockRes();
    });

    describe('should return http error', () => {
      const req = getMockReq({
        body: signUpInput
      });
      const { res, next, clearMockRes } = getMockRes();
      beforeEach(() => {
        clearMockRes();
      });
      it('should return 400 if user already exists', async () => {
        const httpError = new HttpError(httpStatus.BAD_REQUEST, 'User already exists');

        service.signUp = jest.fn().mockResolvedValue(httpError);

        const result = await controller.signUp(signUpInput, res);

        expect(result).toBeInstanceOf(HttpError);
        expect(result).toMatchObject({
          httpCode: httpStatus.BAD_REQUEST,
          message: 'User already exists'
        });
      });
    });
  });

  describe('signIn', () => {
    it('should be defined', () => {
      expect(controller.signIn).toBeDefined();
    });

    it('should return 200 & valid response', async () => {
      service.signIn = jest.fn().mockResolvedValue({
        user: signedInUser as UserDto,
        token: {
          accessToken: expect.any(String),
          refreshToken: expect.any(String)
        } as TResultToken
      });

      const { res, next, clearMockRes } = getMockRes({
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        cookie: jest.fn().mockReturnThis()
      });

      const result = await controller.signIn(signInInput, res);

      expect(result).toBeInstanceOf(UserResponseDto);
      expect(result).toMatchObject({
        user: signedInUser,
        accessToken: expect.any(String)
      });
      expect(res.cookie).toBeCalledWith(
        config.JWT_COOKIE_NAME,
        expect.any(String),
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          maxAge: expect.any(Number)
        })
      );
      clearMockRes();
    });

    describe('should return http error', () => {
      const { res, next, clearMockRes } = getMockRes({
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      });

      beforeEach(() => {
        clearMockRes();
      });

      it('should return 400 if password is incorrect', async () => {
        const httpError = new HttpError(httpStatus.BAD_REQUEST, 'Password is incorrect');
        service.signIn = jest.fn().mockResolvedValue(httpError);

        const result = await controller.signIn(signUpInput, res);

        expect(result).toBeInstanceOf(HttpError);
        expect(result).toMatchObject({
          httpCode: httpStatus.BAD_REQUEST,
          message: 'Password is incorrect'
        });
      });

      it('should return 404 if user does not exist', async () => {
        const httpError = new HttpError(httpStatus.NOT_FOUND, 'Incorrect email or password.');
        service.signIn = jest.fn().mockResolvedValue(httpError);

        const result = await controller.signIn(signUpInput, res);

        expect(result).toBeInstanceOf(HttpError);
        expect(result).toMatchObject({
          httpCode: httpStatus.NOT_FOUND,
          message: 'Incorrect email or password.'
        });
      });
    });
  });

  describe('signOut', () => {
    it('should be defined', () => {
      expect(controller.signOut).toBeDefined();
    });

    it('should return 200 & valid response', async () => {
      const req = getMockReq({});
      const { res, next, clearMockRes } = getMockRes({
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        clearCookie: jest.fn().mockReturnThis()
      });

      const result = await controller.signOut(req, res);

      expect(result).toMatchObject({
        message: 'Sign out successfully'
      });
      expect(res.clearCookie).toBeCalledWith(config.JWT_COOKIE_NAME);
      clearMockRes();
    });
  });

  describe('refreshToken', () => {
    it('should be defined', () => {
      expect(controller.refreshToken).toBeDefined();
    });

    it('should return 200 & valid response', async () => {
      service.refreshToken = jest.fn().mockResolvedValue({
        token: {
          accessToken: expect.any(String),
          refreshToken: expect.any(String)
        }
      });

      const req = getMockReq({});
      const { res, next, clearMockRes } = getMockRes({
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        cookie: jest.fn().mockReturnThis()
      });

      const result = await controller.refreshToken(req, res);

      expect(result).toMatchObject({
        accessToken: expect.any(String),
        message: 'Tokens refreshed successfully'
      });
      expect(res.cookie).toBeCalledWith(
        config.JWT_COOKIE_NAME,
        expect.any(String),
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          maxAge: expect.any(Number)
        })
      );
      clearMockRes();
    });

    describe('should return http error', () => {
      const req = getMockReq({
        body: signInInput
      });
      const { res, next, clearMockRes } = getMockRes({
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      });

      beforeEach(() => {
        clearMockRes();
      });

      it('should return 401 if refresh token is invalid', async () => {
        const httpError = new HttpError(httpStatus.UNAUTHORIZED, 'invalid token');
        service.refreshToken = jest.fn().mockResolvedValue(httpError);

        const result = await controller.refreshToken(req, res);

        expect(result).toBeInstanceOf(HttpError);
        expect(result).toMatchObject({
          httpCode: httpStatus.UNAUTHORIZED,
          message: 'invalid token'
        });
      });
    });
  });
});
