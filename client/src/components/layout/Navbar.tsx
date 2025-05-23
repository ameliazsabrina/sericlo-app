"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Disclosure, Menu } from "@headlessui/react";
import { FiMenu, FiX, FiShoppingCart, FiShoppingBag } from "react-icons/fi";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

const navigation = [
  { name: "Marketplace", href: "/marketplace", hasDropdown: true },
  { name: "Donate", href: "/donate" },
  { name: "Education", href: "/education" },
  { name: "AI Redesign", href: "/ai-redesign" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<{
    id: string | null;
    avatar: string | null;
    signedIn: boolean;
  }>({
    id: null,
    avatar: null,
    signedIn: false,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session?.user) {
          const userData = session.user;
          setUser({
            id: userData.id,
            avatar: userData.user_metadata?.avatar_url || "/default-avatar.jpg",
            signedIn: true,
          });
        } else {
          setUser({ id: null, avatar: null, signedIn: false });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser({ id: null, avatar: null, signedIn: false });
      }
    };

    fetchUser();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            avatar:
              session.user.user_metadata?.avatar_url || "/default-avatar.jpg",
            signedIn: true,
          });
        } else {
          setUser({ id: null, avatar: null, signedIn: false });
        }
      }
    );

    const handleScroll = () => {
      if (window.scrollY > 2) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const scrollToFooter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute("href");
    if (href && href.startsWith("#")) {
      e.preventDefault();
      const elem = document.getElementById(href.substring(1));
      if (elem) {
        window.scrollTo({
          top: elem.offsetTop,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <Disclosure
      as="nav"
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      {({ open }) => (
        <>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:bg-secondary hover:bg-opacity-10 focus:outline-none">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <FiX className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <FiMenu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/" className="flex items-center">
                    <Image
                      src="/logo.png"
                      alt="Sericlo Logo"
                      width={32}
                      height={32}
                      className="w-8 h-8 sm:w-10 sm:h-10"
                    />
                  </Link>
                </div>
              </div>

              <div className="hidden sm:block sm:ml-6">
                <div className="flex space-x-1 md:space-x-4">
                  {navigation.map((item) =>
                    item.hasDropdown ? (
                      <Menu as="div" className="relative" key={item.name}>
                        <Menu.Button className="px-2 md:px-3 py-2 text-sm font-medium text-primary hover:text-secondary focus:outline-none flex items-center">
                          {item.name}
                        </Menu.Button>

                        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  href={item.href}
                                  className={`${
                                    active
                                      ? "bg-gray-50 text-secondary"
                                      : "text-gray-700"
                                  } group flex items-center px-4 py-2 text-sm transition`}
                                >
                                  <FiShoppingBag
                                    className="mr-3 h-4 w-4 text-gray-500 group-hover:text-secondary"
                                    aria-hidden="true"
                                  />
                                  Lihat Produk
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  href="/marketplace/cart"
                                  className={`${
                                    active
                                      ? "bg-gray-50 text-secondary"
                                      : "text-gray-700"
                                  } group flex items-center px-4 py-2 text-sm transition`}
                                >
                                  <FiShoppingCart
                                    className="mr-3 h-4 w-4 text-gray-500 group-hover:text-secondary"
                                    aria-hidden="true"
                                  />
                                  Keranjang
                                </Link>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Menu>
                    ) : (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="px-2 md:px-3 py-2 text-sm font-medium text-primary hover:text-secondary transition-colors duration-200"
                        onClick={
                          item.href.startsWith("#") ? scrollToFooter : undefined
                        }
                      >
                        {item.name}
                      </Link>
                    )
                  )}
                </div>
              </div>

              <div className="hidden sm:block">
                {user.signedIn && user.avatar ? (
                  <Link href="/dashboard" className="flex items-center">
                    <Image
                      src={user.avatar}
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="rounded-full object-cover ml-4 w-8 h-8 sm:w-10 sm:h-10"
                    />
                  </Link>
                ) : (
                  <Link
                    href="/register"
                    className="btn-primary text-center ml-4 text-sm px-4 py-2 rounded-md"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden bg-white shadow-lg">
            <div className="px-4 pt-2 pb-3 space-y-1 flex flex-col items-center">
              {user.signedIn && user.avatar && (
                <Link href="/dashboard" className="mb-4">
                  <Image
                    src={user.avatar}
                    alt="User Avatar"
                    width={60}
                    height={60}
                    className="rounded-full object-cover w-16 h-16"
                  />
                </Link>
              )}

              {navigation.map((item) =>
                item.hasDropdown ? (
                  <div key={item.name} className="w-full">
                    <Disclosure.Button
                      as="a"
                      href={item.href}
                      className="block px-3 py-2 text-base font-medium text-primary hover:text-secondary"
                    >
                      {item.name}
                    </Disclosure.Button>
                    <div className="pl-4">
                      <Disclosure.Button
                        as="a"
                        href="/marketplace/cart"
                        className="block px-3 py-2 text-base font-medium text-primary hover:text-secondary flex items-center"
                      >
                        <FiShoppingCart className="mr-2" />
                        Cart
                      </Disclosure.Button>
                    </div>
                  </div>
                ) : (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className="block w-full px-3 py-2 text-base font-medium text-primary hover:text-secondary text-center"
                    onClick={
                      item.href.startsWith("#") ? scrollToFooter : undefined
                    }
                  >
                    {item.name}
                  </Disclosure.Button>
                )
              )}

              {!user.signedIn && (
                <Link
                  href="/register"
                  className="block w-full btn-primary text-center mt-4 text-sm px-4 py-2 rounded-md"
                >
                  Sign In
                </Link>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
