import { Metadata } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@Injectable()
export class AuthInternalService {
  constructor(private readonly jwtService: JwtService) {}

  getAuthMetadata(): Metadata {
    const metadata = new Metadata();
    metadata.add('authorization', this.jwtService.sign({ service: 'wallet' }));

    return metadata;
  }
}
