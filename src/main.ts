import { MODULE_ROUTES } from '@constants/routes';
import { EModuleNames } from '@enums/modules';
import { AllExceptionFilter } from '@exception/filter.exception';
import { HttpStatus } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { setupDayjsPlugins } from '@shared/config/dayjs.config';
import { buildSwagger } from '@shared/config/swagger.config';
import cookieParser from 'cookie-parser';
import * as process from 'process';
import { AppModule } from './app.module';

async function bootstrap() {
  setupDayjsPlugins();
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(MODULE_ROUTES.GLOBAL_PREFIX.FULL_PATH);
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:8080', 'http://localhost:3000'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: HttpStatus.OK,
  });

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new AllExceptionFilter(httpAdapterHost, EModuleNames.CORE),
  );

  buildSwagger(app);

  await app.listen(Number(process.env.APP_PORT));
}

bootstrap();
