import { DB_MODEL_NAMES } from '@enums/db';
import { Group, TGroupModel } from '@models/group';
import { EGroupType } from '@modules/planner/groups/enums';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Injectable()
export class GroupsGlobalService {
  constructor(
    @InjectModel(DB_MODEL_NAMES.GROUP) private readonly groupModel: TGroupModel,
  ) {}

  async getActiveGroupIds(
    user: Types.ObjectId,
  ): Promise<Pick<Group, '_id'>[] | null> {
    return this.groupModel.find(
      {
        owner: user,
        isSelectedGroup: true,
      },
      { _id: 1 },
      { lean: true },
    );
  }

  async createBaseGroupsList(userId: Types.ObjectId): Promise<Group[]> {
    return this.groupModel.insertMany(
      [
        {
          owner: userId,
          title: 'Домашние дела',
          type: EGroupType.ROOT,
          isEditable: true,
          isDeletable: false,
          isSelectedGroup: true,
          color: 'rgb(251,96,82)',
        },
        {
          owner: userId,
          title: 'Рабочие дела',
          type: EGroupType.CUSTOM,
          isEditable: true,
          isSelectedGroup: true,
          isDeletable: true,
          color: 'rgb(33,150,243)',
        },
      ],
      { lean: true },
    );
  }
}
