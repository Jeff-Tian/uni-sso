import { ConfigService } from './config.service';

describe('config', () => {
    it('default config', () => {
        const configService = new ConfigService('/not/exists');
        expect(configService.get('MONGODB_URI')).toEqual('mongodb://localhost:27017');
        expect(configService.get('PORT')).toEqual(3000);
    });
});
