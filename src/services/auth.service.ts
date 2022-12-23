import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Model, Repository } from 'sequelize-typescript';

import { sequelize } from '@/database/models';
import { User } from '@/database/models/user.model';
import CreateUserDto from '@/dtos/create-user.dto';
import SignInUserDto from '@/dtos/sign-in-user.dto';
import { IService } from '@/interfaces/service.interface';
import ApiError from '@/utils/api-error.util';

class AuthService implements IService {
  // prettier-ignore
  constructor(
    public readonly userRepository: Repository<Model> = sequelize.getRepository(User),
  ) {}

  public async signUp(userInput: CreateUserDto): Promise<Model<User> | ApiError> {
    const { name, email, password } = userInput;

    const findUser = await this.userRepository.findOne({ where: { email } });

    if (findUser !== null) {
      return new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createUser = await this.userRepository.create({ name, email, password: hashedPassword });
    return createUser;
  }

  public async signIn(userInput: SignInUserDto): Promise<Model<User> | ApiError> {
    const { email, password } = userInput;
    const findUser = await this.userRepository.findOne({ where: { email } });

    if (findUser === null) {
      return new ApiError(httpStatus.NOT_FOUND, 'User Not Found');
    }
    const isPasswordMatching = await bcrypt.compare(password, findUser.get('password', { plain: true }) as string);

    if (!isPasswordMatching) {
      return new ApiError(httpStatus.BAD_REQUEST, 'Incorrect password');
    }

    return findUser;
  }
}

export default AuthService;
