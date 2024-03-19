import IORedisMock from 'ioredis-mock';
import RedisStorage from './redis.storage';

// Replace the real Redis class with ioredis-mock
jest.mock('ioredis', () => {
    return jest.fn().mockImplementation(() => new IORedisMock());
});

describe('RedisStorage', () => {
    let redisStorage;

    beforeEach(() => {
        redisStorage = new RedisStorage();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should save data to Redis', async () => {
        await redisStorage.save('traceId1', 'referer1', 1000);
        const value = await redisStorage.get('traceId1');
        expect(value).toBe('referer1');
    });

    it('should get data from Redis', async () => {
        await redisStorage.save('traceId1', 'referer1', 1000);
        const value = await redisStorage.get('traceId1');
        expect(value).toBe('referer1');
    });

    it('should delete data from Redis', async () => {
        await redisStorage.save('traceId1', 'referer1', 1000);
        await redisStorage.delete('traceId1');
        const value = await redisStorage.get('traceId1');
        expect(value).toBeNull();
    });
});
