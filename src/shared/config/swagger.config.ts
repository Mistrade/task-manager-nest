import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const buildSwagger = (app: INestApplication) => {
  const swaggerConfig = new DocumentBuilder()
    .setVersion('1.0')
    .setTitle('Task Manager')
    .setDescription('Документация по запросам')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('swagger', app, swaggerDocument, {
    useGlobalPrefix: true,
  });
};