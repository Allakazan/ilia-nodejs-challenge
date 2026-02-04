import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  AuthServiceClient,
  AuthResponse,
} from './interface/auth-grpc.interface';
import { AuthInternalService } from '../auth-internal/auth-internal.service';

@Injectable()
export class AuthGrpcClientService implements OnModuleInit {
  private authGrpcService: AuthServiceClient;

  constructor(
    private readonly authInternalService: AuthInternalService,
    @Inject('GRPC_AUTH_TOKEN') private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authGrpcService =
      this.client.getService<AuthServiceClient>('AuthService');
  }

  async authenticate(token: string): Promise<AuthResponse> {
    try {
      const metadata = this.authInternalService.getAuthMetadata();

      const response = await firstValueFrom(
        this.authGrpcService.Authenticate({ token }, metadata),
      );

      return response;
    } catch (error) {
      throw new Error(`gRPC call failed: ${error.message}`);
    }
  }
}
