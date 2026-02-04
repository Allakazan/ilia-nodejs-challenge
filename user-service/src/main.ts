import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configSvc = app.get(ConfigService);

  const port = configSvc.get<number>('port');
  const grpcConfig = configSvc.get<{ host: string; port: number }>('grpc');

  const config = new DocumentBuilder()
    .setTitle('User Service API')
    .setDescription('User Microservice API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.GRPC,
      options: {
        package: ['user', 'auth'],
        protoPath: [
          join(__dirname, '../../proto/user.proto'),
          join(__dirname, '../../proto/auth.proto'),
        ],
        url: `${grpcConfig.host}:${grpcConfig.port}`,
        loader: {
          keepCase: true,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true,
        },
      },
    },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
  await app.listen(port);

  console.log(`HTTP running on http://localhost:${port}`);
  console.log(`gRPC running on ${grpcConfig.host}:${grpcConfig.port}`);
}
bootstrap();
