import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGrpcClientService } from '../auth-grpc-client.service';

@Injectable()
export class GrpcAuthStrategy extends PassportStrategy(Strategy, 'grpc-auth') {
  constructor(private readonly authService: AuthGrpcClientService) {
    super();
  }

  async validate(req: any) {
    const authHeader = req.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token = authHeader.replace('Bearer', '').trim();

    const response = await this.authService.authenticate(token);

    if (!response.isValid) {
      throw new UnauthorizedException('Invalid token');
    }

    return response.user;
  }
}
