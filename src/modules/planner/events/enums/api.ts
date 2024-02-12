export enum EEventApiMessages {
  EVENT_SUCCESS_CREATED = 'Событие успешно создано',
  NOT_FOUND = 'Событие не найдено',
  FORBIDDEN = 'У вас нет прав доступа на это действие.',
  CANT_REMOVE = 'Не удалось удалить событие, возможно оно принадлежит не вам или событие не найдено.',
  SUCCESS_REMOVED = 'Событие и связанные с ним данные успешно обновлены',
  CANT_FIND_ACTIVE_GROUPS = 'Не удалось получить список активных групп событий, т.к. база данных не отвечает.',
}

export enum EEventApiErrorCodes {
  CANT_FIND_ACTIVE_GROUPS = 'CANT_FIND_ACTIVE_GROUPS',
  CANT_REMOVE = 'CANT_REMOVE',
  NOT_FOUND = 'NOT_FOUND',
}
