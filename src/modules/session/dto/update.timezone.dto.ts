import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { TIMEZONE_MAX, TIMEZONE_MIN } from '../constants';

export class UpdateTimezoneDto {
  @ApiProperty({
    type: Number,
    minimum: TIMEZONE_MIN,
    maximum: TIMEZONE_MAX,
    description: 'Смещение времени пользователя от UTC в минутах.',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(TIMEZONE_MIN)
  @Max(TIMEZONE_MAX)
  timezone: number;
}
