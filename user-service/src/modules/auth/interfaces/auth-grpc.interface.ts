export interface AuthRequest {
  token: string;
}

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthResponse {
  isValid: boolean;
  user: AuthUser;
}
