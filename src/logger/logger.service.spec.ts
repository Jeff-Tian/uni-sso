import { LoggerService } from './logger.service';

describe('Logger Service', () => {
  const log: any[] = [];

  beforeAll(() => {
    // @ts-ignore
    process.stdout.write = (...args: any[]) => {
      log.push(args);
    };
  });

  it('logs', () => {
    const logger = new LoggerService();

    logger.log('hello');

    expect(log).toEqual([['info: hello {"service":"todo"}\n']]);
  });
});
