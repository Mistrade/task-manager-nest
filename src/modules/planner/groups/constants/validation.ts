export const GROUP_TITLE_MIN_LENGTH = 3;
export const GROUP_TITLE_MAX_LENGTH = 255;

export const GROUP_VALIDATION_MESSAGES = {
  GROUP_TITLE_MIN_LENGTH: `Название группы должно быть не менее ${GROUP_TITLE_MIN_LENGTH} символов.`,
  GROUP_TITLE_MAX_LENGTH: `Название группы должно быть не более ${GROUP_TITLE_MAX_LENGTH} символов.`,
  GROUP_TITLE_IS_REQUIRED: `Название группы обязательно.`,
  GROUP_TITLE_SHOULD_BE_STRING: `Название группы должно быть строкой.`,

  GROUP_COLOR_INVALID: `Цвет группы событий должен быть в формате RGB.`,
  GROUP_COLOR_IS_REQUIRED: 'Цвет группы обязателен.',
  GROUP_COLOR_SHOULD_BE_STRING: 'Цвет группы событий должен быть RGB строкой.',

  GROUP_ID_SHOULD_BE_MONGO_ID: `Невалидный идентификатор группы событий.`,
};
