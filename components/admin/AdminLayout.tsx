import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Settings,
  ChevronDown,
  Menu,
  PanelTop,
} from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { signOut } from '@/lib/auth';

async function checkNewItems(type: 'orders' | 'users') {
  const res = await fetch(`/api/admin/new-${type}`);
  const data = await res.json();
  return data.hasNewItems;
}

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: <LayoutDashboard size={20} />,
    key: 'dashboard',
  },
  {
    label: 'Orders',
    href: '/admin/orders',
    icon: <ShoppingCart size={20} />,
    key: 'orders',
  },
  {
    label: 'Products',
    href: '/admin/products',
    icon: <Package size={20} />,
    key: 'products',
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: <Users size={20} />,
    key: 'users',
  },
];

const AdminLayout = async ({
  activeItem = 'dashboard',
  children,
}: {
  activeItem: string;
  children: React.ReactNode;
}) => {
  const session = await auth();

  if (!session || !session?.user?.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-100 p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-error">Unauthorized Access</h1>
          <p className="mt-2 text-base-content/80">Admin permissions required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-base-100">
      {/* Desktop Sidebar - Sticky and full height */}
      <div className="hidden h-screen w-64 flex-shrink-0 sticky top-0 md:block border-r border-base-300">
        <div className="flex h-full flex-col">
          {/* Sidebar Header with Logo */}
          <div className="p-4 border-b border-base-300 flex items-center justify-between">
            <Link href="/admin/dashboard">
              <img src="/Logo.svg" alt="logo" className="invert w-36" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-box  p-3 text-base-content transition-colors hover:bg-base-300 ${activeItem === item.key
                      ? 'text-white font-semibold bg-base-300 rounded-lg'
                      : 'hover:text-base-content rounded-lg'
                      }`}
                  >
                    <span className="text-base-content/70">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Account Settings */}
          <div className="p-4 border-t border-base-300">
            <div className="dropdown dropdown-top dropdown-end w-full">
              <label tabIndex={0} className="cursor-pointer">
                <div className="flex items-center justify-center gap-3 w-full h-full hover:bg-base-300 p-2 rounded-box transition-colors">
                  <div className="avatar placeholder">
                    <div className="w-8 rounded-full bg-neutral flex justify-center items-center text-center text-neutral-content pt-1">
                      <span className="text-base  text-center">
                        {session.user?.name?.charAt(0).toUpperCase() || 'A'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-base-content">
                      {session.user?.name || 'Admin'}
                    </p>
                    <p className="text-xs text-base-content/60 truncate">{session.user?.email}</p>
                  </div>
                  <ChevronDown size={16} className="text-base-content/70" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52 mb-2"
              >
                <li>
                  <Link href="/admin/settings">
                    <Settings size={16} />
                    Account Settings
                  </Link>
                </li>
                <li>
                  <form
                    action={async () => {
                      'use server';
                      await signOut({ redirectTo: '/signin' });
                    }}
                  >
                    <button type="submit" className="flex gap-2">
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </form>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Top Navbar */}
        <div className="flex md:hidden items-center justify-between p-4 border-b border-base-300 bg-base-100 sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <Link href="/admin/dashboard">
              <img src="/Logo.svg" alt="logo" className="invert h-8" />
            </Link>
            <h1 className="text-lg font-semibold capitalize ml-2">{activeItem}</h1>
          </div>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <Menu size={20} />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52 mt-2"
            >
              <li>
                <Link href="/">
                  <PanelTop size={16} />
                  Back to Store
                </Link>
              </li>
              <li>
                <Link href="/admin/settings">
                  <Settings size={16} />
                  Settings
                </Link>
              </li>
              <li>
                <form
                  action={async () => {
                    'use server';
                    await signOut({ redirectTo: '/signin' });
                  }}
                >
                  <button type="submit" className="flex items-center gap-3">
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </form>
              </li>
            </ul>
          </div>
        </div>

        {/* Desktop Top Navbar */}
        <div className="hidden md:flex items-center w-full sticky top-0 h-16 justify-between px-4 border-b border-base-300 bg-black/70 backdrop-blur-md z-40">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold capitalize">{activeItem}</h1>
          </div>
          <div className="flex items-center gap-4">
            <li className="list-none">
              <Link href="/" className="btn btn-ghost btn-sm">
                <PanelTop size={16} />
                Back to Store
              </Link>
            </li>
            <button className="btn btn-ghost btn-sm">
              <Settings size={18} />
              <span className="hidden sm:inline">Settings</span>
            </button>

            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/signin' });
              }}
            >
              <button type="submit" className="btn btn-ghost btn-sm">
                <LogOut size={18} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </form>
          </div>
        </div>

        {/* Page Content */}
        <div className=" pb-16 max-w-full flex-1 md:pb-0 overflow-auto">
          <div className="p-4 md:p-6">{children}</div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-base-300 bg-base-200 shadow-lg md:hidden m-2 rounded-box">
        <ul className="flex">
          {navItems.map((item) => (
            <li key={item.key} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center py-3 text-xs ${activeItem === item.key ? 'text-white' : 'text-base-content/70'
                  }`}
              >
                <span className="mb-1">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminLayout;
