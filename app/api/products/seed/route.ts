import { NextResponse } from 'next/server';

import data from '@/lib/data';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/lib/models/ProductModel';
import UserModel from '@/lib/models/UserModel';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { users, products } = data;

    await dbConnect();

    // Clear existing data
    await UserModel.deleteMany();
    await ProductModel.deleteMany();

    // Insert new data
    const createdUsers = await UserModel.insertMany(users);
    const createdProducts = await ProductModel.insertMany(products);

    return NextResponse.json({
      message: 'Seeded successfully',
      users: createdUsers.length,
      products: createdProducts.length,
    });
  } catch (error) {
    console.error('Seeding failed:', error);
    return NextResponse.json(
      { error: 'Database seeding failed' },
      { status: 500 },
    );
  }
}
