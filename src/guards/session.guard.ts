import { ERequestContextKeys } from '@enums/context';
import { EModuleNames } from '@enums/modules';
import { ERedisNamespaces } from '@enums/redis';
import { EApiResponseTypes } from '@exception/enums';
import { RejectException } from '@exception/reject.exception';
import { SessionTokenService } from '@global-modules/session/session.token.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { SESSION_API_MESSAGES } from '@modules/session/constants';
import {
  ESessionApiDescription,
  ESessionErrorCodes,
} from '@modules/session/enums';
import { IRedisSessionData, ISessionData } from '@modules/session/types/api';
import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';
import Redis from 'ioredis';
import { Types } from 'mongoose';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    @InjectRedis(ERedisNamespaces.SESSION) private readonly redis: Redis,
    private readonly jwtService: JwtService,
    private readonly sessionTokenService: SessionTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();

    const token = this.sessionTokenService.getTokenFromRequest(req);

    if (!token) {
      throw new RejectException(null, {
        message: SESSION_API_MESSAGES.TOKEN_NOT_FOUND,
        errorCode: ESessionErrorCodes.TOKEN_NOT_FOUND,
        type: EApiResponseTypes.ERROR,
        serviceName: EModuleNames.SESSION,
        statusCode: HttpStatus.UNAUTHORIZED,
        descriptions: [ESessionApiDescription.REPEAT_LOGIN],
      });
    }

    const payload = this.sessionTokenService.decodeJwtToken(token);
    const redisKey = this.sessionTokenService.getRedisKey(
      payload.userId,
      payload.sessionUUID,
    );
    const sessionData: IRedisSessionData =
      await this.sessionTokenService.getSessionFromRedis(redisKey);

    if (!sessionData) {
      this.sessionTokenService.removeTokenFromCookie(res);

      throw new RejectException(null, {
        message: SESSION_API_MESSAGES.SESSION_NOT_FOUND,
        errorCode: ESessionErrorCodes.SESSION_NOT_FOUND,
        type: EApiResponseTypes.ERROR,
        serviceName: EModuleNames.SESSION,
        statusCode: HttpStatus.UNAUTHORIZED,
        descriptions: [ESessionApiDescription.REPEAT_LOGIN],
      });
    }

    const data: ISessionData = {
      ...sessionData,
      user: {
        ...sessionData.user,
        _id: new Types.ObjectId(sessionData.user._id),
        timezone: sessionData.user.timezone ?? 0,
      },
      expireSessionDate: dayjs(sessionData.expireSessionDate).toDate(),
    };

    this.setSessionDataToRequestContext(data, req);
    return true;
  }

  private setSessionDataToRequestContext(
    sessionData: ISessionData,
    req: Request,
  ) {
    req[ERequestContextKeys.SESSION_DATA] = sessionData;
  }
}
