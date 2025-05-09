'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js';
import Link from 'next/link';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import useSWR from 'swr';

import { formatNumber } from '@/lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement
);

const Dashboard = () => {
  const { data: summary, error } = useSWR(`/api/admin/summary`);
  const [isMobile, setIsMobile] = useState(false);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (error) return <ErrorDisplay message={error.message} />;
  if (!summary) return <LoadingSpinner />;

  // Calculate derived metrics
  const averageOrderValue = summary.ordersCount > 0
    ? summary.ordersPrice / summary.ordersCount
    : 0;

  const conversionRate = summary.visitorsCount > 0
    ? (summary.ordersCount / summary.visitorsCount) * 100
    : 0;

  // Chart configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e2e8f0',
          boxWidth: 12,
          padding: 8,
          font: {
            size: isMobile ? 10 : 12,
          },
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(226, 232, 240, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
          maxRotation: isMobile ? 45 : 0,
          font: {
            size: isMobile ? 10 : 12,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(226, 232, 240, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: isMobile ? 10 : 12,
          },
        },
      },
    },
    elements: {
      point: {
        radius: isMobile ? 3 : 4,
        hoverRadius: isMobile ? 5 : 6,
      },
    },
  };

  const chartDataConfig = {
    sales: {
      labels: summary.salesData.map((x: { _id: string }) => x._id),
      datasets: [
        {
          fill: true,
          label: 'Sales',
          data: summary.salesData.map((x: { totalSales: number }) => x.totalSales),
          borderColor: 'rgba(251, 191, 36, 0.8)',
          backgroundColor: 'rgba(251, 191, 36, 0.15)',
          tension: 0.3,
        },
      ],
    },
    orders: {
      labels: summary.salesData.map((x: { _id: string }) => x._id),
      datasets: [
        {
          fill: true,
          label: 'Orders',
          data: summary.salesData.map((x: { totalOrders: number }) => x.totalOrders),
          borderColor: 'rgba(59, 130, 246, 0.8)',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          tension: 0.3,
        },
      ],
    },
    products: {
      labels: summary.productsData.map((x: { _id: string }) => x._id),
      datasets: [
        {
          label: 'Category',
          data: summary.productsData.map((x: { totalProducts: number }) => x.totalProducts),
          backgroundColor: [
            'rgba(251, 191, 36, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(59, 130, 246, 0.7)',
            'rgba(139, 92, 246, 0.7)',
            'rgba(244, 63, 94, 0.7)',
          ],
          borderColor: [
            'rgba(251, 191, 36, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(139, 92, 246, 1)',
            'rgba(244, 63, 94, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    users: {
      labels: summary.usersData.map((x: { _id: string }) => x._id),
      datasets: [
        {
          label: 'Users',
          data: summary.usersData.map((x: { totalUsers: number }) => x.totalUsers),
          backgroundColor: 'rgba(139, 92, 246, 0.7)',
          borderColor: 'rgba(139, 92, 246, 1)',
          borderRadius: 4,
        },
      ],
    },
    paymentMethods: {
      labels: summary.paymentData?.map((x: { _id: string }) => x._id) || [],
      datasets: [
        {
          label: 'Revenue by Payment',
          data: summary.paymentData?.map((x: { total: number }) => x.total) || [],
          backgroundColor: [
            'rgba(16, 185, 129, 0.7)', // Credit Card
            'rgba(59, 130, 246, 0.7)',  // PayPal
            'rgba(251, 191, 36, 0.7)',  // Bank Transfer
          ],
          borderColor: [
            'rgba(16, 185, 129, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(251, 191, 36, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    orderStatus: {
      labels: summary.orderStatusData?.map((x: { _id: string }) => x._id) || [],
      datasets: [
        {
          label: 'Order Status',
          data: summary.orderStatusData?.map((x: { count: number }) => x.count) || [],
          backgroundColor: [
            'rgba(16, 185, 129, 0.7)', // Completed
            'rgba(251, 191, 36, 0.7)',  // Processing
            'rgba(244, 63, 94, 0.7)',    // Cancelled
            'rgba(139, 92, 246, 0.7)',   // Shipped
          ],
        },
      ],
    },
    topProducts: {
      labels: summary.topProducts?.map((x: { name: string }) => x.name) || [],
      datasets: [
        {
          label: 'Units Sold',
          data: summary.topProducts?.map((x: { sold: number }) => x.sold) || [],
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
      ],
    },
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-base-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-base-content">Dashboard Overview</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as any)}
          className="select select-bordered select-sm"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            title: 'Sales',
            value: `$${formatNumber(Math.round(summary.ordersPrice))}`,
            link: '/admin/orders',
            icon: '💰',
            trend: summary.salesTrend,
          },
          {
            title: 'Orders',
            value: summary.ordersCount,
            link: '/admin/orders',
            icon: '📦',
            trend: summary.ordersTrend,
          },
          {
            title: 'Products',
            value: summary.productsCount,
            link: '/admin/products',
            icon: '🛍️',
            trend: summary.productsTrend,
          },
          {
            title: 'Users',
            value: summary.usersCount,
            link: '/admin/users',
            icon: '👥',
            trend: summary.usersTrend,
          },
          {
            title: 'Avg Order Value',
            value: `$${formatNumber(Math.round(averageOrderValue))}`,
            link: '/admin/orders',
            icon: '📊',
            trend: summary.aovTrend,
          },
          {
            title: 'Conversion Rate',
            value: `${conversionRate.toFixed(1)}%`,
            link: '/admin/analytics',
            icon: '📈',
            trend: summary.conversionTrend,
          },
          {
            title: 'Refunds',
            value: summary.refundsCount || 0,
            link: '/admin/refunds',
            icon: '🔄',
            trend: summary.refundsTrend,
          },
          {
            title: 'Out of Stock',
            value: summary.outOfStockCount || 0,
            link: '/admin/inventory',
            icon: '⚠️',
            trend: null,
          },
        ].map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Sales Trend">
            <Line data={chartDataConfig.sales} options={chartOptions} className="h-[350px]" />
          </ChartCard>
          <ChartCard title="Order Volume">
            <Line data={chartDataConfig.orders} options={chartOptions} className="h-[350px]" />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Product Distribution">
            <Doughnut
              data={chartDataConfig.products}
              options={chartOptions}
              className="h-[350px]"
            />
          </ChartCard>
          <ChartCard title="User Growth">
            <Bar data={chartDataConfig.users} options={chartOptions} className="h-[350px]" />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Payment Methods">
            <Pie
              data={chartDataConfig.paymentMethods}
              options={chartOptions}
              className="h-[350px]"
            />
          </ChartCard>
          <ChartCard title="Order Status">
            <Doughnut
              data={chartDataConfig.orderStatus}
              options={chartOptions}
              className="h-[350px]"
            />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <ChartCard title="Top Selling Products">
            <Bar
              data={chartDataConfig.topProducts}
              options={{
                ...chartOptions,
                indexAxis: 'y' as const,
              }}
              className="h-[400px]"
            />
          </ChartCard>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Activity */}
        <div className="bg-base-200 rounded-xl p-4 shadow-sm border border-base-300">
          <h3 className="text-lg font-semibold text-base-content mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {summary.recentActivity?.map((activity: any) => (
              <div key={activity._id} className="flex items-start pb-3 border-b border-base-300 last:border-0">
                <div className="bg-primary/10 p-2 rounded-lg mr-3">
                  {activity.type === 'order' && '🛒'}
                  {activity.type === 'user' && '👤'}
                  {activity.type === 'product' && '📦'}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.message}</p>
                  <p className="text-sm opacity-75">{new Date(activity.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/admin/activity" className="mt-3 inline-block text-sm font-medium underline opacity-90 hover:opacity-100">
            View all activity →
          </Link>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-error/10 rounded-xl p-4 shadow-sm border border-error/20">
          <h3 className="text-lg font-semibold text-base-content mb-4">Low Stock Alerts</h3>
          <div className="space-y-2">
            {summary.lowStockItems?.map((item: any) => (
              <Link
                href={`/admin/product/${item._id}`}
                key={item._id}
                className="flex justify-between items-center p-2 hover:bg-error/5 rounded-lg"
              >
                <span className="font-medium">{item.name}</span>
                <span className={`font-bold ${item.stock < 5 ? 'text-error' : 'text-warning'}`}>
                  {item.stock} left
                </span>
              </Link>
            ))}
            {(!summary.lowStockItems || summary.lowStockItems.length === 0) && (
              <p className="text-center py-4 text-sm opacity-75">No low stock items</p>
            )}
          </div>
          <Link href="/admin/inventory" className="mt-3 inline-block text-sm font-medium underline opacity-90 hover:opacity-100">
            Manage inventory →
          </Link>
        </div>
      </div>

      {/* Performance Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-base-200 p-4 rounded-xl shadow-sm border border-base-300">
          <h4 className="text-sm opacity-80">Monthly Comparison</h4>
          <div className="flex items-end mt-2">
            <p className="text-2xl font-bold mr-2">{summary.monthlyComparison || 0}%</p>
            <TrendIndicator value={summary.monthlyComparison || 0} />
          </div>
        </div>
        <div className="bg-base-200 p-4 rounded-xl shadow-sm border border-base-300">
          <h4 className="text-sm opacity-80">Yearly Comparison</h4>
          <div className="flex items-end mt-2">
            <p className="text-2xl font-bold mr-2">{summary.yearlyComparison || 0}%</p>
            <TrendIndicator value={summary.yearlyComparison || 0} />
          </div>
        </div>
        <div className="bg-base-200 p-4 rounded-xl shadow-sm border border-base-300">
          <h4 className="text-sm opacity-80">Customer Satisfaction</h4>
          <div className="flex items-end mt-2">
            <p className="text-2xl font-bold mr-2">{summary.satisfactionScore || 0}%</p>
            <TrendIndicator value={summary.satisfactionTrend || 0} />
          </div>
        </div>
        <div className="bg-base-200 p-4 rounded-xl shadow-sm border border-base-300">
          <h4 className="text-sm opacity-80">Repeat Customers</h4>
          <div className="flex items-end mt-2">
            <p className="text-2xl font-bold mr-2">{summary.repeatCustomerRate || 0}%</p>
            <TrendIndicator value={summary.repeatCustomerTrend || 0} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const StatCard = ({
  title,
  value,
  link,
  icon,
  trend,
}: {
  title: string;
  value: string | number;
  link: string;
  icon: string;
  trend?: number | null;
}) => (
  <Link
    href={link}
    className="rounded-box p-4 shadow-md bg-base-200 transition-transform hover:scale-[1.01] cursor-pointer"
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium opacity-90">{title}</p>
        <div className="flex items-end mt-2">
          <p className="text-3xl font-bold mr-2">{value}</p>
          {trend !== undefined && trend !== null && <TrendIndicator value={trend} />}
        </div>
      </div>
      <span className="text-5xl">{icon}</span>
    </div>
    <div className="mt-3 text-xs font-medium underline opacity-90 hover:opacity-100">
      View details →
    </div>
  </Link>
);

const TrendIndicator = ({ value }: { value: number }) => {
  const isPositive = value >= 0;
  return (
    <span className={`text-sm ${isPositive ? 'text-success' : 'text-error'}`}>
      {isPositive ? '↑' : '↓'} {Math.abs(value)}%
    </span>
  );
};

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl bg-base-200 p-4 shadow-sm border border-base-300">
    <h3 className="text-lg font-semibold text-base-content mb-4">{title}</h3>
    <div className="relative">{children}</div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex h-64 items-center justify-center">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="mx-4 mt-6 rounded-xl bg-error/10 p-4 text-center text-error">
    <p className="font-medium">Error loading dashboard data</p>
    <p className="text-sm mt-1">{message}</p>
  </div>
);

export default Dashboard;