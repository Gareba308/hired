import Image from "next/image";
import React from "react";
import { format, isToday } from "date-fns";
import { useRouter } from "next/navigation";
import { ContactEmployer } from "@prisma/client";

interface EmployerAdminEachMessageCardProps {
  employerMessages: ContactEmployer[];
}

const EmployerAdminEachMessageCard = ({
  employerMessages,
}: EmployerAdminEachMessageCardProps) => {
  const router = useRouter();

  const latestMessagesMap = employerMessages.reduce((acc, message) => {
    const latestMessage = acc.get(message.adminUserId);
    if (!latestMessage || message.createdAt > latestMessage.createdAt) {
      acc.set(message.adminUserId, message);
    }
    return acc;
  }, new Map<string, ContactEmployer>());

  const sortedCompanies = Array.from(latestMessagesMap.values()).sort((a, b) => {
    if (a.createdAt > b.createdAt) return -1;
    if (a.createdAt < b.createdAt) return 1;
    return 0;
  });

  return (
    <div>
      <ul>
        {sortedCompanies.map((message) => (
          <li key={message.adminUserId} onClick={() => router.push(`/manage/messaging/admin/${message.adminUserId}`)}>
            <div className="flex leading-tight gap-x-2 cursor-pointer lg:gap-x-4 py-3 border-b border-slate-200 bg-white hover:bg-slate-50 px-1 lg:px-1.5">
              <div className="w-10 h-10 border border-gray-100 shrink-0 rounded-full  flex justify-center">
                <Image
                  src={"https://res.cloudinary.com/dx0i37cyd/image/upload/v1708947730/avatar-159236_1280_1_r7od9k.png"}
                  alt="Logo"
                  width={40}
                  height={40}
                  quality={100}
                  priority={true}
                  className="rounded-full shrink-0"
                />
              </div>
              <div className="w-full">
                <div className="flex w-full items-center justify-between gap-x-1 sm:gap-x-2 lg:gap-x-3">
                  <h4 className="text-gray-600 text-base font-medium line-clamp-1">
                    {message.adminName}
                  </h4>
                  {message.createdAt && (
                    <p className="text-gray-600 font-normal text-sm">
                      {isToday(new Date(message.createdAt))
                        ? format(new Date(message.createdAt), "HH:mm")
                        : format(new Date(message.createdAt), "MM/dd/yyyy")}
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-600 font-normal line-clamp-1">
                  {message.message}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployerAdminEachMessageCard;
