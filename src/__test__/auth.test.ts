import App from '@/app';
import config from '@/config';
import databaseHandler from '@/config/database';
import CreateUserDto from '@/dtos/create-user.dto';
import logger from '@/utils/logger.util';
import httpStatus from 'http-status';
import request from 'supertest';

describe('auth', () => {
  let testApp: Express.Application;

  const { app } = new App();
  beforeAll(async () => {
    testApp = app;
    await databaseHandler.connect().then(() => {
      logger.info('Test Database connected');
    });
  });

  afterAll(async () => {
    await databaseHandler.disconnect().then(() => {
      logger.info('Test Database disconnected');
    });
  });

  const createUserData: CreateUserDto = {
    name: 'Nobody',
    email: 'nobody@gmail.com',
    password: '123456'
  };

  describe('POST /auth/sign-up', () => {
    it('should return 201 & valid response', async () => {
      await request(testApp)
        .post('/api/auth/sign-up')
        .send(createUserData)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(httpStatus.CREATED)
        .then((response) => {
          expect(response.body).toMatchObject({
            id: expect.any(Number),
            email: createUserData.email,
            name: createUserData.name,
            password: expect.any(String),
            updatedAt: expect.any(String),
            createdAt: expect.any(String)
          });
        });
    });

    describe('should return api error', () => {
      it('when input is invalid', async () => {
        await request(testApp)
          .post('/api/auth/sign-up')
          .send({ wrong_input: 'wrong_input' })
          .expect('Content-Type', /json/)
          .expect(httpStatus.UNPROCESSABLE_ENTITY)
          .then((response) => {
            expect(response.body).toMatchObject({
              statusCode: httpStatus.UNPROCESSABLE_ENTITY,
              isOperational: true,
              message: expect.stringContaining('An instance of CreateUserDto has failed the validation:')
            });
          });
      });
      it('when email is already taken', async () => {
        await request(testApp)
          .post('/api/auth/sign-up')
          .send(createUserData)
          .expect('Content-Type', /json/)
          .expect(httpStatus.BAD_REQUEST)
          .then((response) => {
            expect(response.body).toMatchObject({
              statusCode: httpStatus.BAD_REQUEST,
              isOperational: true,
              message: 'User already exists'
            });
          });
      });
    });
  });
  describe('POST /auth/sign-in', () => {
    it('should return 200 & valid response', async () => {
      await request(testApp)
        .post('/api/auth/sign-in')
        .send(createUserData)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(httpStatus.OK)
        .then((response) => {
          expect(response.body).toMatchObject({
            id: expect.any(Number),
            email: createUserData.email,
            name: createUserData.name,
            password: expect.any(String),
            updatedAt: expect.any(String),
            createdAt: expect.any(String)
          });
        });
    });

    describe('should return api error', () => {
      it('when input is invalid', async () => {
        await request(testApp)
          .post('/api/auth/sign-in')
          .send({ wrong_input: 'wrong_input' })
          .expect('Content-Type', /json/)
          .expect(httpStatus.UNPROCESSABLE_ENTITY)
          .then((response) => {
            expect(response.body).toMatchObject({
              statusCode: httpStatus.UNPROCESSABLE_ENTITY,
              isOperational: true,
              message: expect.stringContaining('An instance of SignInUserDto has failed the validation:')
            });
          });
      });
      it('when email is not found', async () => {
        await request(testApp)
          .post('/api/auth/sign-in')
          .send({ email: 'wrong@email.com', password: 'wrong-password' })
          .expect('Content-Type', /json/)
          .expect(httpStatus.UNAUTHORIZED)
          .then((response) => {
            expect(response.body).toMatchObject({
              statusCode: httpStatus.UNAUTHORIZED,
              isOperational: true,
              message: 'Incorrect email or password.'
            });
          });
      });
      it('when password is incorrect', async () => {
        await request(testApp)
          .post('/api/auth/sign-in')
          .send({ email: createUserData.email, password: 'wrong_password' })
          .expect('Content-Type', /json/)
          .expect(httpStatus.UNAUTHORIZED)
          .then((response) => {
            expect(response.body).toMatchObject({
              statusCode: httpStatus.UNAUTHORIZED,
              isOperational: true,
              message: 'Incorrect email or password.'
            });
          });
      });
    });
  });

  describe('GET /auth/sign-out', () => {
    let token: string;
    it('should return 200 & valid response', async () => {
      await request(testApp)
        .post('/api/auth/sign-in')
        .send(createUserData)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(httpStatus.OK)
        .then((response) => {
          response.header['set-cookie'].forEach((cookie: string) => {
            if (cookie.includes(config.JWT_COOKIE_NAME)) {
              token = cookie.split(';')[0].split('=')[1];
            }
          });
        });

      await request(testApp)
        .get('/api/auth/sign-out')
        .set('Cookie', `${config.JWT_COOKIE_NAME}=${token}`)
        .expect('Content-Type', /json/)
        .expect(httpStatus.OK)
        .then((response) => {
          expect(response.body).toMatchObject({
            message: 'User signed out successfully'
          });
        });
    });

    describe('should return api error', () => {
      it('when token is invalid', async () => {
        await request(testApp)
          .get('/api/auth/sign-out')
          .set('Cookie', `${config.JWT_COOKIE_NAME}=invalid_token`)
          .expect('Content-Type', /json/)
          .expect(httpStatus.UNAUTHORIZED)
          .then((response) => {
            expect(response.body).toMatchObject({
              statusCode: httpStatus.UNAUTHORIZED,
              isOperational: true,
              message: 'jwt malformed'
            });
          });
      });
    });
  });
});
