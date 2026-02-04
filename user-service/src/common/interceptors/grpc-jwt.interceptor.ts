import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class GrpcJwtInterceptor implements NestInterceptor {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const metadata = context.getArgs()[1];

    const auth = metadata?.get('authorization')?.[0];

    if (!auth) {
      throw new RpcException({
        message: 'Missing authorization metadata',
      });
    }

    const token = auth.toString().trim();

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('auth.secretInternal'),
        issuer: 'wallet-service',
      });

      context.getArgs()[0].user = payload;
    } catch (err) {
      console.warn('gRPC JWT verification failed:', err.message);
      throw new RpcException({
        message: 'Invalid token',
      });
    }

    return next.handle();
  }
}
