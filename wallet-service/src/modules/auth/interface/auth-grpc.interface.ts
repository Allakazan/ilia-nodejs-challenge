import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthResponse {
  isValid: boolean;
  user: AuthUser;
}

export interface AuthServiceClient {
  Authenticate(
    data: { token: string },
    metadata: Metadata,
  ): Observable<AuthResponse>;
}
