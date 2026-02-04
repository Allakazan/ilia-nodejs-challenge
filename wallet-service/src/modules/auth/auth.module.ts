import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthGrpcClientService } from './auth-grpc-client.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GrpcAuthStrategy } from './strategies/grpc-auth.strategy';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'GRPC_AUTH_TOKEN',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(__dirname, '../../../../proto/auth.proto'),
          url: '0.0.0.0:5002',
        },
      },
    ]),
    PassportModule.register({ defaultStrategy: 'grpc-auth' }),
  ],
  providers: [GrpcAuthStrategy, AuthGrpcClientService],
})
export class AuthModule {}
