import { NextRequest } from 'next/server';

import { auth } from '@/lib/auth'; // ✅ use your exported 'auth' here
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/lib/models/ProductModel';

type RouteContext = {
  params: { id: string };
};

type SessionUser = {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

// GET product by ID
export async function GET(req: NextRequest, ctx: RouteContext) {
  const session = await auth();

  if (!session || !session.user || !(session.user as SessionUser).isAdmin) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    });
  }

  const { id } = ctx.params;
  await dbConnect();

  const product = await ProductModel.findById(id);
  if (!product) {
    return new Response(JSON.stringify({ message: 'Product not found' }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(product), { status: 200 });
}

// PUT (Update product)
export async function PUT(req: NextRequest, ctx: RouteContext) {
  const session = await auth();

  if (!session || !session.user || !(session.user as SessionUser).isAdmin) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    });
  }

  const { id } = ctx.params;
  const body = await req.json();
  await dbConnect();

  const updatedProduct = await ProductModel.findByIdAndUpdate(id, body, {
    new: true,
  });

  if (!updatedProduct) {
    return new Response(JSON.stringify({ message: 'Product not found' }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(updatedProduct), { status: 200 });
}

// DELETE product
export async function DELETE(req: NextRequest, ctx: RouteContext) {
  const session = await auth();

  if (!session || !session.user || !(session.user as SessionUser).isAdmin) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    });
  }

  const { id } = ctx.params;
  await dbConnect();

  const deletedProduct = await ProductModel.findByIdAndDelete(id);
  if (!deletedProduct) {
    return new Response(JSON.stringify({ message: 'Product not found' }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify({ message: 'Product deleted' }), {
    status: 200,
  });
}
