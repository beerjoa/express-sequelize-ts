import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Model, Repository } from 'sequelize-typescript';

import { sequelize } from '@/config/database';
import { tokenHandler, TResultToken } from '@/config/token';
import { IService } from '@/interfaces/service.interface';
import CreateUserDto from '@/models/dtos/create-user.dto';
import SignInUserDto from '@/models/dtos/sign-in-user.dto';
import UserTokenKeyDto from '@/models/dtos/user-token-key.dto';
import { User } from '@/models/entities/user.entity';
import ApiError from '@/utils/api-error.util';

type TSignedUser = {
  user: Model<User>;
  token: TResultToken;
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
    const createdTokens = this.__createToken(createUser as User);

    return { user: createUser, token: createdTokens };
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

    const createdTokens = this.__createToken(findUser);

    return { user: findUser, token: createdTokens };
  }

  public async signOut(): Promise<void> {
    // TODO
    // something logout logic
    // ex) update logout date in db
  }

  public async refreshToken(refreshToken: string): Promise<Pick<TSignedUser, 'token'> | ApiError> {
    const refreshedToken = this.__refreshToken(refreshToken);

    if (!refreshedToken) {
      return new ApiError(httpStatus.UNAUTHORIZED, 'invalid token');
    }

    return { token: refreshedToken };
  }

  public async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
  private __createToken(user: User): TResultToken {
    return tokenHandler.sign(user as UserTokenKeyDto);
  }

  private __verifyToken(type: string, token: string): string | object {
    return tokenHandler.verify(type, token);
  }

  private __refreshToken(token: string): TResultToken {
    return tokenHandler.refresh(token);
  }
}

export default AuthService;
