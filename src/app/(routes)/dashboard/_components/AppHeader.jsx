'use client';

import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const AppHeader = ({ toggleSidebar }) => {
  return (
    <header className="w-full shadow-sm bg-white md:ml-64 fixed top-0 left-0 right-0 z-30">
      <nav className="flex items-center justify-between px-6 py-4 md:px-8">
        {/* Mobile menu toggle button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-md bg-purple-600 text-white"
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Logo - visible only on larger screens if sidebar is hidden */}
        <Link href="/" className="hidden md:block">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} className="hover:opacity-80 transition-opacity" />
        </Link>

        {/* User Avatar */}
        <div className="flex items-center ml-auto">
          <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'rounded-full' } }} />
        </div>
      </nav>
    </header>
  );
};

export default AppHeader;
