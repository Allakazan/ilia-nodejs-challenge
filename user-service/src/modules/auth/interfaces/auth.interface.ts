import { User } from 'src/entities/user.entity';

export type AuthPayload = { email: string; sub: string };

export type AuthUser = Pick<User, 'id' | 'first_name' | 'email'> & {
  payload?: AuthPayload;
};
