import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({'message': 'username is required'})
  username!: string;

  @IsString()
  @IsNotEmpty({'message': 'password is required'})
  password!: string;
}

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}