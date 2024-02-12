import { DB_MODEL_NAMES } from '@enums/db';
import { GroupGlobalModule } from '@global-modules/group';
import { SessionGlobalModule } from '@global-modules/session';
import { UserSchema } from '@models/user';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DB_MODEL_NAMES.USER, schema: UserSchema },
    ]),
    GroupGlobalModule,
    SessionGlobalModule,
  ],
  controllers: [SessionController],
  providers: [SessionService],
})
export class SessionModule {}
