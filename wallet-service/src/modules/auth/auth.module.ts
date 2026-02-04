import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthGrpcClientService } from './auth-grpc-client.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GrpcAuthStrategy } from './strategies/grpc-auth.strategy';
import { AuthInternalModule } from '../auth-internal/auth-internal.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'GRPC_AUTH_TOKEN',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
          const grpc = config.getOrThrow<{ host: string; port: number }>(
            'grpc',
          );

          return {
            transport: Transport.GRPC,
            options: {
              package: 'auth',
              protoPath: join(__dirname, '../../../../proto/auth.proto'),
              url: `${grpc.host}:${grpc.port}`,
            },
          };
        },
      },
    ]),
    PassportModule.register({ defaultStrategy: 'grpc-auth' }),
    AuthInternalModule,
  ],
  providers: [GrpcAuthStrategy, AuthGrpcClientService],
})
export class AuthModule {}
