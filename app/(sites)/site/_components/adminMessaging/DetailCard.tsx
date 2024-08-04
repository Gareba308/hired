import React, { useEffect, useRef, useState } from "react";
import { ContactWorker } from "@prisma/client";
import DetailEachCard from "./DetailEachCard";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import NoDetailCompanyChat from "./NoDetailCompanyChat";

interface UserItems{
  id: string;
  name: string | null
}
interface DetailCardProps {
  workerMessages: ContactWorker[];
  adminSenderExists: UserItems;
}

const DetailCard = ({
  workerMessages,
  adminSenderExists,
}: DetailCardProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredMessage = workerMessages
    .filter((message) =>
    message.message?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 20);

  const handleCompanyClick = (adminUserId: string, message: string) => {
    setSearchQuery(message);
    router.push(`/site/messaging/admin/${adminUserId}`);
    setShowDropdown(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputFocus = () => {
    if (filteredMessage.length > 0 && searchQuery.trim() !== "") {
      setShowDropdown(true);
    }
  };
  return (
    <div>
      <div className="relative">
        <div className="pt-0.5 lg:hidden">
          <Input
            placeholder="Search for a message"
            value={searchQuery}
            onFocus={handleInputFocus}
            onChange={handleSearchChange}
            className="placeholder:text-gray-400"
          />
        </div>
        <div className="relative pt-0.5 hidden lg:block">
          <Search className="absolute left-2 top-[15.3px] h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for a message"
            value={searchQuery}
            onFocus={handleInputFocus}
            onChange={handleSearchChange}
            className="pl-7 placeholder:text-gray-400"
          />
        </div>
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-100 rounded-b-md shadow-lg"
          >
            {searchQuery && (
              <ul className="divide-y divide-gray-200">
                {filteredMessage.length > 0 ? (
                  filteredMessage.map((message, index) => (
                    <li
                      key={index}
                      className="px-4 py-3 hover:bg-secondary text-sm flex items-center cursor-pointer"
                      onClick={() =>
                        handleCompanyClick(
                          message.adminUserId,
                          message.message as string
                        )
                      }
                    >
                      <span className="line-clamp-1">
                        {message.message}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-sm text-gray-500">
                    No results found
                  </li>
                )}
              </ul>
            )}
          </div>
        )}
      </div>
      <div className="mt-2">
        {workerMessages.length !== 0 ? (
          <DetailEachCard
          workerMessages={workerMessages}
            adminSenderExists={adminSenderExists}
          />
        ) : (
          <NoDetailCompanyChat/>
        )}
      </div>
    </div>
  );
};

export default DetailCard;