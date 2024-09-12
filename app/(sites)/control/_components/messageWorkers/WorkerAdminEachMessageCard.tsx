import {ContactWorker } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { format, isToday } from "date-fns";
import "@/lib/suppressHydration"
import { useRouter } from "next/navigation";
interface UserItems {
  id: string;
  name: string | null;
  email: string;
  role: string | null;
}
interface WorkerAdminEachMessageCardProps {
  workerMessages: ContactWorker[];
  workersWithMessages: UserItems[];
}
const WorkerAdminEachMessageCard = ({
  workerMessages,
  workersWithMessages,
}: WorkerAdminEachMessageCardProps) => {
  const router= useRouter()
  const latestMessagesMap = workersWithMessages.reduce((acc, user) => {
    const userMessages = workerMessages.filter(
      (message) =>
        message.workerUserId === user.id 
    );
    const latestMessage = userMessages.reduce((latest, current) =>
      current.createdAt > latest.createdAt ? current : latest
    );
    acc.set(user.id, latestMessage);
    return acc;
  }, new Map<string, ContactWorker>());

  const sortedUsers = [...workersWithMessages].sort((a, b) => {
    const latestMessageA = latestMessagesMap.get(a.id);
    const latestMessageB = latestMessagesMap.get(b.id);
    
    if (!latestMessageA || !latestMessageB) return 0;
    if (latestMessageA.createdAt > latestMessageB.createdAt) {
      return -1;
    } else if (latestMessageA.createdAt < latestMessageB.createdAt) {
      return 1;
    } else {
      return 0;
    }
  });

  return (
    <div>
      <ul>
        {sortedUsers.map((item) => (
          <li key={item.id} onClick={()=> router.push(`/control/messages/workers/${item.id}`)}>
            <div className="flex leading-tight gap-x-2 cursor-pointer lg:gap-x-4 py-3 border-b border-slate-200 bg-white hover:bg-slate-50 px-1 lg:px-1.5">
              <div className="w-10 h-10 border border-gray-100 shrink-0 rounded-full  flex justify-center">
                <Image
                  src={
                    "https://res.cloudinary.com/dx0i37cyd/image/upload/v1708947730/avatar-159236_1280_1_r7od9k.png"
                  }
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
                    {item.name}
                  </h4>
                  {latestMessagesMap.has(item.id) && (
                    <>
                      {latestMessagesMap.get(item.id)?.createdAt && (
                        <p className="text-gray-600 font-normal text-sm">
                          {isToday(
                            new Date(latestMessagesMap.get(item.id)!.createdAt)
                          )
                            ? format(
                                new Date(
                                  latestMessagesMap.get(item.id)!.createdAt
                                ),
                                "HH:mm"
                              )
                            : format(
                                new Date(
                                  latestMessagesMap.get(item.id)!.createdAt
                                ),
                                "MM/dd/yyyy"
                              )}
                        </p>
                      )}
                    </>
                  )}
                </div>
                <>
                  {latestMessagesMap.has(item.id) && (
                    <p className="text-sm text-gray-600 font-normal line-clamp-1">
                      {latestMessagesMap.get(item.id)?.message}
                    </p>
                  )}
                </>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkerAdminEachMessageCard;
