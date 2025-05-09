// lib/models/ProductModel.ts
import mongoose from 'mongoose';

export type Product = {
  _id?: string;
  name: string;
  slug: string;
  images: string[]; // Changed from single image to array
  price: number;
  brand: string;
  description: string;
  category: string;
  rating: number;
  numReviews: number;
  countInStock: number;
  isFeatured?: boolean;
  banner?: string;
  colors?: string[];
  sizes?: string[];
};

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (array: string[]) => array.length > 0,
        message: 'At least one image is required',
      },
    },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    description: { type: String, required: true },
    countInStock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    banner: String,
    colors: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
  },
  {
    timestamps: true,
  },
);



const ProductModel =
  mongoose.models.Product || mongoose.model('Product', productSchema);

export default ProductModel;
