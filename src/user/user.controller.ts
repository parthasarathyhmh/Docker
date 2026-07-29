import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto, RefreshTokenDto } from './dto/Login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  login(
    @Body() loginDto: LoginDto,
  ) {
    return this.userService.login(loginDto);
  }

  @Post('refresh')
  refresh(
    @Body() dto: RefreshTokenDto,
  ) {
    return this.userService.refresh(dto);
  }
}
