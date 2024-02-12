import { ERedisNamespaces } from '@enums/redis';
import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const getRedisConfigs = async (
  configService: ConfigService,
): Promise<RedisModuleOptions> => {
  return {
    config: [
      {
        port: configService.get('REDIS_SESSION_PORT'),
        host: configService.get('REDIS_SESSION_HOST'),
        db: 0,
        namespace: ERedisNamespaces.SESSION,
      },
    ],
  };
};

export const RedisConfig = {
  imports: [ConfigModule],
  useFactory: getRedisConfigs,
  inject: [ConfigService],
};
