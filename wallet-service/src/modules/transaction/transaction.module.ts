import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transaction.entity';
import { TransactionsController } from './transaction.controller';
import { TransactionsService } from './services/transaction.service';
import { BalanceService } from './services/balance.service';
import { UserGrpcClientService } from './services/user-grpc-client.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthInternalModule } from '../auth-internal/auth-internal.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    ClientsModule.registerAsync([
      {
        name: 'GRPC_USER_TOKEN',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
          const grpc = config.getOrThrow<{ host: string; port: number }>(
            'grpc',
          );

          return {
            transport: Transport.GRPC,
            options: {
              package: 'user',
              protoPath: join(__dirname, '../../../../proto/user.proto'),
              url: `${grpc.host}:${grpc.port}`,
            },
          };
        },
      },
    ]),
    AuthInternalModule,
  ],
  controllers: [TransactionsController],
  providers: [UserGrpcClientService, TransactionsService, BalanceService],
})
export class TransactionModule {}
