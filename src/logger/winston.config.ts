import * as winston from 'winston';

export const winstonLogger = winston.createLogger({
  level: 'info',

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),

  transports: [
    new winston.transports.File({
      filename: 'logs/login.log',
    }),

    new winston.transports.Console(),
  ],
});