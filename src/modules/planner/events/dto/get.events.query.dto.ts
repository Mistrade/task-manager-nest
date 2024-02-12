import { IsBeforeDateConstraint } from '@decorators/validate';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, Validate } from 'class-validator';
import dayjs from 'dayjs';

export class GetEventsQueryDto {
  @ApiProperty({
    type: String,
    format: 'ISO',
    example: dayjs().toISOString(),
    description: 'С какой даты нужно искать события',
  })
  @IsDateString()
  @IsNotEmpty()
  @Validate(IsBeforeDateConstraint, ['toDate'])
  fromDate: string;

  @ApiProperty({
    type: String,
    format: 'ISO',
    example: dayjs().add(1, 'day').toISOString(),
    description: 'До какой даты нужно искать события',
  })
  @IsDateString()
  @IsNotEmpty()
  toDate: string;
  //
  // @ApiProperty({
  //   type: String,
  //   enum: EVENT_STATUSES_LIST,
  //   description: 'Статус событий',
  // })
  // @IsString()
  // @IsEnum(EVENT_STATUSES_LIST)
  // @IsNotEmpty()
  // status: EEventStatuses;
}
