import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TOKEN_CONFIG } from './constants/token.constant';
import { AuthGrpcController } from './auth.grpc.controller';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('auth.secret'),
        // On production, consider using a shorter expiration and refresh tokens
        signOptions: { expiresIn: TOKEN_CONFIG.ACCESS_TOKEN.EXPIRES_IN },
      }),
    }),
  ],
  controllers: [AuthController, AuthGrpcController],
  providers: [LocalStrategy, JwtStrategy, AuthService],
})
export class AuthModule {}
