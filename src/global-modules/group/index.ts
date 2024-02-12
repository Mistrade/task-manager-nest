import { DB_MODEL_NAMES } from '@enums/db';
import { GroupSchema } from '@models/group';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupsGlobalService } from './groups.global.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DB_MODEL_NAMES.GROUP, schema: GroupSchema },
    ]),
  ],
  providers: [GroupsGlobalService],
  exports: [GroupsGlobalService],
})
export class GroupGlobalModule {}
