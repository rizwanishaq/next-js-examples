"use client";

import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const NavBar = () => {
  const { user } = useUser();

  return (
    <header className="w-full border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-8 py-3 md:py-4">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="AI Agent Logo"
            width={48}
            height={48}
            className="hover:opacity-80 transition-opacity"
            priority
          />
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white select-none">
            AI Agent
          </span>
        </Link>

        {/* Navigation & User Actions */}
        <div className="flex items-center gap-5">
          {user ? (
            <>
              {/* User profile with dropdown */}
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-10 h-10 rounded-full",
                    userButtonTrigger: "focus:ring-2 focus:ring-sky-500 focus:outline-none",
                  },
                }}
              />

              {/* Dashboard Link */}
              <Link href="/dashboard" passHref>
                <Button
                  as="a"
                  className="hidden md:inline-flex cursor-pointer px-5 py-2 text-base font-semibold rounded-md
                             bg-sky-600 text-white hover:bg-sky-700 focus-visible:ring-2 focus-visible:ring-sky-500
                             transition-colors duration-200"
                >
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/sign-in" passHref>
              <Button
                as="a"
                className="px-5 py-2 text-base font-semibold rounded-md
                           bg-sky-600 text-white hover:bg-sky-700 focus-visible:ring-2 focus-visible:ring-sky-500
                           transition-colors duration-200"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
