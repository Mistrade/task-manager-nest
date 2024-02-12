import { DB_MODEL_NAMES } from '@enums/db';
import { GroupGlobalModule } from '@global-modules/group';
import { SessionGlobalModule } from '@global-modules/session';
import { GroupSchema } from '@models/group';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DB_MODEL_NAMES.GROUP, schema: GroupSchema },
    ]),
    GroupGlobalModule,
    SessionGlobalModule,
  ],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
