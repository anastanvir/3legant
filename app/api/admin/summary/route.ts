import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import ProductModel from '@/lib/models/ProductModel';
import UserModel from '@/lib/models/UserModel';

export const GET = auth(async (...request: any) => {
  const [req, { params }] = request;
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'unauthorized' }, { status: 401 });
  }
  await dbConnect();

  const ordersCount = await OrderModel.countDocuments();
  const productsCount = await ProductModel.countDocuments();
  const usersCount = await UserModel.countDocuments();

  // Only include paid orders in price calculations
  const ordersPriceGroup = await OrderModel.aggregate([
    {
      $match: {
        isPaid: true // Only match paid orders
      }
    },
    {
      $group: {
        _id: null,
        sales: { $sum: '$totalPrice' },
      },
    },
  ]);

  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

  // Get count of paid vs unpaid orders
  const orderStatusCounts = await OrderModel.aggregate([
    {
      $group: {
        _id: '$isPaid',
        count: { $sum: 1 },
      },
    },
  ]);

  // Convert to more readable format
  const paidOrdersCount = orderStatusCounts.find(item => item._id === true)?.count || 0;
  const unpaidOrdersCount = orderStatusCounts.find(item => item._id === false)?.count || 0;

  // Sales data for paid orders only
  const salesData = await OrderModel.aggregate([
    {
      $match: {
        isPaid: true
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalOrders: { $sum: 1 },
        totalSales: { $sum: '$totalPrice' },
      },
    },
    {
      $project: {
        _id: 1,
        totalOrders: 1,
        totalSales: { $round: ['$totalSales', 0] } // 👈 Rounds to nearest integer
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const productsData = await ProductModel.aggregate([
    {
      $group: {
        _id: '$category',
        totalProducts: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const usersData = await UserModel.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalUsers: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return Response.json({
    ordersCount,
    productsCount,
    usersCount,
    ordersPrice,
    paidOrdersCount,
    unpaidOrdersCount,
    salesData,
    productsData,
    usersData,
  });
});