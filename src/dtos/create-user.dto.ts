import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export default class CreateUserDto {
  @Expose()
  @IsString()
  name!: string;

  @Expose()
  @IsEmail()
  email!: string;

  @Expose()
  @IsString()
  password!: string;
}
