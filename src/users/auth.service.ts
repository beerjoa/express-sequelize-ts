import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { BadRequestError, HttpError } from 'routing-controllers';
import { Model, Repository } from 'sequelize-typescript';
import { Service } from 'typedi';

import { sequelize } from '@/config/database';
import { tokenHandler, TResultToken } from '@/config/token';
import { IService } from '@/interfaces/service.interface';
import UserDto, { CreateUserDto, SignInUserDto, UserTokenKeyDto } from '@/users/dtos/user.dto';
import User from '@/users/user.entity';

type TSignedUser = {
  user: UserDto;
  token: TResultToken;
};

@Service()
class AuthService implements IService {
  // prettier-ignore
  constructor(
    public readonly repository: Repository<Model<User>> = sequelize.getRepository(User),    
  ) {}

  public async signUp(userInput: CreateUserDto): Promise<TSignedUser | HttpError> {
    const findUser = await this.repository.findOne({ where: { email: userInput.email } });

    if (findUser) {
      return new HttpError(httpStatus.BAD_REQUEST, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(userInput.password, 10);
    userInput.password = hashedPassword;
    const createUser = (await this.repository.create(userInput as User)) as User;

    const createdTokens = this.__createToken(createUser);

    return { user: createUser as UserDto, token: createdTokens };
  }

  public async signIn(userInput: SignInUserDto): Promise<TSignedUser | HttpError> {
    const findUser = (await this.repository.findOne({ where: { email: userInput.email } })) as User;

    if (!findUser) {
      return new BadRequestError('Incorrect email or password.');
    }

    const hashedPassword = findUser.password;
    const isPasswordMatching = await this.comparePassword(userInput.password, hashedPassword);

    if (!isPasswordMatching) {
      return new BadRequestError('Incorrect email or password.');
    }

    const createdTokens = this.__createToken(findUser);

    return { user: findUser as UserDto, token: createdTokens };
  }

  public async signOut(): Promise<void> {
    // TODO
    // something logout logic
    // ex) update logout date in db
  }

  public async refreshToken(refreshToken: string): Promise<Pick<TSignedUser, 'token'> | HttpError> {
    const refreshedToken = this.__refreshToken(refreshToken);

    if (!refreshedToken) {
      return new HttpError(httpStatus.UNAUTHORIZED, 'invalid token');
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
