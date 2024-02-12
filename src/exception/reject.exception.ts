import { HttpException } from '@nestjs/common';
import { Nullable } from '../types/global';
import { ResponseAdapter } from './response.adapter';
import { TResponseInfoAdapterProps } from './types';

export class RejectException<T = any> extends HttpException {
  constructor(data: Nullable<T>, info: Required<TResponseInfoAdapterProps>) {
    super(new ResponseAdapter(data, info), info.statusCode);
  }
}
