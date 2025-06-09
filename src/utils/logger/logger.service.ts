import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createLogger, format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class CustomLogger implements LoggerService {
  private readonly logger;

  constructor(private readonly configService: ConfigService) {
    const customFormat = format.printf(({ timestamp, level, message, ...meta }) => {
      return `${timestamp} [${level}]: ${message} ${meta && Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
    });

    const transportsArray = [];

    if (this.configService.get<string>('LOG_TO_CONSOLE') === 'true') {
      transportsArray.push(new transports.Console({
        level: 'debug',
        format: format.combine(
          format.timestamp(),
          format.colorize({ all:true }),
          format.errors({ stack: true }),
          customFormat,
        ),
      }));
    }

    if (this.configService.get<string>('LOG_TO_FILE') === 'true') {
      transportsArray.push(new DailyRotateFile({
        filename: 'logs/%DATE%-error.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxSize: '20m',
        maxFiles: '14d',
      }));

      transportsArray.push(new DailyRotateFile({
        filename: 'logs/%DATE%-combined.log',
        datePattern: 'YYYY-MM-DD',
        level: 'info',
        maxSize: '20m',
        maxFiles: '14d',
      }));
    }

    this.logger = createLogger({
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json(),
      ),
      transports: transportsArray,
    });
  }

  log(message: string, meta?: object) {
    this.logger.info(message, meta);
  }

  error(message: string, trace: string, meta?: object) {
    this.logger.error(trace ? `${message} - ${trace}` : message, meta);
  }

  warn(message: string, meta?: object) {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta?: object) {
    this.logger.debug(message, meta);
  }
}
