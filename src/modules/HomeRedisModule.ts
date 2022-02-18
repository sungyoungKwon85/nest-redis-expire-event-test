import { Global, Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { HomeRedisService } from '../services/HomeRedisService';
import { LockService } from '../services/LockService';

// const EnvStage = process.env.STAGE;
const EnvStage = 'local';
const isLocalEnv = EnvStage === 'local';

const HomeRedisModuleServices = [HomeRedisService, LockService];

@Global()
@Module({
  imports: [
    RedisModule.register({
      enableReadyCheck: true,
      enableOfflineQueue: true,
      reconnectOnError: (e) => {
        if (isLocalEnv) {
          return false;
        }
        return true;
      },
      retryStrategy: (times: number) => {
        if (isLocalEnv) {
          return null;
        }
        return 350;
      },
      maxRetriesPerRequest: 5,
      // host: process.env.REDIS_HOST_PRIMARY || 'localhost',
      host: 'localhost',
      port: 6379,
    }),
  ],
  providers: HomeRedisModuleServices,
  exports: HomeRedisModuleServices,
})
export class HomeRedisModule {}
