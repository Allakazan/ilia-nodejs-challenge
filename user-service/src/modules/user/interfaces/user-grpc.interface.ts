import { User } from 'src/entities/user.entity';

export interface ValidateUserRequest {
  userId: string;
}

export interface ValidateUserResponse {
  isValid: boolean;
  message: string;
  user?: Pick<User, 'id' | 'email' | 'first_name' | 'active'>;
}
