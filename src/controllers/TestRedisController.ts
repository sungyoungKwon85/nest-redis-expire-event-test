import { Controller, Get, Param } from '@nestjs/common';
import { TestRedisService } from '../services/TestRedisService';

@Controller()
export class TestRedisController {
  constructor(private readonly testRedisService: TestRedisService) {}

  @Get('/abc/:id')
  async getTest(@Param('id') id: number): Promise<string> {
    await this.testRedisService.setTestToRedis(id);
    return 'hello ' + id;
  }
}
