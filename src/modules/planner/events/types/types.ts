import { Event } from '@models/event';
import { Group } from '@models/group';

export type TShortEvent = Pick<
  Event,
  '_id' | 'title' | 'priority' | 'status' | 'date' | 'dateEnd'
> &
  TEventPopulatedFields;

export type TEventPopulatedGroupItem = Pick<Group, '_id' | 'title' | 'color'>;

export type TEventPopulatedFields = {
  group: TEventPopulatedGroupItem;
};

export type IEventIdsListByDateGroup = {
  [key in string]?: string[];
};

export type TEventsByIdGroup = {
  [key in string]?: TShortEvent;
};

export type TGetGroupedEvents = {
  original: TEventsByIdGroup;
  eventsByDate: IEventIdsListByDateGroup;
};

export type TPopulatedEvent = Omit<Event, 'group'> & TEventPopulatedFields;
