import { ConfigService } from './config.service';

describe('config', () => {
  it('default config', () => {
    const configService = new ConfigService('/not/exists', undefined, {});
    expect(configService.get('MONGODB_URI') as string).toEqual(
      'mongodb://host.docker.internal:27017',
    );
    expect(configService.get('PORT') as string).toEqual(3000);
  });

  it('read from environment', () => {
    const configService = new ConfigService('/not/exists', undefined, {
      MONGODB_URI: 'mongodb://127.0.0.1:27017',
    });
    expect(configService.get('MONGODB_URI') as string).toEqual(
      'mongodb://127.0.0.1:27017',
    );
  });
});
