import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BalanceResponseDto } from './dto/balance-response.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionsService } from './services/transaction.service';
import { Transaction, TransactionType } from 'src/entities/transaction.entity';
import { BalanceService } from './services/balance.service';
import { UserGrpcClientService } from '../grpc-client/services/user-grpc-client.service';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly balanceService: BalanceService,
    private readonly userGrpcClientService: UserGrpcClientService,
  ) {}

  @ApiOperation({
    summary: 'Create a new transaction',
    description: `
      Creates a new transaction with automatic retry support and concurrency control.
      
      This endpoint is safe to retry. If you receive a timeout or 
      network error, you can safely retry the same request and the system will 
      detect and prevent duplicates.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction created successfully',
    type: Transaction,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data or insufficient balance',
    schema: {
      example: {
        statusCode: 400,
        message: 'Insufficient balance. Available: 5000, Required: 10000',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description:
      'Conflict - A similar transaction is currently being processed',
    schema: {
      example: {
        statusCode: 409,
        message:
          'A similar transaction is currently being processed. Please wait a moment.',
        error: 'Conflict',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description:
      'Internal Server Error - Failed to process transaction after retries',
  })
  @HttpCode(HttpStatus.OK)
  @Post()
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const userValidation = await this.userGrpcClientService.validateUser(
      createTransactionDto.user_id,
    );

    if (!userValidation.is_valid)
      throw new BadRequestException(
        `User validation failed: ${userValidation.message}`,
      );

    return this.transactionsService.createTransaction(createTransactionDto);
  }

  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({
    status: 200,
    description: 'List of transactions',
    type: [Transaction],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'type', enum: TransactionType })
  @Get()
  getTransactions(
    @Query('type') type?: TransactionType,
  ): Promise<Transaction[]> {
    return this.transactionsService.getTransactions(type);
  }

  @ApiOperation({
    summary: 'Get consolidated balance from all transactions (credit/debit)',
  })
  @ApiResponse({
    status: 200,
    description: 'Consolidated balance',
    type: BalanceResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('balance')
  async getBalance(): Promise<BalanceResponseDto> {
    const amount = await this.balanceService.getTotalBalance();

    return { amount };
  }
}
