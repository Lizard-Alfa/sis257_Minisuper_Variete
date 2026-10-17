import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { transform } from 'typescript';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('API Rest - minitienda')
    .setDescription('API Rest para la minitienda')
    .setVersion('1.0')
    .addTag('proveedores')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
  console.log(`app corriendo en ${await app.getUrl()}`);
}
void bootstrap();
