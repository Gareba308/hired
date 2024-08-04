import React, { useEffect, useRef, useState } from "react";
import EmployerAdminEachMessageCard from "./EmployerAdminEachMessageCard";
import { Company, ContactEmployer } from "@prisma/client";
import NoCompanyChat from "./NoCompanyChat";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface EmployerMessageCardProps {
  employerMessages: ContactEmployer[];
  companiesWithMessages: Company[];
  companies: Company[];
}

const EmployerMessageCard = ({
  companiesWithMessages,
  employerMessages,
  companies,
}: EmployerMessageCardProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredCompanies = companies
    .filter((company) =>
      company?.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 20);

  const handleCompanyClick = (companyId: string, companyName: string) => {
    setSearchQuery(companyName);
    router.push(`/control/messages/${companyId}`);
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
    if (filteredCompanies.length > 0 && searchQuery.trim() !== "") {
      setShowDropdown(true);
    }
  };
  return (
    <div>
      <div className="relative">
        <div className="hidden sm:block pt-0.5 lg:hidden">
          <Input
            placeholder="Search company to message..."
            value={searchQuery}
            onFocus={handleInputFocus}
            onChange={handleSearchChange}
            className="placeholder:text-gray-400"
          />
        </div>
        <div className="relative pt-0.5 sm:hidden lg:block">
          <Search className="absolute left-1 lg:left-2 top-3 lg:top-[15.3px] h-5 w-5 lg:h-4 lg:w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search company to message..."
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
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company, index) => (
                    <li
                      key={index}
                      className="px-4 py-3 hover:bg-secondary text-sm flex items-center cursor-pointer"
                      onClick={() =>
                        handleCompanyClick(
                          company.id,
                          company.company_name as string
                        )
                      }
                    >
                      <span className="line-clamp-1">
                        {company.company_name}
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
        {companiesWithMessages.length !== 0 ? (
          <EmployerAdminEachMessageCard
            employerMessages={employerMessages}
            companiesWithMessages={companiesWithMessages}
          />
        ) : (
          <NoCompanyChat companies={companies}/>
        )}
      </div>
    </div>
  );
};

export default EmployerMessageCard;
