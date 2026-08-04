import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { RedisModule } from 'src/redis/redis.module';


@Module({
  imports: [
    AuthModule,
    RedisModule,
      MongooseModule.forFeature([
        {
          name: Product.name,
          schema: ProductSchema,
        },
      ]),],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
