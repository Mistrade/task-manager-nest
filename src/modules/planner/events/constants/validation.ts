import { EEventPriorities, EEventStatuses } from '@enums/event';

export const EVENT_TITLE_MIN_LENGTH = 3;
export const EVENT_TITLE_MAX_LENGTH = 255;

export const EVENT_STATUSES_LIST = Object.values(EEventStatuses);
export const EVENT_PRIORITY_LIST = Object.values(EEventPriorities);

export const EVENT_DTO_VALIDATION_MESSAGES = {
  TITLE_MIN_LENGTH: `Название события должно быть не менее ${EVENT_TITLE_MIN_LENGTH} символов.`,
  TITLE_MAX_LENGTH: `Название события должно быть не более ${EVENT_TITLE_MAX_LENGTH} символов.`,
  TITLE_SHOULD_BE_STRING: 'Название события должно быть строкой.',
  TITLE_IS_REQUIRED: 'Название события обязательно.',

  DESCRIPTION_SHOULD_BE_STRING: 'Описание должно быть строкой.',

  LINK_SHOULD_BE_STRING: 'Ссылка должна быть строкой.',

  PRIORITY_SHOULD_BE_STRING: `Приоритет должен быть строкой.`,
  PRIORITY_SHOULD_BE_ENUM: `Доступные значения приоритета: ${EVENT_PRIORITY_LIST.join(
    ', ',
  )}.`,
  PRIORITY_IS_REQUIRED: 'Приоритет обязателен для заполнения',

  STATUS_SHOULD_BE_STRING: 'Статус события должен быть строкой.',
  STATUS_SHOULD_BE_ENUM: `Доступные значения статуса события: ${EVENT_STATUSES_LIST.join(
    ', ',
  )}`,
  STATUS_IS_REQUIRED: 'Статус события обязателен для заполнения',

  GROUP_ID_SHOULD_BE_MONGO_ID: 'Невалидный идентификатор группы событий.',
  GROUP_IS_REQUIRED: 'Группа событий обязательна для создания события.',

  INVALID_DATE: 'Невалидное значение даты начала события.',
  DATE_IS_REQUIRED: 'Дата начала события обязательна для заполнения.',

  INVALID_DATE_END: 'Невалидное значение даты завершения события.',
  DATE_END_IS_REQUIRED: 'Дата завершения события обязательна для заполнения',

  PARENT_ID_SHOULD_BE_MONGO_ID:
    'Указана невалидная ссылка на родительское событие.',
};
