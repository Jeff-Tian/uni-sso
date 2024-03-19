import {Module, Global} from '@nestjs/common';
import {ConfigService} from './config.service';
import path from 'path';
import * as process from "process";

@Global()
@Module({
    providers: [
        {
            provide: ConfigService,
            useValue: new ConfigService(
                process.env.NODE_ENV === 'production'
                    ? path.join(__dirname, '../..', '.env')
                    : path.join(
                        __dirname,
                        '../../config',
                        `${process.env.NODE_ENV || 'development'}.env`,
                    ),
                !process.env.NODE_ENV ||
                process.env.NODE_ENV === 'development' ||
                process.env.NODE_ENV === 'test'
                    ? path.join(__dirname, '../../config', 'test.env')
                    : undefined
            ),
        },
    ],
    exports: [ConfigService],
})
export class ConfigModule {
}
