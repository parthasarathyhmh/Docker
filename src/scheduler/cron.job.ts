import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {

  @Cron('*/50000 * * * * *')
  handleCron() {
    console.log('Running every 50000 seconds');
  }

}