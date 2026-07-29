import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from '../user/schemas/user.schemas';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    // Seed Users
    const userCount = await this.userModel.countDocuments();

    if (userCount === 0) {
      await this.userModel.insertMany([
        {
          username: 'admin',
          password: await bcrypt.hash('Admin@123', 10),
        },
        {
          username: 'john',
          password: await bcrypt.hash('John@123', 10),
        },
        {
          username: 'jane',
          password: await bcrypt.hash('Jane@123', 10),
        },
        {
          username: 'partha',
          password: await bcrypt.hash('Partha@123', 10),
        },
        {
          username: 'test',
          password: await bcrypt.hash('Test@123', 10),
        },
      ]);

      this.logger.log('Dummy users inserted.');
    } else {
      this.logger.log('Users already exist. Skipping user seed.');
    }

    // Seed Products
    const productCount = await this.productModel.countDocuments();

    if (productCount === 0) {
      await this.productModel.insertMany([
        {
          productName: 'Laptop',
          sku: 'SKU001',
        },
        {
          productName: 'Mouse',
          sku: 'SKU002',
        },
        {
          productName: 'Keyboard',
          sku: 'SKU003',
        },
      ]);

      this.logger.log('Dummy products inserted.');
    } else {
      this.logger.log('Products already exist. Skipping product seed.');
    }

    this.logger.log('Database seeding completed.');
  }
}