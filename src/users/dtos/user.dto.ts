import { Exclude, Expose } from 'class-transformer';
import { IsDate, IsEmail, IsNumber, IsString, IsStrongPassword } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

@Exclude()
export default class UserDto {
  @Expose()
  @IsNumber()
  public id!: number;

  @Expose()
  @IsString()
  public name!: string;

  @Expose()
  @IsEmail()
  public email!: string;

  @IsStrongPassword()
  public password!: string;

  @Expose()
  @IsDate()
  public createdAt!: Date;

  @Expose()
  @IsDate()
  public updatedAt!: Date;
}

@JSONSchema({
  description: 'Create user dto',
  example: {
    name: 'John Doe',
    email: 'johndoe@email.com',
    password: 'password'
  }
})
export class CreateUserDto {
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

@JSONSchema({
  description: 'Sign in user dto',
  example: {
    email: 'johndoe@email.com',
    password: 'password'
  }
})
export class SignInUserDto {
  @Expose()
  @IsEmail()
  email!: string;

  @Expose()
  @IsString()
  password!: string;
}

export class UserTokenKeyDto {
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
