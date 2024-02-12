import { GetSessionData } from '@decorators/get.session.data';
import { ECookieNames } from '@enums/cookie';
import { EModuleNames } from '@enums/modules';
import { EApiResponseTypes } from '@exception/enums';
import { RejectException } from '@exception/reject.exception';
import { ResponseAdapter } from '@exception/response.adapter';
import { SessionGuard } from '@guards/session.guard';
import { Event } from '@models/event';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiDefaultResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { ISessionData } from '../../session/types/api';
import { CreateEventDto } from './dto/create.event.dto';
import {
  CreateEventDataDto,
  CreateEventResponseDto,
} from './dto/create.event.response.dto';
import { DeleteEventResponseDto } from './dto/delete.event.response.dto';
import { EventInfoResponseDto } from './dto/event.info.response.dto';
import { GetEventsQueryDto } from './dto/get.events.query.dto';
import { GetGroupedEventsResponseDto } from './dto/get.events.response.dto';
import { ShortEventDto } from './dto/short.event.dto';
import { EEventApiMessages } from './enums/api';
import { EventService } from './event.service';

@Controller()
@UseGuards(SessionGuard)
@ApiTags(EModuleNames.EVENTS)
@ApiDefaultResponse({ type: ResponseAdapter })
@ApiUnauthorizedResponse({ type: ResponseAdapter })
@ApiCookieAuth(ECookieNames.ACCESS_TOKEN)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Получение списка событий по фильтрам',
  })
  @UsePipes(new ValidationPipe())
  @ApiOkResponse({ type: GetGroupedEventsResponseDto })
  async getEvents(
    @Query() dto: GetEventsQueryDto,
    @GetSessionData() session: ISessionData,
  ): Promise<GetGroupedEventsResponseDto> {
    const result: ShortEventDto[] | RejectException =
      await this.eventService.getEvents(dto, session);

    console.log('Найденные события: ', result);

    if (result instanceof RejectException) {
      throw result;
    }

    return new GetGroupedEventsResponseDto(result, session.user.timezone);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создание события' })
  @UsePipes(new ValidationPipe())
  @ApiCreatedResponse({ type: EventInfoResponseDto })
  async createEvent(
    @GetSessionData() session: ISessionData,
    @Body() dto: CreateEventDto,
  ): Promise<CreateEventResponseDto> {
    const result: CreateEventDataDto = await this.eventService.createEvent(
      dto,
      session,
    );

    return new ResponseAdapter(result, {
      message: EEventApiMessages.EVENT_SUCCESS_CREATED,
      type: EApiResponseTypes.SUCCESS,
    });
  }

  @Delete(':eventId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Удаление события' })
  async removeEvent(
    @Param('eventId') eventId: string,
    @GetSessionData() session: ISessionData,
  ): Promise<DeleteEventResponseDto> {
    const result = await this.eventService.removeEvent(
      new Types.ObjectId(eventId),
      session.user._id,
    );

    if (result instanceof RejectException) {
      throw result;
    }

    // TODO тут бы дропать какое-то событие чтобы другие модули услышали что надо почистить данные.

    return new ResponseAdapter(result, {
      message: EEventApiMessages.SUCCESS_REMOVED,
      type: EApiResponseTypes.SUCCESS,
    });
  }

  @Get(':eventId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получение подробной информации о событии' })
  @ApiOkResponse({ type: EventInfoResponseDto })
  async getEvent(
    @Param('eventId') eventId: string,
    @GetSessionData() session: ISessionData,
  ): Promise<EventInfoResponseDto> {
    const result: Event | RejectException = await this.eventService.getEvent(
      new Types.ObjectId(eventId),
      session.user._id,
    );

    if (result instanceof RejectException) {
      throw result;
    }

    return new ResponseAdapter(result);
  }

  @Patch(':eventId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Редактирование события', deprecated: true })
  async patchEvent() {}
}
