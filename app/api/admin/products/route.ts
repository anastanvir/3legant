import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import ProductModel, { Product } from '@/lib/models/ProductModel';
import { Types } from 'mongoose';

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      },
    );
  }
  await dbConnect();
  const products = await ProductModel.find();
  return Response.json(products);
}) as any;

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      },
    );
  }
  
  await dbConnect();
  
  const randomSlug = `product-${Math.random().toString(36).substring(2, 9)}-${Date.now().toString(36)}`;
  
  try {
    const product = new ProductModel({
      name: '',
      slug: randomSlug,
      images: [],
      price: 0,
      category: '',
      brand: '',
      description: '',
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      isFeatured: false,
      banner: '',
      colors: [],
      sizes: []
    });

    // Save without validation
    await product.save({ validateBeforeSave: false });
    
    return Response.json(
      { 
        message: 'Empty product created successfully', 
        product: {
          _id: product._id,
          slug: product.slug,
          images: product.images
        } 
      },
      {
        status: 201,
      },
    );
  } catch (err: any) {
    return Response.json(
      { 
        message: 'Failed to create product template',
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      },
      {
        status: 500,
      },
    );
  }
}) as any;

export const PUT = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      },
    );
  }

  await dbConnect();

  try {
    const { _id, ...updateData } = await req.json();

    if (!_id || !Types.ObjectId.isValid(_id)) {
      return Response.json(
        { message: 'Invalid product ID' },
        {
          status: 400,
        },
      );
    }

    // Clean up images array - remove empty strings
    if (updateData.images) {
      updateData.images = updateData.images.filter((img: string) => img.trim() !== '');
    }

    // Validate required fields when updating
    const requiredFields = ['name', 'category', 'brand', 'description'];
    const missingFields = requiredFields.filter(field => !updateData[field]);

    if (missingFields.length > 0) {
      return Response.json(
        {
          message: 'Missing required fields',
          missingFields: missingFields
        },
        {
          status: 400,
        },
      );
    }

    // Validate images
    if (!updateData.images || updateData.images.length === 0) {
      return Response.json(
        { message: 'At least one valid image is required' },
        {
          status: 400,
        },
      );
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return Response.json(
        { message: 'Product not found' },
        {
          status: 404,
        },
      );
    }

    return Response.json(
      {
        message: 'Product updated successfully',
        product: updatedProduct
      },
      {
        status: 200,
      },
    );
  } catch (err: any) {
    return Response.json(
      {
        message: 'Failed to update product',
        error: err.message,
        validationErrors: err.errors
      },
      {
        status: 500,
      },
    );
  }
}) as any;

export const DELETE = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      },
    );
  }

  await dbConnect();

  try {
    const { _id } = await req.json();

    if (!_id || !Types.ObjectId.isValid(_id)) {
      return Response.json(
        { message: 'Invalid product ID' },
        {
          status: 400,
        },
      );
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(_id);

    if (!deletedProduct) {
      return Response.json(
        { message: 'Product not found' },
        {
          status: 404,
        },
      );
    }

    return Response.json(
      {
        message: 'Product deleted successfully',
        productId: _id
      },
      {
        status: 200,
      },
    );
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      },
    );
  }
}) as any;