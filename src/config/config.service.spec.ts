import { ConfigService } from './config.service';

describe('config', () => {
    it('default config', () => {
        delete process.env.MONGODB_URI;

        const configService = new ConfigService('/not/exists');
        expect(configService.get('MONGODB_URI')).toEqual('mongodb://host.docker.internal:27017');
        expect(configService.get('PORT')).toEqual(3000);
    });

    it('read from environment', () => {
        process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017';

        const configService = new ConfigService('/not/exists');
        expect(configService.get('MONGODB_URI')).toEqual('mongodb://127.0.0.1:27017');
    });
});
