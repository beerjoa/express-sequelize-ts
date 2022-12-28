import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { Model, Repository } from 'sequelize-typescript';

import config from '@/config';
import { sequelize } from '@/database/models';
import { User } from '@/database/models/user.model';
import CreateUserDto from '@/dtos/create-user.dto';
import SignInUserDto from '@/dtos/sign-in-user.dto';
import { IService } from '@/interfaces/service.interface';
import ApiError from '@/utils/api-error.util';

type TSignedUser = {
  user: Model<User>;
  token: string;
};

class AuthService implements IService {
  // prettier-ignore
  constructor(
    public readonly userRepository: Repository<Model<User>> = sequelize.getRepository(User),
  ) {}

  public async signUp(userInput: CreateUserDto): Promise<TSignedUser | ApiError> {
    const findUser = await this.userRepository.findOne({ where: { email: userInput.email } });

    if (findUser) {
      return new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(userInput.password, 10);
    const createUser = await this.userRepository.create({ ...userInput, password: hashedPassword } as User);

    const token = this.__createToken(createUser);
    return { user: createUser, token };
  }

  public async signIn(userInput: SignInUserDto): Promise<TSignedUser | ApiError> {
    const findUser = (await this.userRepository.findOne({ where: { email: userInput.email } })) as User;

    if (!findUser) {
      return new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
    }

    const hashedPassword = findUser.password;
    const isPasswordMatching = this.comparePassword(userInput.password, hashedPassword);

    if (!isPasswordMatching) {
      return new ApiError(httpStatus.BAD_REQUEST, 'Incorrect password');
    }

    const token = this.__createToken(findUser);
    return { user: findUser, token };
  }

  public async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
  private __createToken(user: Model<User>): string {
    return jwt.sign({ user }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRATION });
  }
}

export default AuthService;
