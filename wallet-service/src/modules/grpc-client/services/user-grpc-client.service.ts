import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';

interface ValidateUserResponse {
  is_valid: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    first_name: string;
    active: boolean;
  };
}

interface UserServiceClient {
  ValidateUser(data: { user_id: string }): Observable<ValidateUserResponse>;
}

@Injectable()
export class UserGrpcClientService implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(@Inject('USER_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>('UserService');
  }

  async validateUser(userId: string): Promise<ValidateUserResponse> {
    try {
      const result = await firstValueFrom(
        this.userService.ValidateUser({ user_id: userId }),
      );
      return result;
    } catch (error) {
      throw new Error(`gRPC call failed: ${error.message}`);
    }
  }
}
