import express from 'express';
import request from 'supertest';

import App from '@/app';
import databaseHandler from '@/config/database';
import logger from '@/utils/logger.util';

describe('index', () => {
  let testApp: express.Application;

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
  describe('get index route', () => {
    it('should return 200 & valid response', async () => {
      await request(testApp)
        .get('/api')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject({ message: 'Hello World' });
        });
    });
  });
});
