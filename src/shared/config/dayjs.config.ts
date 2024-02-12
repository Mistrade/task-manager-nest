import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';

export const setupDayjsPlugins = () => {
  dayjs.extend(utc);
  dayjs.extend(updateLocale);
  dayjs.updateLocale('en', {
    weekStart: 1,
    yearStart: 4,
  });
  dayjs.extend(timezone);
  dayjs.extend(duration);
};
