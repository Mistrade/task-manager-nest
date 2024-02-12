import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import dayjs from 'dayjs';
import { EApiResponseTypes } from './enums';
import { IResponseInfoAdapter, TResponseInfoAdapterProps } from './types';

export class ResponseInfoAdapter implements IResponseInfoAdapter {
  @ApiProperty({ type: Number, default: 200 })
  statusCode: number;

  @ApiProperty({
    type: String,
    description: 'Время ответа на запрос по UTC',
    default: new Date().toString(),
  })
  datetime: string;

  @ApiProperty({
    type: String,
    enum: Object.values(EApiResponseTypes),
    description: 'Тип ответа на запрос',
    default: EApiResponseTypes.INFO,
  })
  type: EApiResponseTypes;

  @ApiProperty({
    type: String,
    description: 'Короткое сообщение о результате выполнения запроса.',
    required: false,
    default: 'Произошла какая-то ошибка, тут будет ее краткое описание.',
  })
  message?: string;

  @ApiProperty({
    type: [String],
    description: 'Более подробные сообщения о результате выполнения запроса.',
    required: false,
    default: [
      'Произошла какая-то ошибка, тут возможно будет ее более подробное описание.',
    ],
  })
  descriptions?: string[];

  @ApiProperty({
    type: String,
    description: 'Внутренний код ошибки сервиса.',
    default: 'UNKNOWN_ERROR',
  })
  errorCode?: string;

  @ApiProperty({
    type: String,
    description: 'Имя сервиса, в котором произошла ошибка.',
    default: 'Core',
  })
  serviceName?: string;

  constructor(props?: TResponseInfoAdapterProps) {
    this.datetime = dayjs().utc().toString();
    this.type = props?.type || EApiResponseTypes.INFO;
    this.message = props?.message || '';
    this.descriptions = props?.descriptions || [];
    this.errorCode = props?.errorCode || '';
    this.serviceName = props?.serviceName || 'Core';
    this.statusCode = props?.statusCode || HttpStatus.OK;
  }
}
