import { Injectable } from '@nestjs/common';
import { winstonLogger } from './winston.config';

@Injectable()
export class LoggerService {

  info(data: any) {
    console.log('INFO METHOD CALLED')
    winstonLogger.info(data);
  }

  warn(data: any) {
    console.log('WARN METHOD CALLED')
    winstonLogger.warn(data);
  }

  error(data: any) {
    console.log('ERROR METHOD CALLED')
    winstonLogger.error(data);
  }

}