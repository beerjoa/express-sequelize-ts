import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export default class SignInUserDto {
  @Expose()
  @IsEmail()
  email!: string;

  @Expose()
  @IsString()
  password!: string;
}
