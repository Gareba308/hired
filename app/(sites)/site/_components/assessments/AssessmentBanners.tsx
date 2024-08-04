"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import AllAssessments from "./AllAssessments";
import {
  AcceptToBeAssessed,
  Assessment,
  AssessmentBanner,
} from "@prisma/client";
import InitiatedAssessment from "./InitiatedAssessment";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ControlledDisclosure from "./ControlledDisclosure";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  SlidersHorizontal,
} from "lucide-react";
import { assessmentCategories } from "../data/create-job/Assessment";

interface AssessmentBannersProps {
  banners: AssessmentBanner[];
  initiated: AcceptToBeAssessed | null;
  firstTest: Assessment[];
  testBanner: AssessmentBanner | null;
  acceptedAssessments: AcceptToBeAssessed[];
}
const AssessmentBanners = ({
  banners,
  initiated,
  firstTest,
  testBanner,
  acceptedAssessments,
}: AssessmentBannersProps) => {
  const pathname = usePathname();
  const isActive = pathname === "/site/assessments";

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isAnyCategorySelected, setIsAnyCategorySelected] = useState(false);

  const handleCheckboxChange2 = (
    value: string,
    closeDisclosure: () => void
  ) => {
    let newSelectedCategories: string[];
    if (selectedCategories.includes(value)) {
      newSelectedCategories = selectedCategories.filter(
        (category) => category !== value
      );
    } else {
      newSelectedCategories = [...selectedCategories, value];
    }
    setSelectedCategories(newSelectedCategories);
    setIsAnyCategorySelected(newSelectedCategories.length > 0);

    closeDisclosure();
  };

  const filteredCategory = banners.filter((banner) => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      banner.category === null ||
      selectedCategories.includes(banner.category);

    return categoryMatch;
  });
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
                <BreadcrumbPage>Assessments</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-row items-end justify-between gap-x-4 border-b border-gray-300">
          <div className="flex flex-row justify-start gap-x-4">
            <Link
              href="/site/assessments"
              className={cn(
                "border-b-[3px] text-lg border-transparent pb-0.5 transition-all duration-300",
                isActive &&
                  "border-b-[3px] border-sky-800 font-medium hover:border-[#005580]"
              )}
            >
              Assessments
            </Link>
            <Link
              href="/site/assessments/results"
              className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
            >
              Results
            </Link>
          </div>

          {!initiated && (
            <div className="relative inline-block text-left pb-0.5">
              <ControlledDisclosure
                buttonClassName={`group inline-flex hover:bg-secondary ${
                  isAnyCategorySelected
                    ? "border border-gray-200 text-gray-800 bg-secondary"
                    : " border border-gray-200 text-gray-800"
                } font-normal px-[9px] py-[5.5px] hover:rounded-sm rounded-sm justify-center text-sm`}
                buttonContent={(open) => (
                  <span className="flex items-center">
                    <SlidersHorizontal className="h-4 w-4 mr-1 shrink-0" />
                    Category
                    <span className="ml-2.5 flex items-center">
                      {open ? (
                        <ChevronUpIcon className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <ChevronDownIcon
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </span>
                )}
                panelClassName="absolute right-0 z-10 max-h-[calc(100vh-30vh)] overflow-y-scroll mt-1 w-64 origin-top-right divide-y divide-gray-100 rounded-sm bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                {({ closeDisclosure }) => (
                  <>
                    <h2 className="text-gray-700 text-base font-medium py-1 px-4">
                      Assessment Category
                    </h2>
                    <div className="py-1">
                      {assessmentCategories
                        .sort((a, b) => a.label.localeCompare(b.label))
                        .map((range, idx) => (
                          <div
                            key={idx}
                            className="flex items-center px-4 py-2 text-sm"
                          >
                            <input
                              type="checkbox"
                              id={`category-${idx}`}
                              value={range.value}
                              checked={selectedCategories.includes(range.value)}
                              onChange={() =>
                                handleCheckboxChange2(
                                  range.value,
                                  closeDisclosure
                                )
                              }
                              className="form-checkbox h-4 w-4 text-primary transition duration-150 ease-in-out"
                            />
                            <label
                              htmlFor={`category-${idx}`}
                              className="ml-2 text-gray-700"
                            >
                              {range.label}
                            </label>
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </ControlledDisclosure>
            </div>
          )}
        </div>
      </div>
      <div>
        {initiated ? (
          <InitiatedAssessment
            firstTest={firstTest}
            initiated={initiated}
            banner={testBanner}
          />
        ) : (
          <AllAssessments
            banners={filteredCategory}
            acceptedAssessments={acceptedAssessments}
          />
        )}
      </div>
    </>
  );
};

export default AssessmentBanners;
