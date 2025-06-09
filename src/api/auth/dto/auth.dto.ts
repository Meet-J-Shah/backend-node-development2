import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginReqDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;
}

export class LoginResDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export class AdminAuthDto<T> {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles?: T[];
  permissions?: string[];
}
