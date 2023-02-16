import { Expose } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export default class UserTokenKeyDto {
  @Expose()
  @IsNumber()
  id!: number;

  @Expose()
  @IsString()
  name!: string;

  @Expose()
  @IsEmail()
  email!: string;
}
