import { DB_MODEL_NAMES } from '@enums/db';
import { EModuleNames } from '@enums/modules';
import { EApiResponseTypes } from '@exception/enums';
import { RejectException } from '@exception/reject.exception';
import { Group, TGroupDocument, TGroupModel } from '@models/group';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ISessionData } from '../../session/types/api';
import { CreateGroupDto } from './dto/create.group.dto';
import { EGroupApiErrorCodes, EGroupApiMessages, EGroupType } from './enums';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(DB_MODEL_NAMES.GROUP) private readonly groupModel: TGroupModel,
  ) {}

  async createGroup(
    dto: CreateGroupDto,
    session: ISessionData,
  ): Promise<Group> {
    const { title, color } = dto;
    const { user } = session;

    const group = new this.groupModel({
      title,
      color,
      isSelectedGroup: true,
      isEditable: true,
      isDeletable: true,
      owner: new Types.ObjectId(user._id),
      type: EGroupType.CUSTOM,
    });

    return group.save({ validateBeforeSave: true });
  }

  async getGroupsByUser(userId: Types.ObjectId): Promise<Group[]> {
    return this.groupModel.find(
      {
        owner: userId,
      },
      {},
      { lean: true },
    );
  }

  async removeGroup(
    groupId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<RejectException | void> {
    const group = await this.groupModel.deleteOne({
      _id: groupId,
      owner: userId,
    });

    if (!group.deletedCount) {
      return new RejectException(null, {
        message: EGroupApiMessages.CANT_REMOVED,
        serviceName: EModuleNames.GROUPS,
        errorCode: EGroupApiErrorCodes.CANT_REMOVED,
        type: EApiResponseTypes.ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        descriptions: [],
      });
    }
  }

  async toggle(
    groupId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<Group | RejectException> {
    const group: TGroupDocument | null = await this.groupModel.findOne({
      _id: groupId,
      owner: userId,
    });

    if (!group) {
      return new RejectException(null, {
        message: EGroupApiMessages.NOT_FOUND,
        errorCode: EGroupApiErrorCodes.NOT_FOUND,
        type: EApiResponseTypes.ERROR,
        statusCode: HttpStatus.NOT_FOUND,
        serviceName: EModuleNames.GROUPS,
        descriptions: [],
      });
    }

    group.isSelectedGroup = !group.isSelectedGroup;

    return group.save({ validateModifiedOnly: true });
  }
}
