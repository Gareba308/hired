"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { WorkerContact } from "@prisma/client";
import ContactForm from "./ContactForm";

interface ContactProfileProps {
  profileContact: WorkerContact[];
}
const ContactProfile = ({ profileContact }: ContactProfileProps) => {
  const pathname = usePathname();
  const isActive = pathname === "/site/profile/contact";
  return (
    <>
      <div>
        <div className="flex items-center gap-x-2 sm:gap-x-2.5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/site/jobs">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Contact Information</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-row justify-start mt-2 gap-x-4 border-b border-gray-300">
          <Link
            href="/site/profile"
            className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
          >
            Bio Data
          </Link>
          <Link
            href="/site/profile/desirable"
            className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
          >
            Desirable
          </Link>
          <Link
            href="/site/profile/contact"
            className={cn(
              "border-b-[3px] text-lg border-transparent pb-0.5 transition-all duration-300",
              isActive &&
                "border-b-[3px] border-sky-800 font-medium hover:border-[#005580]"
            )}
          >
            Contact
          </Link>
          <Link
            href="/site/profile/security"
            className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
          >
            Security
          </Link>
        </div>
      </div>
      <div>
        <ContactForm profileContact={profileContact} />
      </div>
    </>
  );
};

export default ContactProfile;
