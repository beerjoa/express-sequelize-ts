import express from 'express';
import request from 'supertest';

import app from '@/app';

describe('index', () => {
  let testApp: express.Application;
  beforeAll(() => {
    testApp = app;
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
