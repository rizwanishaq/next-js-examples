'use client'
import React, { useState, useEffect } from "react";
import AppHeader from "./_components/AppHeader";
import AddNewSessionDialog from "./_components/AddNewSessionDialog";
import HistoryList from "./_components/HistoryList";
import DoctorList from "./_components/DoctorList";
import { Home, Calendar, MessageSquare, User, Settings, CreditCard } from 'lucide-react';
import { UserButton, useUser } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const allLinks = [
  { name: "Home", key: "home", icon: Home },
  { name: "Appointments", key: "appointments", icon: Calendar },
  { name: "Messages", key: "messages", icon: MessageSquare },
];

const accountLinks = [
  { name: "Profile", key: "profile", icon: User },
  { name: "Settings", key: "settings", icon: Settings },
  { name: "Billing", key: "billing", icon: CreditCard },
];

const Sidebar = ({ active, setActive, isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile Sidebar Overlay (visible when sidebar is open on small screens) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar - Responsive Design */}
      <nav
        className={`fixed top-[72px] left-0 bottom-0 w-64 bg-gray-50 text-gray-900
                   flex flex-col justify-between shadow-xl z-50 border-r border-gray-200
                   transform transition-transform duration-300 ease-out
                   ${isOpen ? "translate-x-0" : "-translate-x-full"}
                   md:translate-x-0 md:flex`}
      >
        <div className="flex flex-col h-full">
          {/* Adjusted padding-top to align with main NavBar */}
          {/* Added flex and items-center to mimic the NavBar's logo alignment */}
          <div className="flex items-center px-4 py-4" style={{ minHeight: '64px' }}>
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="AI Agent Logo"
                width={32}
                height={32}
                className="hover:opacity-80 transition-opacity"
                priority
              />
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 select-none">
                AI Agent
              </span>
            </Link>
          </div>

          <ul className="flex-grow px-2 mt-6">
            {allLinks.map(({ name, key, icon: Icon }) => (
              <li key={key} className="mb-1">
                <button
                  onClick={() => {
                    setActive(key);
                    if (isOpen) toggleSidebar();
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-3
                    ${active === key
                      ? "bg-blue-600 text-white font-semibold shadow-md shadow-inner"
                      : "text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
                    }`}
                  aria-current={active === key ? "page" : undefined}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  <span>{name}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="px-2 mt-auto mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Account</h3>
            <ul className="mb-2">
              {accountLinks.map(({ name, key, icon: Icon }) => (
                <li key={key} className="mb-1">
                  <button
                    onClick={() => {
                      setActive(key);
                      if (isOpen) toggleSidebar();
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-3
                      ${active === key
                        ? "bg-blue-600 text-white font-semibold shadow-md shadow-inner"
                        : "text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
                      }`}
                    aria-current={active === key ? "page" : undefined}
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                    <span>{name}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex items-center px-3 py-2 rounded-lg bg-gray-100">
              <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'h-8 w-8' } }} />
              <span className="ml-3 text-gray-700 font-medium">Manage Account</span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

const Dashboard = () => {
  const [activePage, setActivePage] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddSessionDialogOpen, setIsAddSessionDialogOpen] = useState(false);
  const { user, isLoaded } = useUser();

  const [os, setOs] = useState("N/A");
  const [browser, setBrowser] = useState("N/A");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userAgent = navigator.userAgent;
      let detectedOs = "Unknown OS";
      let detectedBrowser = "Unknown Browser";

      // Detect OS
      if (userAgent.includes("Win")) detectedOs = "Windows";
      else if (userAgent.includes("Mac")) detectedOs = "macOS";
      else if (userAgent.includes("Linux")) detectedOs = "Linux";
      else if (userAgent.includes("Android")) detectedOs = "Android";
      else if (userAgent.includes("iOS")) detectedOs = "iOS";
      setOs(detectedOs);

      // Detect Browser
      if (userAgent.includes("Firefox")) detectedBrowser = "Firefox";
      else if (userAgent.includes("SamsungBrowser")) detectedBrowser = "Samsung Internet";
      else if (userAgent.includes("Opera") || userAgent.includes("Opr")) detectedBrowser = "Opera";
      else if (userAgent.includes("Edge")) detectedBrowser = "Edge";
      else if (userAgent.includes("Chrome")) detectedBrowser = "Chrome";
      else if (userAgent.includes("Safari")) detectedBrowser = "Safari";
      setBrowser(detectedBrowser);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openAddSessionDialog = () => {
    setIsAddSessionDialogOpen(true);
  };

  const closeAddSessionDialog = () => {
    setIsAddSessionDialogOpen(false);
  };

  const renderContent = () => {
    switch (activePage) {
      case "home":
        return (
          <>
            <div className="flex justify-between items-center mb-6 pr-4">
              <h2 className="font-extrabold text-4xl text-gray-800">My Dashboard</h2>
              <Button
                onClick={openAddSessionDialog}
                className="hidden md:inline-flex cursor-pointer px-5 py-2 text-base font-semibold rounded-full
                           bg-gradient-to-r from-blue-700 to-purple-600 text-white hover:brightness-110 focus-visible:ring-2 focus-visible:ring-blue-500
                           transition duration-200 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Consult with Doctor</span>
              </Button>
            </div>
            <div className="text-center py-12 border border-gray-200 rounded-lg bg-white mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="text-gray-700 mb-4">You haven't started any consultations yet.</p>
              <Button
                onClick={openAddSessionDialog}
                className="cursor-pointer px-4 py-2 text-base font-semibold rounded-md
                           bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:brightness-110 focus-visible:ring-2 focus:ring-blue-500
                           transition duration-200 shadow-md flex items-center justify-center mx-auto space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Consult with Doctor</span>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">Recent Activity</h3>
                <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">Upcoming Events</h3>
                <p className="text-gray-700">Curabitur pretium tincidunt lacus. Nulla facilisi. Aenean feugiat, purus sit amet laoreet facilisis, libero ex mollis nisi, id fringilla nulla libero in libero. Nullam consectetur, magna eu semper lacinia, felis lorem facilisis metus, sed consectetur nunc libero sit amet justo.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">More Content</h3>
                <p className="text-gray-700">Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Proin eget tortor risus. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.</p>
              </div>
              <div className="col-span-full bg-white p-6 rounded-lg shadow-md">
                <HistoryList />
              </div>
              <div className="col-span-full bg-white p-6 rounded-lg shadow-md">
                <DoctorList />
              </div>
            </div>
          </>
        );
      case "appointments":
        return <p className="text-gray-700">Your upcoming and past appointments.</p>;
      case "messages":
        return <p className="text-gray-700">Your messages from doctors and staff.</p>;
      case "profile":
        return (
          <div className="flex flex-col items-center justify-center py-10 bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="font-extrabold text-4xl text-gray-800 mb-8">Welcome, {user?.firstName || "User"}!</h2>
            {!isLoaded ? (
              <p className="text-gray-700 text-lg">Loading profile data...</p>
            ) : user ? (
              <div className="text-center w-full space-y-6">
                {user.imageUrl && (
                  <img
                    src={user.imageUrl}
                    alt="User Profile"
                    className="w-40 h-40 rounded-full object-cover mx-auto shadow-xl border-4 border-blue-600 transform transition-transform duration-300 hover:scale-105"
                  />
                )}
                <div className="space-y-2">
                  <p className="text-4xl font-extrabold text-gray-900 leading-tight">{user.fullName || "N/A"}</p>
                  <p className="text-xl text-gray-700 font-medium">{user.primaryEmailAddress?.emailAddress || "N/A"}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left pt-4 border-t border-gray-200 mt-6">
                  {user.createdAt && (
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <p className="text-sm font-semibold text-gray-600">Account Created:</p>
                      <p className="text-base text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  )}
                  {user.lastSignInAt && (
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <p className="text-sm font-semibold text-gray-600">Last Sign-in:</p>
                      <p className="text-base text-gray-800">{new Date(user.lastSignInAt).toLocaleString()}</p>
                    </div>
                  )}
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-gray-600">Operating System:</p>
                    <p className="text-base text-gray-800">{os}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <p className="text-sm font-semibold text-gray-600">Browser:</p>
                    <p className="text-base text-gray-800">{browser}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 text-lg">No user data available.</p>
            )}
          </div>
        );
      case "settings":
        return (
          <div className="py-10">
            <h2 className="font-extrabold text-3xl text-gray-800 mb-6">Application Settings</h2>
            <p className="text-gray-700 text-lg">This section is where you can configure various application settings, preferences, and integrations.</p>
            {/* Future settings components will go here */}
          </div>
        );
      case "billing":
        return <p className="text-gray-700">View your billing history and payment methods.</p>;
      default:
        return <p className="text-gray-700">Select an option from the sidebar.</p>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AppHeader toggleSidebar={toggleSidebar} />

      <Sidebar active={activePage} setActive={setActivePage} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area needs margin-left on medium and larger screens */}
      {/* Since the NavBar has a height, we also need to add padding-top to the main content
          to prevent it from going under the fixed NavBar. */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto overflow-auto md:ml-64 pt-[72px] md:pt-[136px]">
        {renderContent()}
      </main>

      <AddNewSessionDialog
        isOpen={isAddSessionDialogOpen}
        onClose={closeAddSessionDialog}
      />
    </div>
  );
};

export default Dashboard;