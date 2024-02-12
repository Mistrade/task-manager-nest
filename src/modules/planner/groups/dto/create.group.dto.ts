import { REG_EXP } from '@constants/validation';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  GROUP_TITLE_MAX_LENGTH,
  GROUP_TITLE_MIN_LENGTH,
  GROUP_VALIDATION_MESSAGES,
} from '../constants';

export class CreateGroupDto {
  @ApiProperty({
    description: 'Название группы событий',
    minLength: GROUP_TITLE_MIN_LENGTH,
    maxLength: GROUP_TITLE_MAX_LENGTH,
    type: String,
    required: true,
    example: 'Домашние дела',
  })
  @IsString({ message: GROUP_VALIDATION_MESSAGES.GROUP_TITLE_SHOULD_BE_STRING })
  @IsNotEmpty({ message: GROUP_VALIDATION_MESSAGES.GROUP_TITLE_IS_REQUIRED })
  @MinLength(GROUP_TITLE_MIN_LENGTH, {
    message: GROUP_VALIDATION_MESSAGES.GROUP_TITLE_MIN_LENGTH,
  })
  @MaxLength(GROUP_TITLE_MAX_LENGTH, {
    message: GROUP_VALIDATION_MESSAGES.GROUP_TITLE_MAX_LENGTH,
  })
  title: string;

  @ApiProperty({
    type: String,
    description: 'Цвет группы событий в RGB формате',
    example: 'rgb(255,255,255)',
    required: true,
  })
  @IsString({ message: GROUP_VALIDATION_MESSAGES.GROUP_COLOR_SHOULD_BE_STRING })
  @IsNotEmpty({ message: GROUP_VALIDATION_MESSAGES.GROUP_COLOR_IS_REQUIRED })
  @Matches(REG_EXP.RGB, {
    message: GROUP_VALIDATION_MESSAGES.GROUP_COLOR_INVALID,
  })
  color: string;
}
