import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  AuthServiceClient,
  AuthResponse,
} from './interface/auth-grpc.interface';

@Injectable()
export class AuthGrpcClientService implements OnModuleInit {
  private authGrpcService: AuthServiceClient;

  constructor(@Inject('GRPC_AUTH_TOKEN') private client: ClientGrpc) {}

  onModuleInit() {
    this.authGrpcService =
      this.client.getService<AuthServiceClient>('AuthService');
  }

  async authenticate(token: string): Promise<AuthResponse> {
    try {
      const response = await firstValueFrom(
        this.authGrpcService.Authenticate({ token }),
      );

      return response;
    } catch (error) {
      throw new Error(`gRPC call failed: ${error.message}`);
    }
  }
}
