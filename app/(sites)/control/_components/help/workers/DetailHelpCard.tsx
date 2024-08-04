import React, { useEffect, useRef, useState } from "react";
import { HelpWorker } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import NoDetailUserChat from "./NoDetailUserChat";
import DetailHelpEachCard from "./DetailHelpEachCard";

interface UserItems {
  id: string;
  name: string | null;
  email: string;
}
interface DetailWorkerCardProps {
  userMessages: HelpWorker[];
  usersWithMessages: UserItems[];
  senderExists: UserItems;
}

const DetailHelpCard = ({
  usersWithMessages,
  userMessages,
  senderExists,
}: DetailWorkerCardProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredUsers = usersWithMessages
    .filter((user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 20);

  const handleUserClick = (userId: string, userName: string) => {
    setSearchQuery(userName);
    router.push(`/control/help/jobseeker/${userId}`);
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
    if (filteredUsers.length > 0 && searchQuery.trim() !== "") {
      setShowDropdown(true);
    }
  };
  return (
    <div>
      <div className="relative">
        <div className="pt-0.5 lg:hidden">
          <Input
            placeholder="Search for a user"
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
            placeholder="Search for a user"
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
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <li
                      key={index}
                      className="px-4 py-3 hover:bg-secondary text-sm flex items-center cursor-pointer"
                      onClick={() =>
                        handleUserClick(user.id, user.name as string)
                      }
                    >
                      <span className="line-clamp-1">{user.name}</span>
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
        {usersWithMessages.length !== 0 ? (
          <DetailHelpEachCard
            userMessages={userMessages}
            usersWithMessages={usersWithMessages}
            senderExists={senderExists}
          />
        ) : (
          <NoDetailUserChat />
        )}
      </div>
    </div>
  );
};

export default DetailHelpCard;
