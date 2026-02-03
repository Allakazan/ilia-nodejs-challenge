import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transaction.entity';
import { TransactionsController } from './transaction.controller';
import { TransactionsService } from './services/transaction.service';
import { BalanceService } from './services/balance.service';
import { GrpcClientModule } from '../grpc-client/grpc-client.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), GrpcClientModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, BalanceService],
})
export class TransactionModule {}
