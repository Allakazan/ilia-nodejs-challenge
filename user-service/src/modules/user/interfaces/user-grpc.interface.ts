import { User } from 'src/entities/user.entity';

export interface ValidateUserRequest {
  user_id: string;
}

export interface ValidateUserResponse {
  is_valid: boolean;
  message: string;
  user?: Pick<User, 'id' | 'email' | 'first_name' | 'active'>;
}
