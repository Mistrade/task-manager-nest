import { DB_MODEL_NAMES } from '@enums/db';
import { UserSchema } from '@models/user';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionTokenService } from './session.token.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DB_MODEL_NAMES.USER, schema: UserSchema },
    ]),
  ],
  providers: [SessionTokenService],
  exports: [SessionTokenService],
})
export class SessionGlobalModule {}
