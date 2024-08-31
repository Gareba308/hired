"use client";

import Link from "next/link";
import {
  Combine,
  Crown,
  HelpCircle,
  LineChart,
  Lock,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface UserAccountNavProps {
  email: string;
  name: string;
  companyName: string;
}

const UserAccountNav = ({ email, companyName, name }: UserAccountNavProps) => {
  const router = useRouter();

  function getInitials(fullName: string): string {
    const nameParts = fullName.split(" ");

    if (nameParts.length >= 2) {
      const initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);
      return initials.toUpperCase();
    } else if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    } else {
      return "";
    }
  }

  return (
    <Menu as="div" className="relative inline-block shrink-0 text-left">
      <div>
        <Menu.Button className="inline-flex w-9 h-9 shrink-0 relative justify-center rounded-full bg-transparent font-semibold shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50">
          {companyName ? (
            <div className="flex items-center justify-center shrink-0 w-full h-full">
              <span className="text-xl font-medium text-gray-800 shrink-0">
                {getInitials(companyName)}
              </span>
            </div>
          ) : (
            <div className="relative cursor-pointer border border-gray-200 h-full shrink-0 w-full rounded-full overflow-hidden">
              <Image
                src={
                  "https://res.cloudinary.com/dx0i37cyd/image/upload/v1708947730/avatar-159236_1280_1_r7od9k.png"
                }
                alt="Employer pic"
                title="Employer pic"
                quality={100}
                fill
                sizes="100%"
                priority
              />
            </div>
          )}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-1.5 w-56 origin-top-right divide-y divide-gray-100 rounded-sm bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <p
                  className={classNames(
                    active ? "bg-white text-gray-800" : "text-gray-700",
                    "block px-4 py-2 text-xs font-medium line-clamp-1"
                  )}
                >
                  {email}
                </p>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/manage/dashboard"
                  className={classNames(
                    active ? "bg-secondary text-gray-900" : "text-gray-700",
                    "flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <LineChart className="h-4 w-4 mr-1.5 shrink-0 text-gray-600" />
                  My Dashboard
                </Link>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/manage/my-jobs"
                  className={classNames(
                    active ? "bg-secondary text-gray-900" : "text-gray-700",
                    "flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <Combine className="h-4 w-4 mr-1.5 shrink-0 text-gray-600" />
                  My Jobs
                </Link>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/manage/plans"
                  className={classNames(
                    active ? "bg-secondary text-gray-900" : "text-gray-700",
                    "flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <Crown className="h-4 w-4 mr-1.5 shrink-0 text-gray-600" />
                  The Plans
                </Link>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/manage/privacy"
                  className={classNames(
                    active ? "bg-secondary text-gray-900" : "text-gray-700",
                    "flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <Lock className="h-4 w-4 mr-1.5 shrink-0 text-gray-600" />
                  Privacy Policy
                </Link>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/manage/help"
                  className={classNames(
                    active ? "bg-secondary text-gray-900" : "text-gray-700",
                    "flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <HelpCircle className="h-4 w-4 mr-1.5 shrink-0 text-gray-600" />
                  Help Center
                </Link>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <p
                  className={classNames(
                    active ? "bg-red-100 text-red-800" : "text-red-700",
                    "px-4 py-2 text-sm cursor-pointer flex items-center text-red-700"
                  )}
                  onClick={() =>
                    signOut({ redirect: false }).then(() => router.push("/"))
                  }
                >
                  <LogOut className="h-4 w-4 mr-1.5 shrink-0" />
                  Logout
                </p>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserAccountNav;
