import dotenv from 'dotenv';
import { cleanEnv, num, port, str } from 'envalid';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const config = cleanEnv(process.env, {
  NODE_ENV: str({ default: 'development' }),
  PORT: port({ default: 3000 }),
  HOST: str({ default: 'localhost' }),
  JWT_ACCESS_TOKEN_SECRET: str({ default: 'secret' }),
  JWT_REFRESH_TOKEN_SECRET: str({ default: 'refresh_secret' }),
  JWT_EXPIRATION: num({ default: 3600000 }),
  JWT_COOKIE_NAME: str({ default: 'Authorization' }),
  REDIS_HOST: str({ default: 'redis' }),
  REDIS_PORT: port({ default: 6379 }),
  REDIS_PASSWORD: str({ default: '' })
});

export default config;
