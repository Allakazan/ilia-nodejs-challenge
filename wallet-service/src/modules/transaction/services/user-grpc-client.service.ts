import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  UserServiceClient,
  ValidateUserResponse,
} from '../interfaces/user-grpc.interface';

@Injectable()
export class UserGrpcClientService implements OnModuleInit {
  private userGrpcService: UserServiceClient;

  constructor(@Inject('GRPC_USER_TOKEN') private client: ClientGrpc) {}

  onModuleInit() {
    this.userGrpcService =
      this.client.getService<UserServiceClient>('UserService');
  }

  async validateUser(userId: string): Promise<ValidateUserResponse> {
    try {
      const result = await firstValueFrom(
        this.userGrpcService.ValidateUser({ userId }),
      );
      return result;
    } catch (error) {
      throw new Error(`gRPC call failed: ${error.message}`);
    }
  }
}
