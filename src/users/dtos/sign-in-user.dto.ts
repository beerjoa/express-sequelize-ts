import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

@JSONSchema({
  description: 'Sign in user dto',
  example: {
    email: 'johndoe@email.com',
    password: 'password'
  }
})
@Exclude()
export default class SignInUserDto {
  @Expose()
  @IsEmail()
  email!: string;

  @Expose()
  @IsString()
  password!: string;
}
