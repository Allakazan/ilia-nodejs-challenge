import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';

import { AuthRequest, AuthResponse } from './interfaces/auth-grpc.interface';
import { AuthPayload } from './interfaces/auth.interface';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GrpcJwtInterceptor } from 'src/common/interceptors/grpc-jwt.interceptor';

@UseInterceptors(GrpcJwtInterceptor)
@Controller()
export class AuthGrpcController {
  private logger: Logger = new Logger('AuthGrpcController');

  constructor(
    private readonly jwtService: JwtService,
    private readonly jwtStrategy: JwtStrategy,
  ) {}

  @GrpcMethod('AuthService', 'Authenticate')
  async validateToken({ token }: AuthRequest): Promise<AuthResponse> {
    try {
      const payload = this.jwtService.verify<AuthPayload>(token);

      // Validate the payload using JwtStrategy, keeping the validation logic centralized.
      const authUser = await this.jwtStrategy.validate(payload);

      if (!authUser) return { isValid: false, user: null };

      return {
        isValid: true,
        user: {
          id: authUser.id,
          email: authUser.email,
        },
      };
    } catch (error) {
      this.logger.warn(`Token validation failed: ${error.message}`);
      return { isValid: false, user: null };
    }
  }
}
