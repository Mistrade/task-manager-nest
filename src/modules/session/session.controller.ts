import { GetSessionData } from '@decorators/get.session.data';
import { Cookies } from '@decorators/session';
import { ECookieNames } from '@enums/cookie';
import { EModuleNames } from '@enums/modules';
import { EApiResponseTypes } from '@exception/enums';
import { RejectException } from '@exception/reject.exception';
import { ResponseAdapter } from '@exception/response.adapter';
import { SessionGuard } from '@guards/session.guard';
import { TUserDocument } from '@models/user';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiDefaultResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { SESSION_API_MESSAGES } from './constants';
import { AuthorizationDto, RegistrationDto } from './dto';
import { SessionDto } from './dto/session';
import { SessionDataDto } from './dto/session.data';
import { UpdateTimezoneDto } from './dto/update.timezone.dto';
import { UpdateTimezoneResponseDto } from './dto/update.timezone.response.dto';
import { UserApiDto } from './dto/user.api';
import { ESessionErrorCodes } from './enums';
import { SessionService } from './session.service';
import { ISessionData } from './types/api';

@Controller()
@ApiTags(EModuleNames.SESSION)
@ApiUnauthorizedResponse({ type: ResponseAdapter })
@ApiDefaultResponse({ type: ResponseAdapter })
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  @ApiOperation({ summary: 'Запрос на получение сессионных данных' })
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth(ECookieNames.ACCESS_TOKEN)
  @ApiOkResponse({ type: SessionDto })
  async getCurrentSession(@Cookies(ECookieNames.ACCESS_TOKEN) token: string) {
    if (!token) {
      throw new RejectException(null, {
        message: SESSION_API_MESSAGES.TOKEN_NOT_FOUND,
        errorCode: ESessionErrorCodes.TOKEN_NOT_FOUND,
        type: EApiResponseTypes.ERROR,
        serviceName: EModuleNames.SESSION,
        statusCode: HttpStatus.UNAUTHORIZED,
        descriptions: [],
      });
    }

    const result = await this.sessionService.getSessionData(token);

    if (result instanceof RejectException) {
      throw result;
    }

    return new ResponseAdapter(new SessionDataDto(result));
  }

  @Put('timezone')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionGuard)
  @UsePipes(new ValidationPipe())
  @ApiCookieAuth(ECookieNames.ACCESS_TOKEN)
  @ApiOperation({ summary: 'Смена часового пояса пользователя' })
  async putTimezone(
    @Body() dto: UpdateTimezoneDto,
    @GetSessionData() session: ISessionData,
  ): Promise<UpdateTimezoneResponseDto> {
    const result = await this.sessionService.updateUserTimezone(
      dto,
      session.user._id,
    );

    if (result instanceof RejectException) throw result;

    return new ResponseAdapter(new UserApiDto(result), {
      message: SESSION_API_MESSAGES.TIMEZONE_SUCCESS_UPDATE,
      type: EApiResponseTypes.SUCCESS,
    });
  }

  @Post('reg')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: 'Запрос на регистрацию нового пользователя' })
  @ApiBody({ type: RegistrationDto })
  @ApiCreatedResponse({ type: ResponseAdapter })
  async registration(@Body() dto: RegistrationDto): Promise<ResponseAdapter> {
    const result: TUserDocument | RejectException =
      await this.sessionService.registration(dto);

    if (result instanceof RejectException) {
      throw result;
    }

    return new ResponseAdapter(null, {
      type: EApiResponseTypes.SUCCESS,
      message: SESSION_API_MESSAGES.USER_SUCCESSFULLY_CREATED,
    });
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Запрос на авторизацию пользователя' })
  @ApiOkResponse({
    type: ResponseAdapter,
    description: 'Сессия успешно создана. Пользователь авторизован.',
  })
  async authorization(
    @Body() dto: AuthorizationDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<ResponseAdapter>> {
    const data: null | RejectException =
      await this.sessionService.authorization(dto, req, res);

    if (data instanceof RejectException) {
      throw data;
    }

    return res.status(HttpStatus.OK).json(
      new ResponseAdapter(null, {
        type: EApiResponseTypes.SUCCESS,
        message: SESSION_API_MESSAGES.USER_SUCCESSFULLY_AUTHORIZE,
      }),
    );
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth(ECookieNames.ACCESS_TOKEN)
  @ApiOperation({ summary: 'Запрос на завершение сессии' })
  @UseGuards(SessionGuard)
  async logout(
    @Cookies(ECookieNames.ACCESS_TOKEN) token: string,
    @Res() res: Response,
  ) {
    const result: RejectException | void = await this.sessionService.logout(
      token,
      res,
    );

    if (result instanceof RejectException) {
      throw result;
    }

    return res.status(HttpStatus.OK).json(
      new ResponseAdapter(null, {
        message: 'Сессия успешно завершена',
        statusCode: HttpStatus.OK,
        serviceName: EModuleNames.SESSION,
        type: EApiResponseTypes.SUCCESS,
      }),
    );
  }
}
