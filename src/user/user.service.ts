import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { LoginDto, RefreshTokenDto } from './dto/Login.dto';
import { User } from '../user/schemas/user.schemas';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    private readonly jwtService: JwtService,

    private readonly logger: LoggerService,
  ) {}

  async login(loginDto: LoginDto) {

    const user = await this.userModel
      .findOne({
        username: loginDto.username,
      })
      .select('+password');

    if (!user) {

      this.logger.warn({
        event: 'LOGIN_FAILED',
        username: loginDto.username,
        reason: 'USER_NOT_FOUND',
        timestamp: new Date().toISOString(),
      });

      throw new UnauthorizedException(
        'Invalid username or password',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {

      this.logger.warn({
        event: 'LOGIN_FAILED',
        username: loginDto.username,
        reason: 'INVALID_PASSWORD',
        timestamp: new Date().toISOString(),
      });

      throw new UnauthorizedException(
        'Invalid username or password',
      );
    }

    const payload = {
      sub: user._id,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(
      payload,
      {
        expiresIn: '15m',
        secret: process.env.JWT_ACCESS_SECRET,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      payload,
      {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET,
      },
    );

    const hashedRefreshToken =
      await bcrypt.hash(refreshToken, 10);

    await this.userModel.updateOne(
      {
        _id: user._id,
      },
      {
        hashedRefreshToken,
      },
    );

    this.logger.info({
      event: 'LOGIN_SUCCESS',
      userId: user._id.toString(),
      username: user.username,
      timestamp: new Date().toISOString(),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refresh(dto: RefreshTokenDto) {

    let payload;

    try {

      payload =
        await this.jwtService.verifyAsync(
          dto.refreshToken,
          {
            secret: process.env.JWT_REFRESH_SECRET,
          },
        );

    } catch {

      throw new UnauthorizedException(
        'Invalid Refresh Token',
      );

    }

    const user =
      await this.userModel
        .findById(payload.sub)
        .select('+hashedRefreshToken');

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.hashedRefreshToken) {
      throw new UnauthorizedException('Refresh Token not found');
    }

    const isValid = await bcrypt.compare(
      dto.refreshToken,
      user.hashedRefreshToken,
    );

    if (!isValid) {
      throw new UnauthorizedException(
        'Refresh Token Revoked',
      );
    }

    const newPayload = {
      sub: user._id.toString(),
      username: user.username,
    };

    const accessToken =
      await this.jwtService.signAsync(
        newPayload,
        {
          expiresIn: '15m',
          secret: process.env.JWT_ACCESS_SECRET!,
        },
      );

    const refreshToken =
      await this.jwtService.signAsync(
        newPayload,
        {
          expiresIn: '7d',
          secret: process.env.JWT_REFRESH_SECRET!,
        },
      );

    user.hashedRefreshToken =
      await bcrypt.hash(refreshToken, 10);

    await user.save();

    return {
      accessToken,
      refreshToken,
    };
  }
}