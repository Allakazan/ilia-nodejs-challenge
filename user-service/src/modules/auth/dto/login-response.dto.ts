import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'Access token for authentication',
    type: String,
  })
  access_token: string;

  @ApiProperty({
    description: 'Expiration time in seconds',
    type: Number,
  })
  expires_in: number;
}
