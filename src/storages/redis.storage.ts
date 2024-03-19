import ICacheStorage from "@jeff-tian/memory-storage/src/ICacheStorage";

const Redis = require("ioredis");

export default class RedisStorage implements ICacheStorage {
    private readonly redis;

    constructor() {
        this.redis = new Redis(process.env.UPSTASH_REDIS_URL);
    }

    async get(traceId: string) {
        return this.redis.get(traceId);
    }

    async save(traceId: string, referer: string, forHowLong: number) {
        return this.redis.set(traceId, referer, 'EX', forHowLong / 1000);
    }

    async delete(traceId: string) {
        return this.redis.del(traceId);
    }

    size: number;
}
