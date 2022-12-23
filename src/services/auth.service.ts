import { sequelize } from '@/database/models';
import { User } from '@/database/models/user.model';
import { UserDto } from '@/dtos/user.dto';
import { IService } from '@/interfaces/service.interface';
import { Model, Repository } from 'sequelize-typescript';

class AuthService implements IService {
  constructor(
    /* prettier-ignore */
    public readonly userRepository: Repository<Model> = sequelize.getRepository(User)
  ) {}
  public async signIn(userInput: UserDto): Promise<Model | null> {
    const { email, password } = userInput;
    const result = await this.userRepository.findOne({
      where: {
        email,
        password
      }
    });

    return result;
  }
}

export default AuthService;
