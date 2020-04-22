import { Module, Global } from '@nestjs/common';
import { ConfigService } from './config.service';
import path from 'path';

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(
        process.env.NODE_ENV === 'production'
          ? '/not/exists'
          : path.join(
              __dirname,
              '../../config',
              `${process.env.NODE_ENV || 'development'}.env`,
            ),
      ),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
