export const USER_NAME_MAX_LENGTH = 255;
export const USER_NAME_MIN_LENGTH = 2;
export const USER_SURNAME_MAX_LENGTH = 255;
export const USER_SURNAME_MIN_LENGTH = 2;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 64;
export const PASSWORD_SYMBOLS_MIN_LENGTH = 1;
export const PASSWORD_NUMBERS_MIN_LENGTH = 1;
export const PASSWORD_UPPERCASE_MIN_LENGTH = 1;
export const PASSWORD_LOWERCASE_MIN_LENGTH = 1;

export const TIMEZONE_MIN = -12 * 60;
export const TIMEZONE_MAX = 14 * 60;

export const SESSION_VALIDATE_MESSAGES = {
  NAME_SHOULD_BE_STRING: `\"Имя\" должно быть строкой.`,
  NAME_MAX_LENGTH: `Максимальная длина имени - ${USER_NAME_MAX_LENGTH} символа.`,
  NAME_MIN_LENGTH: `Минимальная длина имени - ${USER_NAME_MIN_LENGTH} символа.`,

  SURNAME_SHOULD_BE_STRING: `\"Фамилия\" должно быть строкой.`,
  SURNAME_MAX_LENGTH: `Максимальная длина фамилии - ${USER_SURNAME_MAX_LENGTH} символа.`,
  SURNAME_MIN_LENGTH: `Минимальная длина фамилии - ${USER_SURNAME_MIN_LENGTH} символа.`,

  PHONE_NUMBER_SHOULD_BE_STRING: `Номер телефона должен быть строковым значением.`,
  PHONE_NUMBER_IS_INVALID: `Указан невалидный номер телефона.`,

  PASSWORD_SHOULD_BE_STRING: `Пароль должен быть строковым значением.`,
  PASSWORD_MIN_LENGTH: `Пароль должен быть не менее ${PASSWORD_MIN_LENGTH} символов.`,
  PASSWORD_MIN_SYMBOLS: `Пароль должен содержать не менее ${PASSWORD_SYMBOLS_MIN_LENGTH} спец. символа.`,
  PASSWORD_MIN_NUMBERS: `Пароль должен содержать не менее ${PASSWORD_NUMBERS_MIN_LENGTH} цифры.`,
  PASSWORD_MIN_UPPERCASE: `Пароль должен содержать не менее ${PASSWORD_UPPERCASE_MIN_LENGTH} заглавной буквы.`,
  PASSWORD_MIN_LOWERCASE: `Пароль должен содержать не менее ${PASSWORD_LOWERCASE_MIN_LENGTH} строчной буквы.`,
  PASSWORD_MAX_LENGTH: `Пароль должен быть не более ${PASSWORD_MAX_LENGTH} символов.`,
  PASSWORD_IS_EASY: `Пароль слишком легкий.
  Он должен содержать: минимум ${PASSWORD_NUMBERS_MIN_LENGTH} цифру,
  ${PASSWORD_LOWERCASE_MIN_LENGTH} строчную букву,
  ${PASSWORD_UPPERCASE_MIN_LENGTH} заглавную букву,
  ${PASSWORD_SYMBOLS_MIN_LENGTH} спец.символ,
   быть не менее ${PASSWORD_MIN_LENGTH} символов
   и не более ${PASSWORD_MAX_LENGTH} символов в длину.`,
  PASSWORD_SHOULD_BE_NOT_EMPTY: `Пароль обязателен для заполнения.`,
  PASSWORD_IS_NOT_EQUAL: `Пароли не совпадают.`,
};
