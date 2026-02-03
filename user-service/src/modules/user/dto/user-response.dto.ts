import { OmitType } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';

export class UserResponseDto extends OmitType(User, ['password'] as const) {}
