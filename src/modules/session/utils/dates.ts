import dayjs, { Dayjs } from 'dayjs';
import { TDateValue } from '../types/dates';

export const getUtcDayjsDate = (date: TDateValue): Dayjs => {
  if (!date) {
    return dayjs().utc(false);
  }

  return dayjs(date).utc(false);
};
