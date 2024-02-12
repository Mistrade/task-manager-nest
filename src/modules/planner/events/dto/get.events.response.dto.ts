import { DATE_FORMAT } from '@constants/dates';
import { EEventPriorities, EEventStatuses } from '@enums/event';
import { ResponseAdapter } from '@exception/response.adapter';
import { ResponseInfoAdapter } from '@exception/response.info.adapter';
import { TResponseInfoAdapterProps } from '@exception/types';
import { ApiProperty } from '@nestjs/swagger';
import dayjs from 'dayjs';
import { Types } from 'mongoose';
import {
  IEventIdsListByDateGroup,
  TEventsByIdGroup,
  TGetGroupedEvents,
} from '../types';
import { ShortEventDto } from './short.event.dto';

const exampleEventId = new Types.ObjectId();

const EventsByDateExample: IEventIdsListByDateGroup = {
  '30.01.2024': [exampleEventId.toString()],
};

const EventsByIdExample: TEventsByIdGroup = {
  [exampleEventId.toString()]: {
    _id: exampleEventId,
    title: 'Купить хлеб',
    group: {
      _id: new Types.ObjectId(),
      title: 'Домашние дела',
      color: 'rgb(255,255,255)',
    },
    dateEnd: new Date(),
    date: new Date(),
    status: EEventStatuses.PLANNING,
    priority: EEventPriorities.VERY_HIGH,
  },
};

export class GetGroupedEventsDto implements TGetGroupedEvents {
  @ApiProperty({ example: EventsByDateExample })
  eventsByDate: IEventIdsListByDateGroup;
  @ApiProperty({ example: EventsByIdExample })
  original: TEventsByIdGroup;

  constructor(arr: ShortEventDto[], timezone: number) {
    this.eventsByDate = {};
    this.original = {};

    arr.forEach((event) => {
      const eventId = event._id.toString();
      this.original[eventId] = event;

      let statusesObject = this.eventsByDate;

      const date = dayjs(event.date).utc(false).utcOffset(timezone, false);
      const dateEnd = dayjs(event.dateEnd)
        .utc(false)
        .utcOffset(timezone, false);

      console.log(dateEnd);

      const dateDiff = dateEnd.diff(date, 'days');

      if (dateDiff === 0 && date.isSame(dateEnd, 'day')) {
        const dateAsString = date.format(DATE_FORMAT);

        if (statusesObject[dateAsString]) {
          statusesObject[dateAsString].push(eventId);
        } else {
          statusesObject[dateAsString] = [eventId];
        }

        return;
      }

      let count = dateDiff || 1;
      let iterationDate = date;

      for (let i = 0; i <= count; i++) {
        const dateAsString = iterationDate.format(DATE_FORMAT);

        if (statusesObject[dateAsString]) {
          statusesObject[dateAsString].push(eventId);
        } else {
          statusesObject[dateAsString] = [eventId];
        }

        iterationDate = iterationDate.add(1, 'day');
      }

      return;
    });
  }
}

export class GetGroupedEventsResponseDto
  implements ResponseAdapter<GetGroupedEventsDto>
{
  @ApiProperty({ type: GetGroupedEventsDto })
  data: GetGroupedEventsDto;

  @ApiProperty({ type: ResponseInfoAdapter })
  info: ResponseInfoAdapter;

  constructor(
    arr: ShortEventDto[],
    timezone: number,
    infoObject?: TResponseInfoAdapterProps,
  ) {
    const { data, info } = new ResponseAdapter(
      new GetGroupedEventsDto(arr, timezone),
      infoObject,
    );

    console.log('result data: ', data);

    this.data = data;
    this.info = info;
  }
}
