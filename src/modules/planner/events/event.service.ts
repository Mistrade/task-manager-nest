import { DB_MODEL_NAMES } from '@enums/db';
import { EModuleNames } from '@enums/modules';
import { EApiResponseTypes } from '@exception/enums';
import { RejectException } from '@exception/reject.exception';
import { GroupsGlobalService } from '@global-modules/group/groups.global.service';
import { Event, TEventDocument, TEventModel } from '@models/event';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { FilterQuery, Types } from 'mongoose';
import { ISessionData } from '../../session/types/api';
import { getUtcDayjsDate } from '../../session/utils/dates';
import { POPULATE_EVENT_GROUP_PIPELINE } from './constants/populate.group.pipeline';
import { SHORT_EVENT_PROJECTIONS } from './constants/short.event.porjections';
import { CreateEventDto } from './dto/create.event.dto';
import { CreateEventDataDto } from './dto/create.event.response.dto';
import { GetEventsQueryDto } from './dto/get.events.query.dto';
import { ShortEventDto } from './dto/short.event.dto';
import { EEventApiErrorCodes, EEventApiMessages } from './enums/api';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(DB_MODEL_NAMES.EVENT) private readonly eventModel: TEventModel,
    private readonly globalGroupService: GroupsGlobalService,
  ) {}

  private async buildGetEventsFilter(
    dto: GetEventsQueryDto,
    user: Types.ObjectId,
  ): Promise<FilterQuery<TEventDocument> | RejectException> {
    const { toDate, fromDate } = dto;

    const fromDateUtc = getUtcDayjsDate(fromDate).toDate();
    const toDateUtc = getUtcDayjsDate(toDate).toDate();

    return {
      owner: user,
      $or: [
        {
          //Кейс когда событие начинается и завершается между startDate и endDate
          date: {
            $gte: fromDateUtc,
            $lte: toDateUtc,
          },
          dateEnd: {
            $gte: fromDateUtc,
            $lte: toDateUtc,
          },
        },
        {
          //Кейс когда событие начинается раньше startDate и заканчивается позже endDate
          date: {
            $lte: fromDateUtc,
          },
          dateEnd: {
            $gte: toDateUtc,
          },
        },
        {
          //Кейс когда событие начинается раньше startDate, а заканчивается между startDate и andDate
          date: {
            $lte: fromDateUtc,
          },
          dateEnd: {
            $gte: fromDateUtc,
            $lte: toDateUtc,
          },
        },
        {
          //Кейс когда событие начинается между startDate и endDate, а заканчивается позже endDate
          date: {
            $gte: fromDateUtc,
            $lte: toDateUtc,
          },
          dateEnd: {
            $gte: toDateUtc,
          },
        },
      ],
    };
  }

  async getEvents(
    dto: GetEventsQueryDto,
    session: ISessionData,
  ): Promise<ShortEventDto[] | RejectException> {
    const filters = await this.buildGetEventsFilter(dto, session.user._id);

    console.log('Фильтры для поиска событий: ', filters);

    if (filters instanceof RejectException) {
      return filters;
    }

    return this.eventModel
      .find(filters, SHORT_EVENT_PROJECTIONS, { lean: true, sort: { date: 1 } })
      .populate(POPULATE_EVENT_GROUP_PIPELINE);
  }

  async createEvent(
    dto: CreateEventDto,
    session: ISessionData,
  ): Promise<CreateEventDataDto> {
    const {
      title,
      description,
      link,
      priority,
      status,
      group,
      date,
      dateEnd,
      parentId: dtoParentId,
    } = dto;

    const parentId = dtoParentId ? new Types.ObjectId(dtoParentId) : null;

    const event = new this.eventModel({
      owner: new Types.ObjectId(session.user._id),
      title,
      description,
      link,
      priority,
      status,
      group: new Types.ObjectId(group),
      date: dayjs(date).utc(false).toDate(),
      dateEnd: dayjs(dateEnd).utc(false).toDate(),
      parentId,
    });

    await event.save({ validateBeforeSave: true });

    return event.populate(POPULATE_EVENT_GROUP_PIPELINE);
  }

  async removeEvent(
    eventId: Types.ObjectId,
    owner: Types.ObjectId,
  ): Promise<RejectException | Types.ObjectId> {
    const deleteResult = await this.eventModel.deleteOne({
      _id: eventId,
      owner,
    });

    if (!deleteResult.deletedCount) {
      return new RejectException(null, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: EEventApiErrorCodes.CANT_REMOVE,
        message: EEventApiMessages.CANT_REMOVE,
        type: EApiResponseTypes.ERROR,
        serviceName: EModuleNames.EVENTS,
        descriptions: [],
      });
    }

    return eventId;
  }

  async getEvent(
    eventId: Types.ObjectId,
    owner: Types.ObjectId,
  ): Promise<Event | RejectException> {
    const event: Event | null = await this.eventModel.findOne(
      {
        _id: eventId,
        owner,
      },
      {},
      { lean: true },
    );

    if (!event) {
      return new RejectException(null, {
        message: EEventApiMessages.NOT_FOUND,
        errorCode: EEventApiErrorCodes.NOT_FOUND,
        type: EApiResponseTypes.WARNING,
        statusCode: HttpStatus.NOT_FOUND,
        serviceName: EModuleNames.EVENTS,
        descriptions: ['Возможно, запрашиваемое событие вам не принадлежит.'],
      });
    }

    return event;
  }
}
