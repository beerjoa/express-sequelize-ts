import { getMockReq, getMockRes } from '@jest-mock/express';
import httpStatus from 'http-status';

import config from '@/config';
import AuthController from '@/users/auth.controller';
import AuthService from '@/users/auth.service';
import CreateUserDto from '@/users/dtos/create-user.dto';
import SignInUserDto from '@/users/dtos/sign-in-user.dto';
import ApiError from '@/utils/api-error.util';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  beforeEach(async () => {
    service = new AuthService() as jest.Mocked<AuthService>;
    controller = new AuthController(service);
  });

  const signInInput: SignInUserDto = {
    email: 'tester@email.com',
    password: 'retset'
  };
  const signedInUser = {
    ...signInInput,
    id: expect.any(Number),
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date)
  };
  const signUpInput: CreateUserDto = {
    name: 'tester',
    email: 'tester@email.com',
    password: 'retset'
  };
  const signedUpUser = {
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
        user: signInInput
      });

      const { res, next, clearMockRes } = getMockRes({
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        cookie: jest.fn().mockReturnThis()
      });

      await controller.whoAmI(req, res);

      expect(res.status).toBeCalledWith(httpStatus.OK);
      expect(res.json).toBeCalledWith({
        user: expect.objectContaining(signInInput)
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
        user: signedUpUser,
        token: {
          accessToken: expect.any(String),
          refreshToken: expect.any(String)
        }
      });

      const req = getMockReq({
        body: signUpInput
      });
      const { res, next, clearMockRes } = getMockRes({
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        cookie: jest.fn().mockReturnThis()
      });

      await controller.signUp(signedUpUser, res);

      expect(res.status).toBeCalledWith(httpStatus.CREATED);
      expect(res.json).toBeCalledWith(
        expect.objectContaining({
          access_token: expect.any(String),
          user: expect.objectContaining({
            ...signUpInput
          })
        })
      );
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

    describe('should return api error', () => {
      const req = getMockReq({
        body: signUpInput
      });
      const { res, next, clearMockRes } = getMockRes({
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      });
      beforeEach(() => {
        clearMockRes();
      });
      it('should return 400 if user already exists', async () => {
        const apiError = new ApiError(httpStatus.BAD_REQUEST, 'User already exists');

        service.signUp = jest.fn().mockResolvedValue(apiError);

        await controller.signUp(signUpInput, res);

        expect(res.status).toBeCalledWith(httpStatus.BAD_REQUEST);
        expect(res.json).toBeCalledWith(
          expect.objectContaining({
            statusCode: httpStatus.BAD_REQUEST,
            message: 'User already exists'
          })
        );
      });
    });
  });

  describe('signIn', () => {
    it('should be defined', () => {
      expect(controller.signIn).toBeDefined();
    });

    it('should return 200 & valid response', async () => {
      service.signIn = jest.fn().mockResolvedValue({
        user: signedInUser,
        token: {
          accessToken: expect.any(String),
          refreshToken: expect.any(String)
        }
      });

      const req = getMockReq({
        body: signInInput
      });
      const { res, next, clearMockRes } = getMockRes({
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        cookie: jest.fn().mockReturnThis()
      });

      await controller.signIn(signUpInput, res);

      expect(res.status).toBeCalledWith(httpStatus.OK);
      expect(res.json).toBeCalledWith({
        access_token: expect.any(String),
        user: expect.objectContaining({
          ...signInInput
        })
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

    describe('should return api error', () => {
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

      it('should return 400 if password is incorrect', async () => {
        const apiError = new ApiError(httpStatus.BAD_REQUEST, 'Password is incorrect');
        service.signIn = jest.fn().mockResolvedValue(apiError);

        await controller.signIn(signUpInput, res);

        expect(res.status).toBeCalledWith(httpStatus.BAD_REQUEST);
        expect(res.json).toBeCalledWith(
          expect.objectContaining({
            statusCode: httpStatus.BAD_REQUEST,
            message: 'Password is incorrect'
          })
        );
      });

      it('should return 404 if user does not exist', async () => {
        const apiError = new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
        service.signIn = jest.fn().mockResolvedValue(apiError);

        await controller.signIn(signUpInput, res);

        expect(res.status).toBeCalledWith(httpStatus.NOT_FOUND);
        expect(res.json).toBeCalledWith(
          expect.objectContaining({
            statusCode: httpStatus.NOT_FOUND,
            message: 'User Not Found'
          })
        );
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

      await controller.signOut(req, res);

      expect(res.status).toBeCalledWith(httpStatus.OK);
      expect(res.json).toBeCalledWith({
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

      await controller.refreshToken(req, res);

      expect(res.status).toBeCalledWith(httpStatus.OK);
      expect(res.json).toBeCalledWith({
        access_token: expect.any(String),
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

    describe('should return api error', () => {
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
        const apiError = new ApiError(httpStatus.UNAUTHORIZED, 'invalid token');
        service.refreshToken = jest.fn().mockResolvedValue(apiError);

        await controller.refreshToken(req, res);

        expect(res.status).toBeCalledWith(httpStatus.UNAUTHORIZED);
        expect(res.json).toBeCalledWith(
          expect.objectContaining({
            statusCode: httpStatus.UNAUTHORIZED,
            message: 'invalid token'
          })
        );
        clearMockRes();
      });
    });
  });
});
