import { IsBeforeDateConstraint } from '@decorators/validate';
import { EEventPriorities, EEventStatuses } from '@enums/event';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import {
  EVENT_DTO_VALIDATION_MESSAGES,
  EVENT_PRIORITY_LIST,
  EVENT_STATUSES_LIST,
  EVENT_TITLE_MAX_LENGTH,
  EVENT_TITLE_MIN_LENGTH,
} from '../constants/validation';

export class CreateEventDto {
  // Название события
  @ApiProperty({
    type: String,
    description: 'Название события',
    minLength: EVENT_TITLE_MIN_LENGTH,
    maxLength: EVENT_TITLE_MAX_LENGTH,
  })
  @IsString({
    message: EVENT_DTO_VALIDATION_MESSAGES.TITLE_SHOULD_BE_STRING,
  })
  @MinLength(EVENT_TITLE_MIN_LENGTH, {
    message: EVENT_DTO_VALIDATION_MESSAGES.TITLE_MIN_LENGTH,
  })
  @MaxLength(EVENT_TITLE_MAX_LENGTH, {
    message: EVENT_DTO_VALIDATION_MESSAGES.TITLE_MAX_LENGTH,
  })
  @IsNotEmpty({
    message: EVENT_DTO_VALIDATION_MESSAGES.TITLE_IS_REQUIRED,
  })
  title: string;

  // Дополнительное Описание события
  @ApiProperty({
    type: String,
    required: false,
    description: 'Дополнительное описание события',
  })
  @IsOptional()
  @IsString({
    message: EVENT_DTO_VALIDATION_MESSAGES.DESCRIPTION_SHOULD_BE_STRING,
  })
  description?: string;

  // Доп. ссылка для события
  @ApiProperty({
    type: String,
    required: false,
    description: 'Дополнительная ссылка для события',
  })
  @IsOptional()
  @IsString({ message: EVENT_DTO_VALIDATION_MESSAGES.LINK_SHOULD_BE_STRING })
  link?: string;

  // Приоритет события
  @ApiProperty({
    type: String,
    enum: EVENT_PRIORITY_LIST,
    description: 'Приоритет события',
  })
  @IsString({
    message: EVENT_DTO_VALIDATION_MESSAGES.PRIORITY_SHOULD_BE_STRING,
  })
  @IsEnum(EVENT_PRIORITY_LIST, {
    message: EVENT_DTO_VALIDATION_MESSAGES.PRIORITY_SHOULD_BE_ENUM,
  })
  @IsNotEmpty({ message: EVENT_DTO_VALIDATION_MESSAGES.PRIORITY_IS_REQUIRED })
  priority: EEventPriorities;

  // Статус события
  @ApiProperty({
    type: String,
    enum: EVENT_STATUSES_LIST,
    description: 'Статус события',
  })
  @IsString({ message: EVENT_DTO_VALIDATION_MESSAGES.STATUS_SHOULD_BE_STRING })
  @IsEnum(EVENT_STATUSES_LIST, {
    message: EVENT_DTO_VALIDATION_MESSAGES.STATUS_SHOULD_BE_ENUM,
  })
  @IsNotEmpty({ message: EVENT_DTO_VALIDATION_MESSAGES.STATUS_IS_REQUIRED })
  status: EEventStatuses;

  // Группа событий
  @ApiProperty({ type: String, description: 'Идентификатор группы событий' })
  @IsMongoId({
    message: EVENT_DTO_VALIDATION_MESSAGES.GROUP_ID_SHOULD_BE_MONGO_ID,
  })
  @IsNotEmpty({ message: EVENT_DTO_VALIDATION_MESSAGES.GROUP_IS_REQUIRED })
  group: string;

  // Дата начала события
  @ApiProperty({ type: String, description: 'Дата начала события' })
  @IsDateString({}, { message: EVENT_DTO_VALIDATION_MESSAGES.INVALID_DATE })
  @IsNotEmpty({ message: EVENT_DTO_VALIDATION_MESSAGES.DATE_IS_REQUIRED })
  @Validate(IsBeforeDateConstraint, ['dateEnd'], {
    message: 'Валидатор сказал что так нельзя',
  })
  date: string;

  // Дата завершения события
  @ApiProperty({
    type: String,
    description: 'Дата завершения события, должно быть после даты начала.',
  })
  @IsDateString({}, { message: EVENT_DTO_VALIDATION_MESSAGES.INVALID_DATE_END })
  @IsNotEmpty({ message: EVENT_DTO_VALIDATION_MESSAGES.DATE_END_IS_REQUIRED })
  // TODO Добавить ref валидатор на сравнение с полем date
  //   https://github.com/typestack/class-validator/issues/145
  dateEnd: string;

  // Идентификатор родительского события
  @ApiProperty({
    type: String,
    required: false,
    description: 'Идентификатор родительского события.',
  })
  @IsOptional()
  @IsMongoId({
    message: EVENT_DTO_VALIDATION_MESSAGES.PARENT_ID_SHOULD_BE_MONGO_ID,
  })
  parentId?: string;
}
