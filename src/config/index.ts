import dotenv from 'dotenv';
import { cleanEnv, port, str } from 'envalid';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const config = cleanEnv(process.env, {
  NODE_ENV: str({ default: 'development' }),
  PORT: port({ default: 3000 }),
  HOST: str({ default: 'localhost' })
});

export default config;
