import { EModuleNames } from '@enums/modules';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';
import mongoose from 'mongoose';
import {
  EApiResponseTypes,
  EGlobalApiMessages,
  UNKNOWN_ERROR_CODE,
} from './enums';
import { RejectException } from './reject.exception';
import { ResponseAdapter } from './response.adapter';
import { IResponseInfoAdapter } from './types';

interface LogOptions {
  method: string;
  path: string;
  userId: string | undefined;
  info: IResponseInfoAdapter;
  exception: unknown;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly serviceName: EModuleNames,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): any {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest();

    let result: ResponseAdapter<any>;

    if (exception instanceof mongoose.Error) {
      result = this.getMongooseErrorResult(exception);
    } else if (exception instanceof HttpException) {
      result = this.getHttpExceptionResult(exception);
    } else {
      result = this.getDefaultInternalResult(exception);
    }

    console.log(
      this.log({
        method: req.method,
        info: result.info,
        path: req.path,
        userId: req.user?._id?.toString() || '',
        exception,
      }),
      exception,
    );

    if (typeof res.status === 'function') {
      return httpAdapter.reply(res || null, result, result.info.statusCode);
    }
    return result;
  }

  private log({ method, exception, path, userId, info }: LogOptions): string {
    const data = [
      `datetime[${new Date().toISOString()}]`,
      `method[${method?.toUpperCase()}]`,
      `path[${path}]`,
      `userId[${userId || 'undefined'}]`,
      `description: \"${JSON.stringify(info)}\"`,
    ];

    return data.join(', \n');
  }

  private getHttpExceptionResult(
    exception: HttpException,
  ): ResponseAdapter<any> {
    const exceptionResponse = exception.getResponse();
    const status = exception.getStatus();

    if (exception instanceof RejectException) {
      return exceptionResponse as ResponseAdapter;
    } else if (exception instanceof BadRequestException) {
      const responseMessage =
        exception.getResponse()['message'] || exception.message;

      return new ResponseAdapter<any>(null, {
        errorCode: exception.name,
        serviceName: this.serviceName,
        type: EApiResponseTypes.ERROR,
        message: `ServerHttpError (${exception.name}): ${EGlobalApiMessages.SERVER_BAD_REQUEST}`,
        descriptions: Array.isArray(responseMessage)
          ? responseMessage
          : [responseMessage],
        statusCode: status,
      });
    } else {
      return this.getDefaultInternalResult(exception);
    }
  }

  private getDefaultInternalResult(exception: unknown): ResponseAdapter<any> {
    const errorName = exception['name'] || '';
    const text = errorName ? ` (${errorName})` : '';
    return new ResponseAdapter<any>(null, {
      type: EApiResponseTypes.ERROR,
      message: `ServerHttpError${text}: ${EGlobalApiMessages.SERVER_UNKNOWN_ERROR}`,
      errorCode: errorName || UNKNOWN_ERROR_CODE,
      serviceName: this.serviceName,
      descriptions: [],
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }

  private getMongooseErrorResult(
    exception: mongoose.Error,
  ): ResponseAdapter<any> {
    if (exception instanceof mongoose.Error.ValidationError) {
      return new ResponseAdapter<any>(null, {
        type: EApiResponseTypes.ERROR,
        message: `DB.${exception.name}: ${EGlobalApiMessages.MONGO_VALIDATION_ERROR}`,
        errorCode: exception.name,
        serviceName: this.serviceName,
        descriptions: [],
        statusCode: HttpStatus.BAD_REQUEST,
      });
    } else if (exception instanceof mongoose.Error.DocumentNotFoundError) {
      return new ResponseAdapter<any>(null, {
        type: EApiResponseTypes.ERROR,
        message: `DB.${exception.name}: ${EGlobalApiMessages.MONGO_DOCUMENT_NOT_FOUND_ERROR}`,
        errorCode: exception.name,
        serviceName: this.serviceName,
        descriptions: [],
        statusCode: HttpStatus.NOT_FOUND,
      });
    } else if (exception instanceof mongoose.Error.ParallelSaveError) {
      return new ResponseAdapter<any>(null, {
        type: EApiResponseTypes.ERROR,
        message: `DB.${exception.name}: ${EGlobalApiMessages.MONGO_PARALLEL_SAVE_ERROR}`,
        errorCode: exception.name,
        serviceName: this.serviceName,
        descriptions: [],
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    } else if (exception instanceof mongoose.Error.VersionError) {
      return new ResponseAdapter<any>(null, {
        type: EApiResponseTypes.ERROR,
        message: `DB.${exception.name}: ${EGlobalApiMessages.MONGO_VERSION_ERROR}`,
        errorCode: exception.name,
        serviceName: this.serviceName,
        descriptions: [],
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    } else {
      return new ResponseAdapter<any>(null, {
        type: EApiResponseTypes.ERROR,
        message: `DB.${exception.name}: ${EGlobalApiMessages.MONGO_UNKNOWN_ERROR}`,
        errorCode: exception.name,
        serviceName: this.serviceName,
        descriptions: [],
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
