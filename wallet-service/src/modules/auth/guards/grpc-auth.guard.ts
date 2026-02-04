import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GrpcAuthGuard extends AuthGuard('grpc-auth') {}
