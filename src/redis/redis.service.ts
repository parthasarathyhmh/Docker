import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client!: RedisClientType;

  async onModuleInit() {  // This method is called when the module is initialized
    this.client = createClient({
      url: 'redis://redis:6379', //redis is your Docker service name.
    });

    await this.client.connect();

    console.log('✅ Redis Connected');
  }

  async get(key: string) {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl = 60) {
    await this.client.set(key, value, {
      EX: ttl,
    });
  }

  async del(key: string) {
    await this.client.del(key);
  }
}