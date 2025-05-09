import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';

export const PUT = async (req: NextRequest) => {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const id = req.nextUrl.pathname.split('/')[4];

  try {
    await dbConnect();
    const order = await OrderModel.findById(id);

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    if (order.isPaid) {
      return NextResponse.json(
        { message: 'Order is already paid' },
        { status: 400 },
      );
    }

    order.isPaid = true;
    order.paidAt = new Date();
    const updatedOrder = await order.save();

    return NextResponse.json(updatedOrder);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
};
