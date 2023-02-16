import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

@JSONSchema({
  description: 'Create user dto',
  example: {
    name: 'John Doe',
    email: 'johndoe@email.com',
    password: 'password'
  }
})
@Exclude()
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
