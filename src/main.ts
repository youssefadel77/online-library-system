import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { appConstants } from "./constants";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Settle API')
    .setDescription('Online Library System API description')
    .setVersion('1.0')
    .addSecurity('Bearer Token', {
      in: 'header',
      name: 'Authorization',
      type: 'apiKey',
    } as SecuritySchemeObject)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(appConstants.port);
}

bootstrap();
