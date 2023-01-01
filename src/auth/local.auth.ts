import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }
  async validate(email: string, password: string) {
    const c = await this.authService.validateUser({
      email,
      password,
    });
    if (!c) {
      throw new UnauthorizedException();
    }
    return c;
  }
}
