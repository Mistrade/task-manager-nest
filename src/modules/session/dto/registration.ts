import { MatchEqualTo } from '@decorators/validate';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  SESSION_VALIDATE_MESSAGES,
  USER_NAME_MAX_LENGTH,
  USER_NAME_MIN_LENGTH,
  USER_SURNAME_MAX_LENGTH,
  USER_SURNAME_MIN_LENGTH,
} from '../constants';
import { AuthorizationDto } from './auth';

export class RegistrationDto extends AuthorizationDto {
  @IsString({ message: SESSION_VALIDATE_MESSAGES.NAME_SHOULD_BE_STRING })
  @MaxLength(USER_NAME_MAX_LENGTH, {
    message: SESSION_VALIDATE_MESSAGES.NAME_MAX_LENGTH,
  })
  @MinLength(USER_NAME_MIN_LENGTH, {
    message: SESSION_VALIDATE_MESSAGES.NAME_MIN_LENGTH,
  })
  name: string;

  @IsString({ message: SESSION_VALIDATE_MESSAGES.SURNAME_SHOULD_BE_STRING })
  @MaxLength(USER_SURNAME_MAX_LENGTH, {
    message: SESSION_VALIDATE_MESSAGES.SURNAME_MAX_LENGTH,
  })
  @MinLength(USER_SURNAME_MIN_LENGTH, {
    message: SESSION_VALIDATE_MESSAGES.SURNAME_MIN_LENGTH,
  })
  surname: string;

  @MatchEqualTo(RegistrationDto, (s) => s.password, {
    message: SESSION_VALIDATE_MESSAGES.PASSWORD_IS_NOT_EQUAL,
  })
  confirmPassword: string;

  @IsNumber()
  @IsNotEmpty()
  timezone: number;
}
