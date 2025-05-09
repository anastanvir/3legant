"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');
  if (isAdminRoute) return null;
  return (
    <footer className="footer bg-base-200 p-10 text-base-content">
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          <div className="footer-brand flex items-center justify-center sm:justify-start">
            <Link href="/" className="flex items-center">
              <img src="/Logo.svg" alt="GizMoz Logo" className="mr-2 h-8 invert" />
              {/* <span className='text-xl font-bold'>GizMoz</span> */}
            </Link>
          </div>
          <div className="footer-links mt-4 flex flex-wrap justify-center gap-6 sm:mt-0 sm:justify-end">
            <a href="#" className="link-hover link">
              About
            </a>
            <a href="#" className="link-hover link">
              Privacy Policy
            </a>
            <a href="#" className="link-hover link">
              Licensing
            </a>
            <a href="#" className="link-hover link">
              Contact
            </a>
          </div>
        </div>
        <div className="divider my-6  w-full border-b-white/20 "></div>
        <div className="footer-copyright w-full text-center">
          <p className="inline-block">
            © {new Date().getFullYear()}{' '}
            <a href="#" className="link-hover link">
              3legant.™
            </a>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
 