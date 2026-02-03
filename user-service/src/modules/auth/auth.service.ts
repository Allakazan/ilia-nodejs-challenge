import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

import { UserService } from '../user/user.service';
import { AuthPayload, AuthUser } from './interfaces/auth.interface';
import { LoginResponseDto } from './dto/login-response.dto';
import { TOKEN_CONFIG } from './constants/token.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, pass: string): Promise<AuthUser | null> {
    const user = await this.userService.findOneWithPassword({ email });

    if (!user) return null;

    if (!(await argon2.verify(user.password, pass))) return null;

    const { id, first_name, email: userEmail } = user;

    return { id, first_name, email: userEmail };
  }

  async login(user: AuthUser): Promise<LoginResponseDto> {
    const accessTokenPayload: AuthPayload = {
      email: user.email,
      sub: user.id,
    };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn: TOKEN_CONFIG.ACCESS_TOKEN.EXPIRES_IN,
    });

    return {
      access_token: accessToken,
      expires_in: TOKEN_CONFIG.ACCESS_TOKEN.EXPIRES_IN_SECONDS,
    };
  }
}
