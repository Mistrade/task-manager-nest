import { Transform } from 'class-transformer';
import {
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  PASSWORD_LOWERCASE_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_NUMBERS_MIN_LENGTH,
  PASSWORD_SYMBOLS_MIN_LENGTH,
  PASSWORD_UPPERCASE_MIN_LENGTH,
  SESSION_VALIDATE_MESSAGES,
} from '../constants';
import { standardizePhoneNumber } from '../utils';

export class AuthorizationDto {
  @IsString({
    message: SESSION_VALIDATE_MESSAGES.PHONE_NUMBER_SHOULD_BE_STRING,
  })
  @IsMobilePhone(
    'ru-RU',
    { strictMode: false },
    { message: SESSION_VALIDATE_MESSAGES.PHONE_NUMBER_IS_INVALID },
  )
  @Transform((props) => standardizePhoneNumber(props.value))
  phone: string;

  @IsNotEmpty({
    message: SESSION_VALIDATE_MESSAGES.PASSWORD_SHOULD_BE_NOT_EMPTY,
  })
  @IsString({ message: SESSION_VALIDATE_MESSAGES.PASSWORD_SHOULD_BE_STRING })
  @MaxLength(PASSWORD_MAX_LENGTH, {
    message: SESSION_VALIDATE_MESSAGES.PASSWORD_MAX_LENGTH,
  })
  @MinLength(PASSWORD_MIN_LENGTH, {
    message: SESSION_VALIDATE_MESSAGES.PASSWORD_MIN_LENGTH,
  })
  @IsStrongPassword(
    {
      minUppercase: PASSWORD_UPPERCASE_MIN_LENGTH,
      minLowercase: PASSWORD_LOWERCASE_MIN_LENGTH,
      minSymbols: PASSWORD_SYMBOLS_MIN_LENGTH,
      minLength: PASSWORD_MIN_LENGTH,
      minNumbers: PASSWORD_NUMBERS_MIN_LENGTH,
    },
    { message: SESSION_VALIDATE_MESSAGES.PASSWORD_IS_EASY },
  )
  password: string;
}
