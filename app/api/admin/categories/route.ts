import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import CategoryModel from '@/lib/models/CategoryModel';

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const categories = await CategoryModel.find().sort({ name: 1 });
  return Response.json(categories.map((cat) => cat.name));
}) as any;

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const { name } = await req.json();

    if (!name) {
      return Response.json({ message: 'Category name is required' }, { status: 400 });
    }

    const existingCategory = await CategoryModel.findOne({ name });
    if (existingCategory) {
      return Response.json({ message: 'Category already exists' }, { status: 400 });
    }

    const category = new CategoryModel({ name });
    await category.save();

    return Response.json(
      { message: 'Category created successfully', name: category.name },
      { status: 201 }
    );
  } catch (err: any) {
    return Response.json(
      { message: 'Failed to create category', error: err.message },
      { status: 500 }
    );
  }
}) as any;
