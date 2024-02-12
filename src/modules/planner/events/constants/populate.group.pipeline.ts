import { Group } from '@models/group';
import { PopulateOptions } from 'mongoose';
import { TEventPopulatedGroupItem, TPopulatedEvent } from '../types';

const fieldName: keyof Pick<TPopulatedEvent, 'group'> = 'group';
const selectObject: Record<
  keyof Pick<Group, keyof TEventPopulatedGroupItem>,
  number
> = {
  _id: 1,
  title: 1,
  color: 1,
};

export const POPULATE_EVENT_GROUP_PIPELINE: PopulateOptions = {
  path: fieldName,
  select: selectObject,
};
