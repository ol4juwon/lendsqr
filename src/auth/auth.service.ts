import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/users/dto/login.dto';
import { UsersService } from 'src/users/users.service';
import * as bcryt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtservice: JwtService,
    private configService: ConfigService,
  ) {}
  async validateUser(loginDto: LoginDto) {
    const user = await this.userService.getUser(loginDto.email);
    if (!user) {
      return null;
    }
    const validPassword = await bcryt.compareSync(
      loginDto.password,
      user.password,
    );
    if (user && validPassword) {
      return user;
    }
    return null;
  }
  async login(user: any) {
    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      name: `${user.firstName} ${user.lastName}`,
    };
    return {
      accessToken: this.jwtservice.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        algorithm: 'HS256',
        expiresIn: '1h',
      }),
    };
  }
}
// configsevice get string?
