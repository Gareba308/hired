"use client";

import { HelpWorker } from "@prisma/client";
import { CornerUpLeft, MailPlus } from "lucide-react";
import Link from "next/link";
import HelpMessageCard from "./HelpMessageCard";
import NoSelectedMessage from "./NoSelectedMessage";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface UserItems {
  id: string;
  email: string;
  name: string | null;
}
interface HelpMessagesProps {
  workerMessages: HelpWorker[];
  usersWithMessages: UserItems[];
}

const HelpMessages = ({
  workerMessages,
  usersWithMessages,
}: HelpMessagesProps) => {
  const router = useRouter();
  return (
    <div className="h-full sm:max-h-[calc(100vh-100px)] min-h-[calc(100vh-95px)] sm:rounded-md bg-white sm:shadow-sm max-w-7xl px-4 pb-4 mx-auto overflow-hidden">
      <main className="mx-auto max-w-7xl">
        <div className="flex items-baseline justify-between pb-1 pt-2 border-b border-gray-200">
          <div className="text-2xl w-full sm:text-3xl font-bold tracking-tight text-gray-600">
            <div className="flex items-center gap-x-1.5 sm:gap-x-2">
              <Link
                prefetch={true}
                href={"/control/jobs"}
                className="hover:text-[#005580] text-gray-700"
              >
                <CornerUpLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 mr-1.5 sm:mr-2.5 shrink-0" />
              </Link>
              <div className="flex flex-row w-full justify-between gap-x-3 items-center">
                <h3 className="font-bold text-gray-600 tracking-tight text-xl sm:text-2xl lg:text-3xl">
                  Help Workers
                </h3>
                <Button
                  size="sm"
                  onClick={() => router.push("/control/help/recruiters")}
                  variant="default"
                  type="button"
                  className="hover:bg-primary font-normal hover:opacity-90"
                >
                  <MailPlus className="h-[18px] w-[18px] mr-2" />
                  Recruiters
                </Button>
              </div>
            </div>
          </div>
        </div>
        <section aria-labelledby="products-heading" className="pt-2 sm:pt-0">
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-4">
            <div className="hidden h-full sm:block sm:col-span-3 sm:max-h-[calc(100vh-145px)] sm:min-h-[calc(100vh-145px)] border-r-2 border-gray-200 sm:mr-24">
              <div className="mr-1 lg:mr-1.5">
                <NoSelectedMessage />
              </div>
            </div>
            <div className="sm:max-h-[calc(100vh-145px)] h-full sm:min-h-[calc(100vh-145px)] sm:overflow-y-scroll sm:-ml-24 bg-white flex-col gap-y-6">
              <div className="h-full flex-col ml-1 lg:ml-1.5 lg:mr-1.5  mr-1">
                <HelpMessageCard
                  workerMessages={workerMessages}
                  usersWithMessages={usersWithMessages}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HelpMessages;
