import { Injectable, Logger as NestLogger, Scope } from '@nestjs/common';
import winston, { Logger } from 'winston';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends NestLogger {
  private logger: Logger;

  constructor() {
    super();

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      defaultMeta: { service: 'todo' },
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    });

    // tslint:disable-next-line:no-console
    // console.log = (message: any, params?: any) => {
    //   this.logger.debug(message, params);
    // };

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
      );
    }
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(message, trace);
  }

  warn(message: string) {
    this.logger.warning(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
