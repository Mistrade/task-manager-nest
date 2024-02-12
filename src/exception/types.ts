import { EApiResponseTypes } from './enums';

export type TResponseInfoAdapterProps = Partial<
  Omit<IResponseInfoAdapter, 'datetime'>
>;

export interface IResponseInfoAdapter {
  datetime: string;
  type: EApiResponseTypes;
  message?: string;
  descriptions?: Array<string>;
  errorCode?: string;
  serviceName?: string;
  statusCode: number;
}

export interface IResponseAdapter<T = any> {
  data: T | null;
  info: IResponseInfoAdapter;
}
