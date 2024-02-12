import { Types } from 'mongoose';
import { TEventPopulatedGroupItem } from '../types';

export class EventPopulatedGroup implements TEventPopulatedGroupItem {
  _id: Types.ObjectId;
  title: string;
  color: string;
}
