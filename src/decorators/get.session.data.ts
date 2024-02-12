import { ERequestContextKeys } from '@enums/context';
import { ISessionData } from '@modules/session/types/api';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetSessionData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ISessionData => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request[ERequestContextKeys.SESSION_DATA];
  },
);
