// components/Navbar.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement | null>(null);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const user: any = session?.user;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse flex-nowrap"
        >
          <img
            src="/img/logo.png"
            className="h-16 w-16 md:h-16 md:w-16"
            alt="logo acc"
          />
          <span className="self-center text-lg md:text-2xl font-semibold whitespace-normal truncate dark:text-white">
            ADVANCED COMPUTER CLASSES
          </span>
        </Link>

        {/* Right side: Login / Logout + Admin + Mobile toggle */}
        <div className="flex items-center gap-3 md:order-2">
          {/* Admin button when admin logged in */}
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Admin Dashboard
            </Link>
          )}

          {/* Auth button */}
          {status === "authenticated" ? (
            <button
              onClick={() => signOut()}
              className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Logout
            </button>
          ) : (
            pathname !== "/login" &&
            pathname !== "/register" && (
              <Link
                href="/login"
                className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Login
              </Link>
            )
          )}

          {/* Mobile button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            isMobileMenuOpen ? "block" : "hidden"
          }`}
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                href="/"
                className={`block py-2 px-3 md:p-0 rounded-sm md:bg-transparent ${
                  pathname === "/"
                    ? "text-white bg-blue-700 md:text-blue-700 md:dark:text-blue-500"
                    : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700"
                }`}
              >
                HOME
              </Link>
            </li>

            <li>
              <Link
                href="/courses"
                className={`block py-2 px-3 md:p-0 rounded-sm ${
                  pathname === "/courses"
                    ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700"
                    : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700"
                }`}
              >
                COURSE
              </Link>
            </li>

            <li>
              <Link
                href="/blog"
                className={`block py-2 px-3 md:p-0 rounded-sm ${
                  pathname === "/blog"
                    ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700"
                    : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700"
                }`}
              >
                BLOG
              </Link>
            </li>

            <li>
              <Link
                href="/contact"
                className={`block py-2 px-3 md:p-0 rounded-sm ${
                  pathname === "/contact"
                    ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700"
                    : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700"
                }`}
              >
                CONTACT
              </Link>
            </li>

            {/* Typing dropdown */}
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
              >
                TYPING
                <svg
                  className="w-2.5 h-2.5 ml-2.5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-blue-600 dark:divide-gray-600">
                  <ul className="py-2 text-sm text-gray-700 dark:text-white">
                    <li>
                      <Link
                        href="/typing/english"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        English Typing
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/typing/hindi"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Hindi Typing
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </li>

            {/* Mobile: Admin + Login/Logout */}
            {isAdmin && (
              <li className="md:hidden">
                <Link
                  href="/admin/dashboard"
                  className="block py-2 px-3 rounded-sm text-white bg-green-600 hover:bg-green-700"
                >
                  Admin Dashboard
                </Link>
              </li>
            )}

            {status === "authenticated" ? (
              <li className="md:hidden">
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left py-2 px-3 rounded-sm text-white bg-red-600 hover:bg-red-700"
                >
                  Logout
                </button>
              </li>
            ) : (
              pathname !== "/login" &&
              pathname !== "/register" && (
                <li className="md:hidden">
                  <Link
                    href="/login"
                    className="block py-2 px-3 rounded-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Login
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;