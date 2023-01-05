import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ObjectionModule } from 'nestjs-objection/dist';
import { Users } from 'src/users/model/users.model';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.auth';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '60s' },
    }),
    ObjectionModule.forFeature([Users]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ConfigService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
