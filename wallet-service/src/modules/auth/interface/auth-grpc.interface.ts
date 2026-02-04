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
  Authenticate(data: { token: string }): Observable<AuthResponse>;
}
