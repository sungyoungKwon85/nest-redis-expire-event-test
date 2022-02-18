import { Injectable } from '@nestjs/common';
import type { KeyType, ValueType } from 'ioredis';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class HomeRedisService {
  public readonly TEST_ID_EXPIRE = 'test_id_expire_';

  private readonly redis = this.redisService.getClient();
  private readonly subscriber = this.redisService.getClient();
  private readonly publisher = this.redisService.getClient();

  public constructor(private readonly redisService: RedisService) {
    this.redis.on('ready', () => {
      this.redis.config('SET', 'notify-keyspace-events', 'Ex'); // Ex, Kx ...
    });
  }

  async set(key: KeyType, value: ValueType, time?: number): Promise<boolean> {
    try {
      time
        ? await this.redis.set(key, value, 'Ex', time)
        : await this.redis.set(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }
  async setTestToRedis(id: number) {
    const ttl = 5;
    const key = `${this.TEST_ID_EXPIRE}${id}`;
    const result = await this.set(key, 'kkwonsy' + id, ttl);
    console.log('setTestToRedis... ' + key);

    this.subscriber.subscribe('__keyevent@0__:expired'); // notify-keyspace-events: Ex, eventName: message
    // this.subscriber.subscribe('__keyspace@0__:' + key); // notify-keyspace-events: Kx, eventName: message
    // this.subscriber.psubscribe('__key*__:*'); // eventName: pmessage
    // this.subscriber.psubscribe('__key*__:expired'); // eventName: pmessage
    // this.subscriber.psubscribe('__key*__:' + key); // notify-keyspace-events: Kx, eventName: pmessage
    // this.subscriber.psubscribe('__keyspace@0__:' + this.TEST_ID_EXPIRE + '*'); // notify-keyspace-events: Kx, eventName: pmessage
    this.subscriber.on('message', async (channel, message) => {
      //   this.subscriber.on('pmessage', async (channel, message) => {
      console.log('channel: ' + channel);
      console.log('message: ' + message);
    });

    return result;
  }

  async sendCommand(command: string, args: string[]) {
    return await this.redis.send_command(command, args);
  }

  async get(key: KeyType) {
    try {
      return await this.redis.get(key);
    } catch (e) {
      return;
    }
  }

  async del(keys: KeyType[]) {
    try {
      return await this.redis.del(keys);
    } catch (e) {
      return;
    }
  }

  async scan(keyPattern: string): Promise<string[]> {
    try {
      const keys: string[] = [];
      const res = await this.getKeys(keyPattern, keys);
      if (res) return res;
      else return [];
    } catch (e) {
      return [];
    }
  }

  async hset(key: KeyType, field: string, value: ValueType) {
    try {
      return await this.redis.hset(key, field, value);
    } catch (e) {
      return false;
    }
  }

  async hget(key: KeyType, field: string) {
    try {
      return await this.redis.hget(key, field);
    } catch (e) {
      return;
    }
  }

  private async getKeys(
    keyPattern: string,
    keys: string[],
    nextToken?: string | undefined,
  ): Promise<string[]> {
    const max = 500;
    const chunk = 100;
    const res = await this.redis.scan(
      nextToken || 0,
      'MATCH',
      `${keyPattern}`,
      'COUNT',
      chunk,
    );
    const resKeys = res[1];
    const next = res[0];
    keys.push(...resKeys);
    if (next !== '0' && keys.length <= max) {
      await this.getKeys(keyPattern, keys, next);
    }
    return keys;
  }
}
