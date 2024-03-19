import ICacheStorage from "@jeff-tian/memory-storage/src/ICacheStorage";
import Redis from "ioredis";

export default class RedisStorage implements ICacheStorage {
    private static redis = new Redis();

    async get(traceId: string) {
        // return RedisStorage.redis.get(traceId);
        return Promise.resolve(void 0);
    }

    async save(traceId: string, referer: string, forHowLong: number) {
        // return RedisStorage.redis.set(traceId, referer, 'EX', forHowLong / 1000);
    }

    async delete(traceId: string) {
        // return RedisStorage.redis.del(traceId);
    }

    size: number;
}
