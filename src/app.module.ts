import { RedisModule } from '@liaoliaots/nestjs-redis';
import { EventModule } from '@modules/planner/events';
import { GroupModule } from '@modules/planner/groups';
import { SessionModule } from '@modules/session';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtConfig } from '@shared/config/jwt.config';
import { MongooseConfig } from '@shared/config/mongoose.config';
import { RedisConfig } from '@shared/config/redis.config';
import { ROUTER_TREE } from './router';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync(MongooseConfig),
    RedisModule.forRootAsync(RedisConfig),
    JwtModule.register(JwtConfig),
    SessionModule,
    GroupModule,
    EventModule,
    RouterModule.register(ROUTER_TREE),
  ],
})
export class AppModule {}
