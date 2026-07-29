import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './cron.job';

@Module({
  imports: [
    ScheduleModule.forRoot(),
  ],
  providers: [TasksService],
})
export class SchedulerModule {}
