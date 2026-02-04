import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

export interface ValidateUserResponse {
  isValid: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    first_name: string;
    active: boolean;
  };
}

export interface UserServiceClient {
  ValidateUser(
    data: { userId: string },
    metadata: Metadata,
  ): Observable<ValidateUserResponse>;
}
