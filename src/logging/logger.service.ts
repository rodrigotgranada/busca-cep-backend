import { Injectable, LoggerService, Scope } from '@nestjs/common';
import * as winston from 'winston';

@Injectable({ scope: Scope.DEFAULT })
export class Logger implements LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    });
  }

  log(message: string, context?: string): void {
    this.logger.info({ message, context });
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error({ message, trace, context });
  }

  warn(message: string, context?: string): void {
    this.logger.warn({ message, context });
  }

  debug?(message: string, context?: string): void {
    this.logger.debug({ message, context });
  }

  verbose?(message: string, context?: string): void {
    this.logger.verbose({ message, context });
  }
}
