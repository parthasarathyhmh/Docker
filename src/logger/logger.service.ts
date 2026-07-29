import { Injectable } from '@nestjs/common';
import { winstonLogger } from './winston.config';

@Injectable()
export class LoggerService {

  info(data: any) {
    winstonLogger.info(data);
  }

  warn(data: any) {
    winstonLogger.warn(data);
  }

  error(data: any) {
    winstonLogger.error(data);
  }

}