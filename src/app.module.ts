import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HomeRedisModule } from './modules/HomeRedisModule';
import { GlobalServiceModule } from './modules/GlobalServiceModule';
import { TestRedisController } from './controllers/TestRedisController';

@Module({
  imports: [HomeRedisModule, GlobalServiceModule],
  controllers: [AppController, TestRedisController],
  providers: [AppService],
})
export class AppModule {}
