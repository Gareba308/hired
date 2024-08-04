"use client";

import { MoveLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import UserProfile from "./UserProfile";
import { AdminProfile, User } from "@prisma/client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import AccountSecurity from "./AccountSecurity";

interface AdminProfileProps {
  profile: AdminProfile | null;
  user: User;
}

const AdminSecurity = ({ profile, user }: AdminProfileProps) => {
  const pathname = usePathname();
  const isActive = pathname === "/control/profile/security";
  return (
    <>
      <div>
        <div className="flex items-center gap-x-2 sm:gap-x-2.5">
          <Link
            href="/control/jobs"
            className="hover:text-[#005580] text-gray-700"
          >
            <MoveLeft className="h-6 w-6 shrink-0" />
          </Link>
        </div>
        <div className="flex flex-row justify-start gap-x-4 border-b border-gray-300">
          <Link
            href="/control/profile"
            className="border-b-[3px] text-lg border-transparent pb-0.5 transition-all duration-300"
          >
            My Profile
          </Link>
          <Link
            href="/control/profile/security"
            className={cn(
              "border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300",
              isActive &&
                "border-b-[3px] border-sky-800 font-medium hover:border-[#005580]"
            )}
          >
            Account Security
          </Link>
        </div>
      </div>
      <div>
        <AccountSecurity profile={profile} user={user} />
      </div>
    </>
  );
};

export default AdminSecurity;
