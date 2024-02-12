import { REG_EXP } from '@constants/validation';
import { DB_MODEL_NAMES } from '@enums/db';
import {
  GROUP_TITLE_MAX_LENGTH,
  GROUP_TITLE_MIN_LENGTH,
  GROUP_VALIDATION_MESSAGES,
} from '@modules/planner/groups/constants';
import { EGroupType } from '@modules/planner/groups/enums';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Model, SchemaTypes, Types } from 'mongoose';

@Schema({
  timestamps: true,
})
class Group {
  @ApiProperty({
    type: String,
    description: 'Идентификатор группы',
    required: true,
    readOnly: true,
  })
  _id: Types.ObjectId;

  @ApiProperty({
    type: String,
    description: 'Идентификатор пользователя-владельца',
    required: true,
    readOnly: true,
  })
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: DB_MODEL_NAMES.USER,
    required: true,
  })
  owner: Types.ObjectId;

  @ApiProperty({
    type: String,
    description: 'Название',
    required: true,
    minLength: GROUP_TITLE_MIN_LENGTH,
    maxLength: GROUP_TITLE_MAX_LENGTH,
  })
  @Prop({
    type: String,
    required: true,
    minlength: GROUP_TITLE_MIN_LENGTH,
    maxlength: GROUP_TITLE_MAX_LENGTH,
  })
  title: string;

  @ApiProperty({
    type: String,
    description: 'Цвет в rgb',
    example: 'rgb(255, 255, 255)',
    required: true,
  })
  @Prop({
    type: String,
    required: true,
    match: [REG_EXP.RGB, GROUP_VALIDATION_MESSAGES.GROUP_COLOR_INVALID],
  })
  color: string;

  @ApiProperty({
    type: String,
    enum: Object.values(EGroupType),
    default: EGroupType.CUSTOM,
    required: true,
    description: 'Тип группы событий',
  })
  @Prop({
    type: String,
    required: true,
    default: EGroupType.CUSTOM,
    enum: Object.values(EGroupType),
  })
  type: EGroupType;

  @ApiProperty({
    type: Boolean,
    required: true,
    default: true,
    description:
      'Статус выбранной группы. Учитывается при получении списка и поиску событий.',
  })
  @Prop({
    type: Boolean,
    required: true,
    default: true,
  })
  isSelectedGroup: boolean;

  @ApiProperty({
    type: Boolean,
    required: true,
    default: false,
    description:
      'Флаг, указывающий на возможность редактирования группы событий.',
  })
  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  isEditable: boolean;

  @ApiProperty({
    type: Boolean,
    required: true,
    default: false,
    description: 'Флаг, указывающий на возможность удаления группы событий.',
  })
  @Prop({
    type: Boolean,
    required: true,
    default: false,
  })
  isDeletable: boolean;
}

const GroupSchema = SchemaFactory.createForClass(Group);
type TGroupDocument = HydratedDocument<Group>;
type TGroupModel = Model<TGroupDocument>;

export { GroupSchema, TGroupDocument, TGroupModel, Group };
