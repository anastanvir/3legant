import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import ProductModel from '@/lib/models/ProductModel';


export const POST = auth(async (req) => {
  try {
    if (!req.auth?.user?._id) {
      return NextResponse.json(
        { message: 'Not authenticated - please sign in' },
        { status: 401 }
      );
    }

    const payload = await req.json();
    await dbConnect();

    // Simplified user ID handling
    const userId = req.auth.user._id; // Already a string from our auth config

    if (!mongoose.isValidObjectId(userId)) {
      return NextResponse.json(
        { message: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    // Process order items
    const productIds = payload.items.map((item: any) => {
      if (!mongoose.isValidObjectId(item._id)) {
        throw new Error(`Invalid product ID: ${item._id}`);
      }
      return item._id; // Just use the string ID
    });

    const products = await ProductModel.find({
      _id: { $in: productIds }
    }).select('price name slug images');

    const orderItems = payload.items.map((item: any) => ({
      ...item,
      product: item._id,
      price: products.find(p => p._id.toString() === item._id)?.price || 0,
      _id: undefined,
    }));

    const order = new OrderModel({
      user: userId, // Now using the string ID directly
      items: orderItems,
      shippingAddress: payload.shippingAddress,
      paymentMethod: payload.paymentMethod,
      itemsPrice: payload.itemsPrice,
      shippingPrice: payload.shippingPrice,
      taxPrice: payload.taxPrice,
      totalPrice: payload.totalPrice,
      isPaid: false,
      isDelivered: false
    });

    const createdOrder = await order.save();
    return NextResponse.json(
      { message: 'Order created successfully', order: createdOrder },
      { status: 201 }
    );

  } catch (err: any) {
    console.error('Order creation error:', err);
    return NextResponse.json(
      {
        message: err.message || 'Order creation failed',
        error: process.env.NODE_ENV === 'development' ? err : undefined
      },
      { status: 500 }
    );
  }
});