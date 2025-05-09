import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

import DrawerButton from '@/components/DrawerButton';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import Providers from '@/components/Providers';
import Sidebar from '@/components/Sidebar';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: '3legant.',
  description:
    'Discover the latest gadgets and tech essentials at 3legant. Shop cutting-edge electronics, smart devices, and accessories with unbeatable prices. Upgrade your tech game today!',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={`${poppins.className} flex min-h-screen flex-col`}>
        <Providers>
          {/* <ThemeEnforcer/> */}
          <div className="drawer">
            <DrawerButton />
            <div className="drawer-content flex min-h-screen flex-col">
              {/* Header (top) */}
              <Header />

              {/* Main content (fills remaining space) */}
              <main className="flex-grow">{children}</main>

              {/* Footer (bottom) */}
              <Footer />
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <Sidebar />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
