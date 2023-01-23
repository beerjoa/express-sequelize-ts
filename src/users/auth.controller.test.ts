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

  describe('signUp', () => {
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

    it('should be defined', () => {
      expect(controller.signUp).toBeDefined();
    });

    it('should return 201 & valid response', async () => {
      service.signUp = jest.fn().mockResolvedValue({
        user: signedUpUser,
        token: expect.any(String)
      });

      const req = getMockReq({
        body: signUpInput
      });
      const { res, next, clearMockRes } = getMockRes({
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        cookie: jest.fn().mockReturnThis()
      });

      await controller.signUp(req, res, next);

      expect(res.status).toBeCalledWith(httpStatus.CREATED);
      expect(res.json).toBeCalledWith(
        expect.objectContaining({
          ...signUpInput
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

        await controller.signUp(req, res, next);

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

    it('should be defined', () => {
      expect(controller.signIn).toBeDefined();
    });

    it('should return 200 & valid response', async () => {
      service.signIn = jest.fn().mockResolvedValue({
        user: signedInUser,
        token: expect.any(String)
      });

      const req = getMockReq({
        body: signInInput
      });
      const { res, next, clearMockRes } = getMockRes({
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        cookie: jest.fn().mockReturnThis()
      });

      await controller.signIn(req, res, next);

      expect(res.status).toBeCalledWith(httpStatus.OK);
      expect(res.json).toBeCalledWith(
        expect.objectContaining({
          ...signInInput
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

        await controller.signIn(req, res, next);

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

        await controller.signIn(req, res, next);

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
});
