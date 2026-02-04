import { Module } from '@nestjs/common';
import { AuthInternalService } from './auth-internal.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('auth.secretInternal'),
        signOptions: {
          expiresIn: '5m',
          issuer: 'wallet-service',
        },
      }),
    }),
  ],
  providers: [AuthInternalService],
  exports: [AuthInternalService],
})
export class AuthInternalModule {}
