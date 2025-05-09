// app/api/admin/users/[id]/orders/route.ts
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await auth();

    if (!session || !session.user?.isAdmin) {
        return NextResponse.json(
            { message: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        await dbConnect();
        const userId = params.id;

        const orders = await OrderModel.find({ user: userId })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(orders);
    } catch (err: any) {
        return NextResponse.json(
            { message: err.message || 'Server error' },
            { status: 500 }
        );
    }
}

// Optionally add other HTTP methods
export async function POST() {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}