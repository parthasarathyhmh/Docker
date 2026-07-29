import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  timestamps: true,
})
export class Product {
  @Prop({
    required: true,
    maxlength: 30,
  })
  productName!: string;

  @Prop({
    required: true,
    unique: true,
  })
  sku!: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);