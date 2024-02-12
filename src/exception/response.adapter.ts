import { ApiProperty } from '@nestjs/swagger';
import { ResponseInfoAdapter } from './response.info.adapter';
import { IResponseAdapter, TResponseInfoAdapterProps } from './types';

export class ResponseAdapter<T = any> implements IResponseAdapter<T> {
  @ApiProperty({
    type: 'object',
    description: 'Данные запроса.',
    nullable: true,
    required: true,
    default: null,
  })
  data: T | null;

  @ApiProperty({
    type: ResponseInfoAdapter,
    description: 'Информация о выполнении запроса',
    required: true,
  })
  info: ResponseInfoAdapter;

  constructor(data: T | null, info?: TResponseInfoAdapterProps) {
    this.data = data;
    this.info = new ResponseInfoAdapter(info);
  }
}
