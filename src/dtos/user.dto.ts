import { Exclude, Expose } from 'class-transformer';
import { IsDate, IsEmail, IsNumber, IsString } from 'class-validator';

@Exclude()
export class UserDto {
  @IsNumber()
  id!: number;

  @Expose()
  @IsString()
  name!: string;

  @Expose()
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsDate()
  createdAt!: string;

  @IsDate()
  updatedAt!: string;
}
