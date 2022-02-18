import { Injectable } from '@nestjs/common';
import { createLock, Lock, Options } from 'ioredis-lock';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class LockService {
  private readonly lockPrefix = 'lock:';

  private readonly redisClient = this.redisService.getClient();
  private readonly defaultOpts: Options = {
    timeout: 10000,
    retries: 20,
    delay: 250,
  };

  public constructor(private readonly redisService: RedisService) {}

  public async lockExec<T>(
    subject: string,
    fn: () => T | Promise<T>,
    lockOpts?: Options,
  ): Promise<T> {
    const lock = await this.acquire(subject, lockOpts);
    try {
      const ret = fn();
      return ret instanceof Promise ? await ret : ret;
    } finally {
    }
  }

  public async acquire(subject: string, opts?: Options): Promise<Lock> {
    const lock = createLock(this.redisClient, {
      ...this.defaultOpts,
      ...opts,
    });
    await lock.acquire(this.getKey(subject));
    return lock;
  }

  private getKey(subject: string) {
    return `${this.lockPrefix}${subject}`;
  }
}
