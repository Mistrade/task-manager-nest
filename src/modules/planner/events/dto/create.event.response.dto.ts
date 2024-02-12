import { EEventPriorities, EEventStatuses } from '@enums/event';
import { ResponseAdapter } from '@exception/response.adapter';
import { ResponseInfoAdapter } from '@exception/response.info.adapter';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { TPopulatedEvent } from '../types';
import { EventPopulatedGroup } from './event.populated.group.item.dto';

export class CreateEventDataDto implements TPopulatedEvent {
  _id: Types.ObjectId;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  date: Date;
  dateEnd: Date;
  description?: string;
  owner: Types.ObjectId;
  parentId: Types.ObjectId | null;
  status: EEventStatuses;
  priority: EEventPriorities;
  group: EventPopulatedGroup;
}

export class CreateEventResponseDto
  implements ResponseAdapter<CreateEventDataDto>
{
  @ApiProperty({ type: CreateEventDataDto })
  data: CreateEventDataDto;

  @ApiProperty({ type: ResponseInfoAdapter })
  info: ResponseInfoAdapter;
}
