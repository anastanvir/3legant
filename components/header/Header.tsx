'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Moon, ShoppingCart, Sun, X, AlignJustify } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import useSWR from 'swr';

import useCartService from '@/lib/hooks/useCartStore';
import useLayoutService from '@/lib/hooks/useLayout';

import { SearchBox } from './SearchBox';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const router = useRouter();
  const { items } = useCartService();
  // const { theme, toggleTheme } = useLayoutService();
  const { data: session } = useSession();
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  const { data: categories, error, isLoading } = useSWR('/api/products/categories');

  if (isAdminRoute) return null;

  const toggleMenu = () => setIsOpen(!isOpen);

  const signOutHandler = () => {
    signOut({ callbackUrl: '/signin' });
  };

  if (error) return <div>Failed to load categories</div>;

  return (
    <>
      <div className='bg-base-300 p-2 text-center text-sm'>
        Enjoy Free Nationwide Delivery Across Pakistan – Fast, Reliable, and Hassle-Free.
      </div>
      <header className="sticky top-0 z-50">
        <nav className="bg-base-300 shadow-sm">
          {/* Main Navbar */}
          <div className="navbar max-w-full mx-auto px-4 py-4">
            {/* Logo */}
            <div className="flex-1">
              <Link href="/" className="font-serif text-2xl font-bold">
                <img src="/Logo.svg" alt="logo" className='invert w-36' />
              </Link>
            </div>

            {/* Desktop Search (hidden on mobile) */}
            <div className="hidden md:flex justify-center md:w-1/3">
              <div className="w-full max-w-lg">
                <SearchBox />
              </div>
            </div>

            {/* Main Menu Items (hidden on mobile) */}
            <div className="flex items-center justify-end md:w-1/3">
              {/* Desktop Menu */}
              <div className="hidden md:flex">
                <Menu />
              </div>
            </div>

            {/* Mobile Menu and Cart (visible on mobile) */}
            <div className="flex md:hidden items-center gap-2">
              {/* Mobile Cart Icon */}
              <Link href="/cart" className="relative">
                <ShoppingCart size={26} />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 badge badge-error badge-xs">
                    {items.reduce((a, c) => a + c.qty, 0)}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button (Hamburger) */}
              <button onClick={toggleMenu} className="btn btn-square btn-ghost">
                {isOpen ? <X size={24} /> : <AlignJustify size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Search (visible on mobile) */}
          <div className="md:hidden px-4 pb-3">
            <SearchBox />
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex justify-center bg-base-200 py-2">
            <div className="flex items-center gap-4 text-base">
              <Link href="/" className="btn btn-ghost btn-md">
                Home
              </Link>

              {/* Products with Categories Dropdown */}
              <div className="dropdown dropdown-hover">
                <label tabIndex={0} className="btn btn-ghost btn-md">
                  Products
                  <ChevronDown size={16} className="ml-1" />
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <li key={i}><div className="h-4 w-full bg-base-200 rounded animate-pulse"></div></li>
                    ))
                  ) : (
                    categories?.map((cat: string) => (
                      <li key={cat}>
                        <Link href={`/search?category=${cat}`}>
                          {cat}
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <Link href="/blogs" className="btn btn-ghost btn-md">
                Blogs
              </Link>
              <Link href="/about" className="btn btn-ghost btn-md">
                About
              </Link>
              <Link href="/contact" className="btn btn-ghost btn-md">
                Contact
              </Link>
            </div>
          </div>

          {/* Mobile Drawer */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 left-0 w-64 bg-base-100 shadow-lg md:hidden z-50"
              >
                <div className="h-full overflow-y-auto p-4">
                  <div className="flex justify-end mb-4">
                    <button onClick={toggleMenu} className="btn btn-circle btn-ghost btn-sm">
                      <X size={20} />
                    </button>
                  </div>

                  {/* Mobile Main Navigation - Simple List */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Navigation</h3>
                    <div className="flex flex-col gap-2">
                      <Link href="/" className="btn btn-ghost justify-start" onClick={toggleMenu}>
                        Home
                      </Link>
                      <Link href="/products" className="btn btn-ghost justify-start" onClick={toggleMenu}>
                        Products
                      </Link>
                      {!isLoading && categories?.map((cat: string) => (
                        <Link
                          key={cat}
                          href={`/search?category=${cat}`}
                          className={`btn btn-ghost justify-start pl-8 ${category === cat ? 'bg-base-300' : ''}`}
                          onClick={toggleMenu}
                        >
                          {cat}
                        </Link>
                      ))}
                      <Link href="/blogs" className="btn btn-ghost justify-start" onClick={toggleMenu}>
                        Blogs
                      </Link>
                      <Link href="/about" className="btn btn-ghost justify-start" onClick={toggleMenu}>
                        About
                      </Link>
                      <Link href="/contact" className="btn btn-ghost justify-start" onClick={toggleMenu}>
                        Contact
                      </Link>
                    </div>
                  </div>

                  {/* Mobile Menu */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Account</h3>
                    <ul className="space-y-2">
                      {session ? (
                        <>
                          {session?.user?.isAdmin && (
                            <li>
                              <Link
                                href="/admin/dashboard"
                                className="btn btn-ghost justify-start w-full"
                                onClick={toggleMenu}
                              >
                                Admin Dashboard
                              </Link>
                            </li>
                          )}
                          <li>
                            <Link
                              href="/order-history"
                              className="btn btn-ghost justify-start w-full"
                              onClick={toggleMenu}
                            >
                              Order History
                            </Link>
                          </li>
                          <li>
                            <Link
                              href="/profile"
                              className="btn btn-ghost justify-start w-full"
                              onClick={toggleMenu}
                            >
                              Profile
                            </Link>
                          </li>
                          <li>
                            <button
                              className="btn btn-ghost justify-start w-full"
                              onClick={() => {
                                toggleMenu();
                                signOutHandler();
                              }}
                            >
                              Sign Out
                            </button>
                          </li>
                        </>
                      ) : (
                        <li>
                          <button
                            className="btn btn-ghost justify-start w-full"
                            onClick={() => {
                              toggleMenu();
                              signIn();
                            }}
                          >
                            Sign In
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overlay */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 md:hidden"
                onClick={toggleMenu}
              />
            )}
          </AnimatePresence>
        </nav>
      </header>
    </>
  );
};

const Menu = () => {
  const { items, init } = useCartService();
  const { data: session } = useSession();
  // const { theme, toggleTheme } = useLayoutService();

  const signOutHandler = () => {
    signOut({ callbackUrl: '/signin' });
    init();
  };

  const handleClick = () => {
    (document.activeElement as HTMLElement).blur();
  };

  return (
    <div className="flex items-center gap-4">
      <ul className="flex items-center gap-4">
        <li>
          <Link href="/cart" className="relative" aria-label="Shopping Cart">
            <ShoppingCart size={20} />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 badge badge-error badge-xs">
                {items.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>
        </li>
        {session ? (
          <li>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost">
                {session?.user?.name}
                <ChevronDown size={16} className="ml-1" />
              </label>
              <ul
                tabIndex={0}
                className="menu dropdown-content z-[1] mt-2 p-2 shadow bg-base-100 rounded-box w-52"
              >
                {session?.user?.isAdmin && (
                  <li onClick={handleClick}>
                    <Link href="/admin/dashboard">Admin Dashboard</Link>
                  </li>
                )}
                <li onClick={handleClick}>
                  <Link href="/order-history">Order History</Link>
                </li>
                <li onClick={handleClick}>
                  <Link href="/profile">Profile</Link>
                </li>
                <li onClick={handleClick}>
                  <button type="button" onClick={signOutHandler}>
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </li>
        ) : (
          <li>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => signIn()}
            >
              Sign In
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Header;