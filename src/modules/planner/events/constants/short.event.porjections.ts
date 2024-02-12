import { TShortEvent } from '../types';

export const SHORT_EVENT_PROJECTIONS: Record<keyof TShortEvent, number> = {
  _id: 1,
  title: 1,
  date: 1,
  dateEnd: 1,
  status: 1,
  priority: 1,
  group: 1,
};
