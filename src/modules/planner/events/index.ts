import { DB_MODEL_NAMES } from '@enums/db';
import { GroupGlobalModule } from '@global-modules/group';
import { SessionGlobalModule } from '@global-modules/session';
import { EventSchema } from '@models/event';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DB_MODEL_NAMES.EVENT, schema: EventSchema },
    ]),
    SessionGlobalModule,
    GroupGlobalModule,
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
