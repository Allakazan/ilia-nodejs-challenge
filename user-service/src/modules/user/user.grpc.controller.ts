import { Controller, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  ValidateUserRequest,
  ValidateUserResponse,
} from './interfaces/user-grpc.interface';

@Controller()
export class UserGrpcController {
  private logger: Logger = new Logger('UserGrpcController');

  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'ValidateUser')
  async validateUser(data: ValidateUserRequest): Promise<ValidateUserResponse> {
    this.logger.log(`ValidateUser called with data: ${JSON.stringify(data)}`);

    if (!data?.userId) return { isValid: false, message: 'userId is required' };

    const user = await this.userService.findOne({ id: data.userId });

    if (!user) return { isValid: false, message: 'User not found' };

    const { id, email, first_name, active } = user;

    return {
      isValid: true,
      message: 'User is valid',
      user: { id, email, first_name, active },
    };
  }
}
