import { config } from 'dotenv';
import { cleanEnv, port, str } from 'envalid';

config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const env = cleanEnv(process.env, {
  PORT: port({ default: 3000 }),
  HOST: str({ default: 'localhost' })
});

export const { PORT, HOST } = env;
