import { EEventPriorities, EEventStatuses } from '@enums/event';
import { Group } from '@models/group';
import { Types } from 'mongoose';
import { TShortEvent } from '../types';

export class ShortEventDto implements TShortEvent {
  _id: Types.ObjectId;
  title: string;
  date: Date;
  dateEnd: Date;
  status: EEventStatuses;
  priority: EEventPriorities;
  group: Pick<Group, '_id' | 'title' | 'color'>;
}
