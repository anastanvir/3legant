import mongoose from 'mongoose';

import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';

export const GET = auth(async (req: any) => {
  try {
    if (!req.auth) {
      return Response.json({ message: 'unauthorized' }, { status: 401 });
    }
    const { user } = req.auth;
    console.log('user._id:', user._id);

    console.log('User object:', user);
    const userId = new mongoose.Types.ObjectId(user._id);

    await dbConnect();
    const orders = await OrderModel.find({ user: user._id });

    return Response.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
});

