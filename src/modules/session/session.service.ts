import { DB_MODEL_NAMES } from '@enums/db';
import { EModuleNames } from '@enums/modules';
import { EApiResponseTypes } from '@exception/enums';
import { RejectException } from '@exception/reject.exception';
import { GroupsGlobalService } from '@global-modules/group/groups.global.service';
import { SessionTokenService } from '@global-modules/session/session.token.service';
import { TUserDocument, TUserModel, User } from '@models/user';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare, hash } from 'bcryptjs';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { ProjectionType, QueryOptions, Types } from 'mongoose';
import { HASH_PASSWORD_SALT_VALUE, SESSION_API_MESSAGES } from './constants';
import { AuthorizationDto, RegistrationDto } from './dto';
import { UpdateTimezoneDto } from './dto/update.timezone.dto';
import { UserApiDto } from './dto/user.api';
import { ESessionErrorCodes } from './enums';
import { ISessionData } from './types/api';
import { standardizePhoneNumber } from './utils';

@Injectable()
export class SessionService {
  constructor(
    private readonly tokenService: SessionTokenService,
    private readonly groupsGlobalService: GroupsGlobalService,
    @InjectModel(DB_MODEL_NAMES.USER) private readonly userModel: TUserModel,
  ) {}

  async updateUserTimezone(
    dto: UpdateTimezoneDto,
    userId: Types.ObjectId,
  ): Promise<RejectException | User> {
    const user: TUserDocument | null = await this.userModel.findById(userId);

    if (!user) {
      return new RejectException(null, {
        errorCode: ESessionErrorCodes.USER_NOT_FOUND,
        message: SESSION_API_MESSAGES.USER_NOT_FOUND,
        descriptions: [],
        statusCode: HttpStatus.NOT_FOUND,
        type: EApiResponseTypes.ERROR,
        serviceName: EModuleNames.SESSION,
      });
    }

    user.timezone = dto.timezone;

    return user.save({ validateBeforeSave: true, validateModifiedOnly: true });
  }

  async registration(dto: RegistrationDto): Promise<RejectException> {
    const candidate = await this.getUserByPhone(dto.phone, {}, { lean: true });

    if (candidate) {
      return new RejectException(null, {
        message: SESSION_API_MESSAGES.USER_ALREADY_EXISTS,
        serviceName: EModuleNames.SESSION,
        errorCode: ESessionErrorCodes.USER_ALREADY_EXISTS,
        type: EApiResponseTypes.ERROR,
        descriptions: [],
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const user = await this.createUser(dto);
    await this.groupsGlobalService.createBaseGroupsList(user._id);
  }

  async authorization(
    dto: AuthorizationDto,
    req: Request,
    res: Response,
  ): Promise<RejectException | null> {
    const prevToken = this.tokenService.getTokenFromRequest(req);

    if (prevToken) {
      await this.tokenService.resolveSession(req, res);
    }

    const userData: TUserDocument | null = await this.getUserByPhone(
      standardizePhoneNumber(dto.phone),
      {},
      { lean: true },
    );

    if (!userData) {
      return new RejectException(null, {
        statusCode: HttpStatus.NOT_FOUND,
        errorCode: ESessionErrorCodes.USER_NOT_FOUND,
        serviceName: EModuleNames.SESSION,
        type: EApiResponseTypes.ERROR,
        message: SESSION_API_MESSAGES.USER_NOT_FOUND,
        descriptions: [],
      });
    }

    console.log('user: ', userData);

    const isValidPassword = await this.comparePasswords(
      dto.password,
      userData.password,
    );

    if (isValidPassword instanceof RejectException) {
      return isValidPassword;
    }

    const result = await this.tokenService.createSession(userData, res);

    if (result instanceof RejectException) {
      return result;
    }

    return null;
  }

  async logout(token: string, res: Response): Promise<RejectException | void> {
    return this.tokenService.removeSession(token, res);
  }

  async getSessionData(token: string): Promise<ISessionData | RejectException> {
    const { userId, sessionUUID } = this.tokenService.decodeJwtToken(token);
    const data = await this.tokenService.getSessionFromRedis(
      this.tokenService.getRedisKey(userId, sessionUUID),
    );

    if (!data) {
      return new RejectException(null, {
        descriptions: [],
        message: SESSION_API_MESSAGES.SESSION_NOT_FOUND,
        errorCode: ESessionErrorCodes.SESSION_NOT_FOUND,
        statusCode: HttpStatus.UNAUTHORIZED,
        type: EApiResponseTypes.ERROR,
        serviceName: EModuleNames.SESSION,
      });
    }

    const user: UserApiDto = await this.getUserByIdWithoutPassword(userId);

    return {
      user,
      expireSessionDate: dayjs(data.expireSessionDate).utc().toDate(),
      sessionUUID,
    };
  }

  async getUserByIdWithoutPassword(
    _id: Types.ObjectId | string,
  ): Promise<UserApiDto> {
    return this.userModel.findById(
      new Types.ObjectId(_id),
      { password: 0 },
      { lean: true },
    );
  }

  async getUserByPhone(
    phone: string,
    projection: ProjectionType<TUserModel> = {},
    options: QueryOptions<TUserModel> = {},
  ): Promise<TUserDocument> {
    return this.userModel.findOne({ phone }, projection, options);
  }

  async createUser(dto: RegistrationDto): Promise<TUserDocument> {
    const passwordHash = await hash(dto.password, HASH_PASSWORD_SALT_VALUE);

    const user = new this.userModel({
      phone: standardizePhoneNumber(dto.phone),
      name: dto.name,
      surname: dto.surname,
      password: passwordHash,
      timezone: dto.timezone,
    });

    return user.save({ validateBeforeSave: true });
  }

  private async comparePasswords(
    password: string,
    passwordHash: string,
  ): Promise<boolean | RejectException> {
    const isValidPassword = await compare(password, passwordHash);

    if (!isValidPassword) {
      return new RejectException(null, {
        message: SESSION_API_MESSAGES.PASSWORD_IS_INVALID,
        serviceName: EModuleNames.SESSION,
        errorCode: ESessionErrorCodes.PASSWORD_IS_INVALID,
        type: EApiResponseTypes.ERROR,
        descriptions: [],
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    return isValidPassword;
  }
}
