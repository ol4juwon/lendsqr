import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '../auth/local.auth';
import { AuthService } from 'src/auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Users } from './model/users.model';
import { ObjectionModule } from 'nestjs-objection/dist';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '60s' },
    }),
    ObjectionModule.forFeature([Users]),
  ],
  controllers: [UsersController],
  providers: [AuthService, ConfigService, UsersService, LocalStrategy],
})
export class UsersModule {}
