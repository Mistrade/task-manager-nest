import { ECookieNames } from '@enums/cookie';
import { EModuleNames } from '@enums/modules';
import { ERedisNamespaces } from '@enums/redis';
import { EApiResponseTypes } from '@exception/enums';
import { RejectException } from '@exception/reject.exception';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { TUserDocument, User } from '@models/user';
import { SESSION_API_MESSAGES, SESSION_TTL } from '@modules/session/constants';
import { ESessionErrorCodes } from '@modules/session/enums';
import {
  IAuthJwtPayload,
  IRedisSessionData,
  ISessionData,
} from '@modules/session/types/api';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import Redis from 'ioredis';
import { v4 } from 'uuid';

@Injectable()
export class SessionTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRedis(ERedisNamespaces.SESSION) private readonly redis: Redis,
  ) {}

  async createSession(
    user: TUserDocument,
    res: Response,
  ): Promise<RejectException | ISessionData> {
    const jwtPayload = this.buildJwtPayload(user);
    const jwtToken = this.buildJwtToken(jwtPayload);
    const sessionData: ISessionData = this.buildInitialSessionData(
      user,
      jwtPayload,
      SESSION_TTL,
    );

    try {
      await this.setSessionData(sessionData, SESSION_TTL);
      this.setTokenToResponse(jwtToken, res, sessionData.expireSessionDate);

      return sessionData;
    } catch (e) {
      return new RejectException(null, {
        message: SESSION_API_MESSAGES.CANT_CREATE_SESSION,
        errorCode: ESessionErrorCodes.CANT_CREATE_SESSION,
        descriptions: [],
        type: EApiResponseTypes.ERROR,
        serviceName: EModuleNames.SESSION,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async setSessionData(
    sessionData: ISessionData,
    ttl: number,
  ): Promise<ISessionData | RejectException> {
    const redisKey = this.getRedisKey(
      sessionData.user._id.toString(),
      sessionData.sessionUUID,
    );

    const redisSessionData = this.buildRedisSessionData(sessionData);

    try {
      await this.redis.set(
        redisKey,
        JSON.stringify(redisSessionData),
        'EX',
        ttl,
      );

      return sessionData;
    } catch (e) {
      return new RejectException(null, {
        message: SESSION_API_MESSAGES.CANT_CREATE_SESSION,
        errorCode: ESessionErrorCodes.CANT_CREATE_SESSION,
        serviceName: EModuleNames.SESSION,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        type: EApiResponseTypes.ERROR,
        descriptions: [
          SESSION_API_MESSAGES.REDIS_UNAVAILABLE_OR_REDIS_CANT_SET,
        ],
      });
    }
  }

  buildInitialSessionData(
    user: User,
    jwtPayload: IAuthJwtPayload,
    ttl: number,
  ): ISessionData {
    return {
      user,
      sessionUUID: jwtPayload.sessionUUID,
      expireSessionDate: dayjs().utc().add(ttl, 'second').toDate(),
    };
  }

  getTokenFromRequest(req: Request): string | null {
    return req.cookies[ECookieNames.ACCESS_TOKEN] || null;
  }

  async resolveSession(req: Request, res: Response) {
    const prevToken = this.getTokenFromRequest(req);

    if (prevToken) {
      await this.removeSession(prevToken, res);
      this.removeTokenFromCookie(res);
    }
  }

  async removeSession(
    token: string,
    res: Response,
  ): Promise<RejectException | void> {
    if (!token) return;

    const payload: IAuthJwtPayload = this.decodeJwtToken(token);

    if (!('userId' in payload || 'sessionUUId' in payload)) {
      return this.removeTokenFromCookie(res);
    }

    try {
      await this.removeSessionFromRedis(
        this.getRedisKey(payload.userId, payload.sessionUUID),
      );
    } catch (e) {
      return new RejectException(null, {
        type: EApiResponseTypes.ERROR,
        serviceName: EModuleNames.SESSION,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: ESessionErrorCodes.CANT_REMOVE_SESSION,
        message: SESSION_API_MESSAGES.CANT_REMOVE_SESSION,
        descriptions: [],
      });
    }

    this.removeTokenFromCookie(res);
  }

  removeTokenFromCookie(res: Response) {
    res.cookie(ECookieNames.ACCESS_TOKEN, '', {
      maxAge: 0,
      expires: dayjs().utc().toDate(),
    });
  }

  buildJwtToken(payload: IAuthJwtPayload) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_CODE'),
    });
  }

  buildJwtPayload(user: User): IAuthJwtPayload {
    return {
      userId: user._id.toString(),
      sessionUUID: v4(),
    };
  }

  getRedisKey(userId: string, sessionUUID?: string) {
    return `session:${userId}:${sessionUUID || '*'}`;
  }

  buildRedisSessionData(sessionData: ISessionData): IRedisSessionData {
    return {
      sessionUUID: sessionData.sessionUUID,
      expireSessionDate: dayjs(sessionData.expireSessionDate).utc().toString(),
      user: {
        ...sessionData.user,
        _id: sessionData.user._id.toString(),
      },
    };
  }

  private async removeSessionFromRedis(key: string): Promise<number> {
    return this.redis.del(key);
  }

  async getSessionFromRedis(key: string): Promise<IRedisSessionData | null> {
    const data = await this.redis.get(key);

    if (data) {
      return JSON.parse(data) as IRedisSessionData;
    }

    return null;
  }

  private setTokenToResponse(token: string, res: Response, expireDate: Date) {
    res.cookie(ECookieNames.ACCESS_TOKEN, token, {
      expires: expireDate,
    });
  }

  decodeJwtToken(token: string): IAuthJwtPayload {
    const jwtPayload: IAuthJwtPayload = this.jwtService.decode(
      token,
    ) as IAuthJwtPayload;
    return jwtPayload;
  }
}
