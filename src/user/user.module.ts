import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schemas';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
    
          useFactory: (config: ConfigService) => ({
            secret: config.get<string>('JWT_ACCESS_SECRET'),
          }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}