import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from './schemas/product.schema';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
    private readonly redisService: RedisService,
  ) {}

  async findAll() {

    const cache = await this.redisService.get('products');

    if (cache) {

        console.log('Returned from Redis');

        return JSON.parse(cache);
    }

    console.log('Returned from MongoDB');

    const products = await this.productModel.find();

    await this.redisService.set(
        'products',
        JSON.stringify(products),
        600, //TTL time to live (expiry in sec)
    );

    return products;
  }
}