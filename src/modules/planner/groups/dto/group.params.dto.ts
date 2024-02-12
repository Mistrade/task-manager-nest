import { IsMongoId } from 'class-validator';
import { GROUP_VALIDATION_MESSAGES } from '../constants';

export class GroupParamsDto {
  @IsMongoId({ message: GROUP_VALIDATION_MESSAGES.GROUP_ID_SHOULD_BE_MONGO_ID })
  groupId: string;
}
