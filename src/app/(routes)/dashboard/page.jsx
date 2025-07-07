'use client'
import React, { useState, useEffect } from "react";

import AddNewSessionDialog from "./_components/AddNewSessionDialog";
import HistoryList from "./_components/HistoryList";
import DoctorList from "./_components/DoctorList";
import { Home, Calendar as CalendarIcon, MessageSquare, User, Settings, CreditCard, Clock, Menu } from 'lucide-react';
import { PricingTable, UserButton, useUser } from '@clerk/nextjs';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const allLinks = [
  { name: "Home", key: "home", icon: Home },
  { name: "Appointments", key: "appointments", icon: CalendarIcon },
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
        className={`fixed top-0 left-0 bottom-0 w-64 bg-card text-foreground
                   flex flex-col justify-between shadow-lg z-50 border-r border-border
                   transform transition-transform duration-300 ease-out
                   ${isOpen ? "translate-x-0" : "-translate-x-full"}
                   md:translate-x-0 md:flex`}
      >
        <div className="flex flex-col h-full">
          {/* Adjusted padding-top to align with main NavBar */}
          {/* Added flex and items-center to mimic the NavBar's logo alignment */}
          <div className="flex items-center px-4 py-4 h-16">
            <button
              className="md:hidden mr-4 p-2 rounded-md text-slate-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={toggleSidebar}
              aria-label="Toggle mobile menu"
            >
              <Menu size={24} />
            </button>
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

          <div className="flex items-center px-4 py-4 border-b border-border bg-muted">
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'h-9 w-9' } }} />
            <span className="ml-3 text-muted-foreground font-medium">Manage Account</span>
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
                    ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-inner"
                    : "text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-50"
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
                        ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-inner"
                      : "text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-50"
                    }`}
                    aria-current={active === key ? "page" : undefined}
                  >
                    {Icon && <Icon className="h-5 w-5" />}
                    <span>{name}</span>
                  </button>
                </li>
              ))}
            </ul>
            
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

  const [value, onChange] = useState(new Date());
  const [appointments, setAppointments] = useState([
    { doctor: "Dr. Emily White", type: "Dental Check-up", date: "Tomorrow", time: "10:00 AM" },
    { doctor: "Dr. John Smith", type: "General Consultation", date: "July 15", time: "2:30 PM" },
    { doctor: "Dr. Sarah Lee", type: "Follow-up Session", date: "July 20", time: "11:00 AM" },
  ]);

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
            <div className="flex justify-between items-center mb-4 pr-4">
              <h2 className="font-extrabold text-4xl text-gray-800">My Dashboard</h2>
              
            </div>
            <div className="text-center py-6 border border-gray-200 rounded-lg bg-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="text-gray-700 mb-4">You haven't started any consultations yet.</p>
              <Button
                onClick={openAddSessionDialog}
                className="cursor-pointer px-4 py-2 text-base font-semibold rounded-md
                           bg-gradient-to-r from-primary to-purple-600 text-white hover:brightness-110 focus-visible:ring-2 focus:ring-primary
                           transition duration-200 shadow-md flex items-center justify-center mx-auto space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Consult with Doctor</span>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <h3 className="font-semibold text-lg mb-2">Recent Activity</h3>
                <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <h3 className="font-semibold text-lg mb-2">Upcoming Events</h3>
                <p className="text-gray-700">Curabitur pretium tincidunt lacus. Nulla facilisi. Aenean feugiat, purus sit amet laoreet facilisis, libero ex mollis nisi, id fringilla nulla libero in libero. Nullam consectetur, magna eu semper lacinia, felis lorem facilisis metus, sed consectetur nunc libero sit amet justo.</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <h3 className="font-semibold text-lg mb-2">More Content</h3>
                <p className="text-gray-700">Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Proin eget tortor risus. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.</p>
              </div>
              <div className="col-span-full bg-card p-6 rounded-lg shadow-lg">
                <HistoryList />
              </div>
              <div className="col-span-full bg-card p-6 rounded-lg shadow-lg">
                <DoctorList />
              </div>
            </div>
          </>
        );
      case "appointments":
        return (
          <div className="pt-4 md:pt-8 px-4 md:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Appointments</h1>
            <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8 flex justify-center">
              <Calendar className="w-full max-w-md" onChange={onChange} value={value} />
            </div>
            <p className="text-gray-700 mt-6 text-center">Select a date to view your appointments.</p>
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming Appointments</h3>
              <div className="space-y-4">
                {appointments.length > 0 ? (
                  appointments.map((appointment, index) => (
                    <div key={index} className="bg-card p-4 rounded-xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between transition-all duration-200 hover:shadow-md">
                      <div className="flex items-center space-x-3 mb-2 md:mb-0">
                        <User className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-semibold text-lg">{appointment.doctor}</p>
                          <p className="text-gray-600 text-sm">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <p className="text-gray-600 text-sm">{appointment.date} {appointment.time}</p>
                        <Button className="bg-gradient-to-r from-primary to-purple-600 text-white hover:brightness-110 focus-visible:ring-2 focus-visible:ring-primary transition duration-200">View Details</Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No upcoming appointments found.</p>
                    <p>Schedule a new consultation to get started!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case "messages":
        return <p className="text-gray-700">Your messages from doctors and staff.</p>;
      case "profile":
        return (
          <div className="pt-4 md:pt-8 px-4 md:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
            <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                {user.imageUrl && (
                  <div className="relative">
                    <img
                      src={user.imageUrl}
                      alt="User Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg shadow-primary/20"
                    />
                    <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-colors shadow-md">
                      <User className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold text-gray-800">{user.fullName || "N/A"}</h2>
                  <p className="text-lg text-gray-500 mt-1">{user.primaryEmailAddress?.emailAddress || "N/A"}</p>
                  <div className="mt-4 flex justify-center md:justify-start gap-2">
                    <span className="inline-block bg-secondary text-secondary-foreground text-xs font-semibold px-2.5 py-0.5 rounded-full">{user.publicMetadata?.plan || "Free Plan"}</span>
                  </div>
                </div>
                <div className="md:ml-auto">
                  <Link href="/user" passHref>
                  <Button className="bg-gradient-to-r from-primary to-purple-600 text-white hover:brightness-110 focus-visible:ring-2 focus-visible:ring-primary transition duration-200">
                    Edit Profile
                  </Button>
                </Link>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Account Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-card p-4 rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-gray-500">Account Created</p>
                    <p className="text-lg font-semibold text-gray-800">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
                  </div>
                  <div className="bg-card p-4 rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-gray-500">Last Sign-in</p>
                    <p className="text-lg font-semibold text-gray-800">{user.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : "N/A"}</p>
                  </div>
                  <div className="bg-card p-4 rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-gray-500">Operating System</p>
                    <p className="text-lg font-semibold text-gray-800">{os}</p>
                  </div>
                  <div className="bg-card p-4 rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-gray-500">Browser</p>
                    <p className="text-lg font-semibold text-gray-800">{browser}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Manage Account</h3>
                  <div className="flex flex-col md:flex-row gap-4">
                      <Link href="/user/account" passHref>
                        <Button className="justify-start bg-gradient-to-r from-primary to-purple-600 text-white hover:brightness-110 focus-visible:ring-2 focus-visible:ring-primary transition duration-200">
                            <Settings className="mr-2 h-4 w-4" />
                            Go to Settings
                        </Button>
                      </Link>
                      <Link href="/user/billing" passHref>
                        <Button className="justify-start bg-gradient-to-r from-primary to-purple-600 text-white hover:brightness-110 focus-visible:ring-2 focus-visible:ring-primary transition duration-200">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Manage Billing
                        </Button>
                      </Link>
                  </div>
              </div>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="pt-4 md:pt-8 px-4 md:px-8">
            <h2 className="font-extrabold text-3xl text-gray-800 mb-6">Application Settings</h2>
            <p className="text-gray-700 text-lg">This section is where you can configure various application settings, preferences, and integrations.</p>
            {/* Future settings components will go here */}
          </div>
        );
      case "billing":
        return (
          <div className="pt-4 md:pt-8 px-4 md:px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Billing & Plans</h1>
            <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8">
              <p className="text-gray-700 mb-6">
                Here you can manage your subscription, view your current plan, and explore other available options.
              </p>
              <div className="mb-8">
                <PricingTable />
              </div>
              <div className="mt-8 border-t border-gray-200 pt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Manage Your Subscription</h3>
                <p className="text-gray-700 mb-4">
                  If you need to update your payment method, change your plan, or cancel your subscription, you can do so through your Clerk account.
                </p>
                <Link href="/user" passHref>
                  <Button className="bg-gradient-to-r from-primary to-purple-600 text-white hover:brightness-110 focus-visible:ring-2 focus-visible:ring-primary transition duration-200">
                    Go to Billing Portal
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        );
      default:
        return <p className="text-gray-700">Select an option from the sidebar.</p>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      

      <Sidebar active={activePage} setActive={setActivePage} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area needs margin-left on medium and larger screens */}
      {/* Since the NavBar has a height, we also need to add padding-top to the main content
          to prevent it from going under the fixed NavBar. */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto overflow-auto md:ml-64 pt-8 md:pt-8">
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