import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { UserGrpcClientService } from './services/user-grpc-client.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: [join(__dirname, '../../../../proto/user.proto')],
          url: '0.0.0.0:5002',
          loader: {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
          },
        },
      },
    ]),
  ],
  providers: [UserGrpcClientService],
  exports: [UserGrpcClientService],
})
export class GrpcClientModule {}
