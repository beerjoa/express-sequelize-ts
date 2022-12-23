import { sequelize } from '@/database/models';
import { User } from '@/database/models/user.model';
import {
  IStrategyOptions,
  Strategy as LocalStrategy,
  VerifyFunction
} from 'passport-local';

const localOptions: IStrategyOptions = {
  usernameField: 'email',
  passwordField: 'password'
};

const localVerify: VerifyFunction = async (email, password, done) => {
  try {
    const userRepository = sequelize.getRepository(User);

    const user = await userRepository.findOne({
      where: {
        email,
        password
      }
    });

    if (!user) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }
    return done(null, user, { message: 'Logged In Successfully' });
  } catch (error) {
    return done(error, false, { message: 'Something went wrong' });
  }
};

const localStrategy = new LocalStrategy(localOptions, localVerify);

export default localStrategy;
