import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

import UserDto from '@/users/dtos/user.dto';

@JSONSchema({
  description: 'User Error Response dto',
  example: {
    message: 'User Error Response',
    isOperational: true,
    statusCode: 400
  }
})
export class UserErrorResponseDto {
  @Expose()
  @IsString()
  public message!: string;

  @Expose()
  @IsBoolean()
  public isOperational!: boolean;

  @Expose()
  @IsNumber()
  public statusCode!: number;
}

@JSONSchema({
  description: 'User Response dto',
  example: {
    user: {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@email.com',
      createdAt: '2021-02-09T09:07:36.533Z',
      updatedAt: '2021-02-09T09:07:36.533Z'
    },
    accessToken: 'example_token'
  }
})
export class UserResponseDto {
  @Expose()
  @IsObject()
  @ValidateNested()
  @Type(() => UserDto)
  public user!: UserDto;

  @Expose()
  @IsString()
  public accessToken!: string;
}
