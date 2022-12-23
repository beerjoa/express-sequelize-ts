import dotenv from 'dotenv';
import { cleanEnv, num, port, str } from 'envalid';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const config = cleanEnv(process.env, {
  NODE_ENV: str({ default: 'development' }),
  PORT: port({ default: 3000 }),
  HOST: str({ default: 'localhost' }),
  JWT_SECRET: str({ default: 'secret' }),
  JWT_EXPIRATION: num({ default: 3600000 }),
  JWT_COOKIE_NAME: str({ default: 'Authorization' })
});

export default config;
