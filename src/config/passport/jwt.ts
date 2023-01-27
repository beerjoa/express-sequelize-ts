import { Strategy as JwtStrategy, StrategyOptions, VerifiedCallback, VerifyCallback } from 'passport-jwt';

import config from '@/config';
import { sequelize } from '@/config/database';
import { User } from '@/models/entities/user.entity';

const cookieExtractJwt = (req: any) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[config.JWT_COOKIE_NAME];
  }
  return token;
};

const jwtOptions: StrategyOptions = {
  jwtFromRequest: cookieExtractJwt,
  secretOrKey: config.JWT_SECRET
};

const jwtVerify: VerifyCallback = async (payload: any, done: VerifiedCallback) => {
  try {
    const userRepository = sequelize.getRepository(User);
    const reqUser = await userRepository.findOne({ where: { id: payload.user.id } });

    if (!reqUser) {
      return done(null, false, { message: 'Incorrect Token' });
    }

    return done(null, reqUser, { message: 'Logged In Successfully' });
  } catch (error) {
    return done(error, false, { message: 'Something went wrong' });
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default jwtStrategy;
