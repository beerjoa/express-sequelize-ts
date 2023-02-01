import bcrypt from 'bcrypt';
import { IStrategyOptions, Strategy as LocalStrategy, VerifyFunction } from 'passport-local';

import { sequelize } from '@/config/database';
import { User } from '@/models/entities/user.entity';

const localOptions: IStrategyOptions = {
  usernameField: 'email',
  passwordField: 'password'
};

const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
const localVerify: VerifyFunction = async (email: string, password: string, done) => {
  try {
    const userRepository = sequelize.getRepository(User);

    const reqUser = await userRepository.findOne({
      where: {
        email
      }
    });

    const hashedPassword = reqUser ? reqUser.password : '';
    const isPasswordMatching = await comparePassword(password, hashedPassword);

    if (!isPasswordMatching || !reqUser) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }

    return done(null, reqUser, { message: 'Logged In Successfully' });
  } catch (error) {
    return done(error, false, { message: 'Something went wrong' });
  }
};

const localStrategy = new LocalStrategy(localOptions, localVerify);

export default localStrategy;
