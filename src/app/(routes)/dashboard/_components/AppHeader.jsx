'use client';

import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const NAV_ITEMS = [
  { id: 1, name: 'Home', href: '/home' },
  { id: 2, name: 'History', href: '/history' },
  { id: 3, name: 'Pricing', href: '/pricing' },
  { id: 4, name: 'Profile', href: '/profile' },
];

const Header = () => {
  return (
    <header className="w-full shadow-sm bg-white">
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 lg:px-24">
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} className="hover:opacity-80 transition-opacity" />
        </Link>

        {/* Navigation */}
        <ul className="hidden md:flex gap-10 items-center text-sm font-medium text-gray-700">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="hover:text-black transition-colors duration-200"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* User Avatar */}
        <div className="flex items-center">
          <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'rounded-full' } }} />
        </div>
      </nav>
    </header>
  );
};

export default Header;
