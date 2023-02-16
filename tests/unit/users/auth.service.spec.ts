import httpStatus from 'http-status';

import AuthService from '@/users/auth.service';
import CreateUserDto from '@/users/dtos/create-user.dto';
import SignInUserDto from '@/users/dtos/sign-in-user.dto';
import ApiError from '@/utils/api-error.util';

describe('AuthService', () => {
  let authService = new AuthService();

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  const createUserData: CreateUserDto = {
    email: 'nobody@test.com',
    password: '123456',
    name: 'Nobody'
  };

  const signInUserData: SignInUserDto = {
    email: 'nobody@test.com',
    password: '123456'
  };

  describe('when calling signUp', () => {
    it('should be defined', () => {
      expect(authService.signUp).toBeDefined();
    });

    describe('when creating a new user with token', () => {
      it('should return created user with token', async () => {
        const createUser = { ...createUserData, id: 0 };

        authService.userRepository.findOne = jest.fn().mockReturnValue(Promise.resolve(undefined));
        authService.userRepository.create = jest.fn().mockReturnValue(createUser);

        await expect(authService.signUp(createUserData)).resolves.toMatchObject({
          user: createUser,
          token: expect.objectContaining({
            accessToken: expect.any(String),
            refreshToken: expect.any(String)
          })
        });
      });
    });

    describe('if the user already exists', () => {
      it('should return an error', async () => {
        authService.userRepository.findOne = jest.fn().mockReturnValue(Promise.resolve(createUserData));

        await expect(authService.signUp(createUserData)).resolves.toMatchObject(
          new ApiError(httpStatus.BAD_REQUEST, 'User already exists')
        );
      });
    });
  });
  describe('when calling signIn', () => {
    it('should be defined', () => {
      expect(authService.signIn).toBeDefined();
    });

    describe('if user not found', () => {
      it('should return an error', async () => {
        authService.userRepository.findOne = jest.fn().mockReturnValue(Promise.resolve(null));

        await expect(authService.signIn(signInUserData)).resolves.toMatchObject(
          new ApiError(httpStatus.NOT_FOUND, 'User Not Found')
        );
      });
    });

    describe('if user password is incorrect', () => {
      it('should return an error', async () => {
        authService.userRepository.findOne = jest.fn().mockReturnValue(Promise.resolve(signInUserData));
        authService.comparePassword = jest.fn().mockReturnValue(false);

        await expect(authService.signIn(signInUserData)).resolves.toMatchObject(
          new ApiError(httpStatus.BAD_REQUEST, 'Incorrect password')
        );
      });
    });

    describe('when signing in with correct credentials', () => {
      it('should return user with token', async () => {
        const signInUser = { ...createUserData, id: 0 };
        authService.userRepository.findOne = jest.fn().mockReturnValue(Promise.resolve(signInUser));
        authService.comparePassword = jest.fn().mockReturnValue(true);

        await expect(authService.signIn(signInUserData)).resolves.toMatchObject({
          user: signInUser,
          token: expect.objectContaining({
            accessToken: expect.any(String),
            refreshToken: expect.any(String)
          })
        });
      });
    });
  });

  describe('when calling signOut', () => {
    it('should be defined', () => {
      expect(authService.signOut).toBeDefined();
    });
  });

  describe('when calling refreshToken', () => {
    it('should be defined', () => {
      expect(authService.refreshToken).toBeDefined();
    });

    it('should return a refresh token', async () => {
      const signInUser = { ...createUserData, id: 0 };
      authService.userRepository.findOne = jest.fn().mockReturnValue(Promise.resolve(signInUser));
      authService.comparePassword = jest.fn().mockReturnValue(true);

      await authService.signIn(signInUserData).then(async (res: any) => {
        const refreshToken = res.token.refreshToken;

        await expect(authService.refreshToken(refreshToken)).resolves.toMatchObject({
          token: expect.objectContaining({
            accessToken: expect.any(String),
            refreshToken: expect.any(String)
          })
        });
      });
    });
  });
});
