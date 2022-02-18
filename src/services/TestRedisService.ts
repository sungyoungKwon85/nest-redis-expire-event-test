import { Injectable } from '@nestjs/common';
import { HomeRedisService } from './HomeRedisService';

@Injectable()
export class TestRedisService {
  public constructor(private readonly redisService: HomeRedisService) {}

  async setTestToRedis(id: number) {
    return await this.redisService.setTestToRedis(id);
  }
}
