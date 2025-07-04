"use client";

import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react"; // Import useState
import { Menu } from 'lucide-react'; // Import Menu icon

const NavBar = () => {
  const { user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-slate-950 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-opacity-80 dark:bg-opacity-80">
      <nav className="max-w-7xl mx-auto grid grid-cols-3 items-center px-6 md:px-8 py-3 md:py-4">
        {/* Left: Logo and Mobile Menu Button */}
        <div className="flex items-center">
          <button
            className="md:hidden mr-4 p-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <Menu size={24} />
          </button>
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="AI Agent Logo"
              width={48}
              height={48}
              className="hover:opacity-80 transition-opacity"
              priority
            />
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 select-none">
              AI Agent
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden md:flex justify-center items-center gap-6">
          <Link
            href="/blogs"
            className="text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary transition-colors"
          >
            Blogs
          </Link>
          <Link
            href="/projects"
            className="text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary transition-colors"
          >
            Projects
          </Link>
        </div>

        {/* Right: User / Login */}
        <div className="flex justify-end items-center gap-5">
          {user ? (
            <>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-10 h-10 rounded-full",
                    userButtonTrigger:
                      "focus:ring-2 focus:ring-primary focus:outline-none",
                  },
                }}
              />
              <Link href="/dashboard" passHref>
                <Button
                  as="a"
                  className="hidden md:inline-flex cursor-pointer px-5 py-2 text-base font-semibold rounded-full
                             bg-gradient-to-r from-primary to-purple-600 text-white hover:brightness-110 focus-visible:ring-2 focus-visible:ring-primary
                             transition duration-200"
                >
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/sign-in" passHref>
              <Button
                as="a"
                className="px-5 py-2 text-base font-semibold rounded-full
                           bg-gradient-to-r from-primary to-purple-600 text-white hover:brightness-110 focus-visible:ring-2 focus-visible:ring-primary
                           transition duration-200"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-t border-neutral-200 dark:border-neutral-800 py-4 px-6">
          <div className="flex flex-col gap-3">
            <Link
              href="/blogs"
              className="text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary transition-colors"
              onClick={toggleMobileMenu} // Close menu on link click
            >
              Blogs
            </Link>
            <Link
              href="/projects"
              className="text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary transition-colors"
              onClick={toggleMobileMenu} // Close menu on link click
            >
              Projects
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
