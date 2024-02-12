export const SESSION_TTL = 30 * 24 * 60 * 60;

export const SESSION_API_MESSAGES = {
  USER_ALREADY_EXISTS: 'Пользователь с такими учетными данными уже существует',
  USER_SUCCESSFULLY_CREATED: 'Пользователь успешно создан',
  USER_SUCCESSFULLY_AUTHORIZE: 'Пользователь успешно авторизован',
  USER_NOT_FOUND: 'Пользователь с такими учетными данными не найден',
  PASSWORD_IS_INVALID: 'Неверный пароль',
  CANT_CREATE_SESSION:
    'Не удалось авторизовать пользователя, попробуйте снова позже',
  REDIS_UNAVAILABLE_OR_REDIS_CANT_SET: `Сессионное хранилище недоступно или вернуло ошибку при попытке обновления данных.`,
  TOKEN_NOT_FOUND: 'Токен сессии отсутствует у пользователя',
  SESSION_NOT_FOUND: 'Сессия не найдена',
  CANT_REMOVE_SESSION: 'Не удалось удалить сессию',
  TIMEZONE_SUCCESS_UPDATE: 'Часовой пояс успешно обновлен.',
};
