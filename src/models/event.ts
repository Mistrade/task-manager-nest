import { DB_MODEL_NAMES } from '@enums/db';
import { EEventPriorities, EEventStatuses } from '@enums/event';
import {
  EVENT_PRIORITY_LIST,
  EVENT_STATUSES_LIST,
  EVENT_TITLE_MAX_LENGTH,
  EVENT_TITLE_MIN_LENGTH,
} from '@modules/planner/events/constants/validation';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import dayjs from 'dayjs';
import { HydratedDocument, Model, SchemaTypes, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
class Event {
  @ApiProperty({ type: String, description: 'Идентификатор' })
  _id: Types.ObjectId;
  @ApiProperty({ type: String, description: 'Дата создания' })
  createdAt: Date;
  @ApiProperty({ type: String, description: 'Дата последнего обновления' })
  updatedAt: Date;

  @ApiProperty({
    type: String,
    description: 'Название событие',
    minLength: EVENT_TITLE_MIN_LENGTH,
    maxLength: EVENT_TITLE_MAX_LENGTH,
  })
  @Prop({
    type: String,
    minlength: EVENT_TITLE_MIN_LENGTH,
    maxlength: EVENT_TITLE_MAX_LENGTH,
    required: true,
  })
  title: string;

  @ApiProperty({
    type: String,
    description: 'Описание события: текст или html-строка',
    required: false,
  })
  @Prop({
    type: String,
  })
  description?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'Ссылка на событие',
  })
  @Prop({
    type: String,
  })
  link?: string;

  @ApiProperty({
    type: String,
    enum: EVENT_PRIORITY_LIST,
    description: 'Приоритет события',
  })
  @Prop({ type: String, enum: EVENT_PRIORITY_LIST, required: true })
  priority: EEventPriorities;

  @ApiProperty({
    type: String,
    enum: EVENT_STATUSES_LIST,
    description: 'Статус события',
  })
  @Prop({ type: String, enum: EVENT_STATUSES_LIST, required: true })
  status: EEventStatuses;

  @ApiProperty({ type: String, description: 'Идентификатор группы событий' })
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: DB_MODEL_NAMES.GROUP,
    required: true,
  })
  group: Types.ObjectId;

  @ApiProperty({ type: String, description: 'Дата события' })
  @Prop({ type: Date, required: true })
  date: Date;

  @ApiProperty({ type: String, description: 'Дата завершения события' })
  @Prop({
    type: Date,
    required: true,
    validate: {
      validator(this: Event, value: Date) {
        return dayjs(value).isAfter(this.date, 'minute');
      },
      message: 'Дата завершения должна быть после даты начала.',
    },
  })
  dateEnd: Date;

  @ApiProperty({
    type: String,
    description: 'Идентификатор пользователя-владельца событий',
  })
  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    ref: DB_MODEL_NAMES.USER,
  })
  owner: Types.ObjectId;

  @ApiProperty({
    type: String,
    description: 'Идентификатор родительского события',
    default: null,
  })
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: DB_MODEL_NAMES.EVENT,
    default: null,
  })
  parentId: Types.ObjectId | null;
}

const EventSchema = SchemaFactory.createForClass(Event);
type TEventDocument = HydratedDocument<Event>;
type TEventModel = Model<TEventDocument>;

export { EventSchema, Event, TEventModel, TEventDocument };
