import { Preview } from "@/components/Preview";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Experience } from "@prisma/client";
import { ArrowBigLeft, PenLine, X, XCircle } from "lucide-react";
import React from "react";

interface NewExperienceDetailsProps {
  experienceDetails: Experience;
  toggleView: (selectedExperienceId: string) => void;
  toggleEdit: () => void;
}

const NewExperienceCreated = ({
  experienceDetails,
  toggleView,
  toggleEdit,
}: NewExperienceDetailsProps) => {
  return (
    <div className="font-normal">
      <dl className="border border-gray-200  rounded-lg mt-4">
        <div className="bg-secondary flex items-center py-1.5 justify-between rounded-tl-lg rounded-tr-lg pl-2.5 lg:pl-3 border-b border-gray-200">
          <h2 className="font-medium text-gray-600 text-lg">
            <span className="hidden sm:flex">My Experience Details</span>
            <span className="sm:hidden">Experience Details</span>
          </h2>
          <div className="flex h-5 flex-row gap-x-0.5 shrink-0 items-center">
            <Button
              onClick={toggleEdit}
              variant="ghost"
              type="button"
              className="sm:flex hidden items-center border border-transparent hover:border-gray-200 hover:bg-slate-300 text-primary hover:text-primary"
            >
              <PenLine className="h-4 w-4 shrink-0 mr-0.5" />
              Edit
            </Button>
            <Button
              onClick={toggleEdit}
              variant="ghost"
              type="button"
              className="flex sm:hidden items-center border border-transparent hover:border-gray-200 hover:bg-slate-300 text-primary hover:text-primary"
            >
              <PenLine className="h-4 w-4 shrink-0" />
            </Button>
            <Separator orientation="vertical" />
            <Button
              variant="ghost"
              onClick={() => toggleView(experienceDetails.id)}
              type="button"
              className="sm:flex items-center hidden shrink-0 transition-all border border-transparent text-destructive-foreground hover:bg-destructive hover:border hover:border-red-100 hover:text-destructive-foreground duration-300 ease-in"
            >
              <X className="h-4 w-4 shrink-0 mr-0.5" /> Close
            </Button>
            <Button
              variant="ghost"
              onClick={() => toggleView(experienceDetails.id)}
              type="button"
              className="flex items-center sm:hidden shrink-0 transition-all border border-transparent text-destructive-foreground hover:bg-destructive hover:border hover:border-red-100 hover:text-destructive-foreground duration-300 ease-in"
            >
              <X className="h-4 w-4 shrink-0" />
            </Button>
          </div>
        </div>

        <div className="px-2.5 lg:px-4 divide-y divide-gray-200">
          <div className="py-3 lg:py-5 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
            <dt className="font-medium text-lg leading-6 text-gray-600">
              Job position
            </dt>

            <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
              {experienceDetails.position ? (
                experienceDetails.position
              ) : (
                <span className="italic text-sm">No details found</span>
              )}
            </dd>
          </div>

          <div className="py-3 lg:py-5 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
            <dt className="font-medium text-lg leading-6 text-gray-600">
              Employment type
            </dt>

            <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
              {experienceDetails.employmentType ? (
                experienceDetails.employmentType
              ) : (
                <span className="italic text-sm">No details found</span>
              )}
            </dd>
          </div>

          <div className="py-3 lg:py-5 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
            <dt className="font-medium text-lg leading-6 text-gray-600">
              Name of company
            </dt>

            <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
              {experienceDetails.nameCompany ? (
                experienceDetails.nameCompany
              ) : (
                <span className="text-sm italic">No details found</span>
              )}
            </dd>
          </div>

          <div className="py-3 lg:py-5 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
            <dt className="font-medium text-lg leading-6 text-gray-600">
              County of location
            </dt>

            <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
              {experienceDetails.location ? (
                experienceDetails.location
              ) : (
                <span className="italic text-sm">No details found</span>
              )}
            </dd>
          </div>

          <div className="py-3 lg:py-5 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
            <dt className="font-medium text-lg leading-6 text-gray-600">
              Currently working
            </dt>

            <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
              {experienceDetails.stillWorking === true ? (
                <>Yes, still working in this position</>
              ) : (
                <>No, not currently working in this position</>
              )}
            </dd>
          </div>

          <div className="py-3 lg:py-5 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
            <dt className="font-medium text-lg leading-6 text-gray-600">
              Start date
            </dt>

            <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
              <div className="flex flex-row gap-4 w-full">
                {experienceDetails.startMonth && experienceDetails.startYear ? (
                  <>
                    {experienceDetails.startMonth}-{experienceDetails.startYear}
                  </>
                ) : (
                  <span className="italic">No details found</span>
                )}
              </div>
            </dd>
          </div>

          <div className="py-3 lg:py-5 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
            <dt className="font-medium text-lg leading-6 text-gray-600">
              End date
            </dt>

            <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
              <div className="flex flex-row gap-4 w-full">
                {experienceDetails.endMonth && experienceDetails.endYear ? (
                  <>
                    {experienceDetails.endMonth}/{experienceDetails.endYear}
                  </>
                ) : (
                  <>
                    {experienceDetails.stillWorking === true ? (
                      <span className="text-base">Still working</span>
                    ) : (
                      <span className="italic text-sm">No details found</span>
                    )}
                  </>
                )}
              </div>
            </dd>
          </div>

          <div className="py-3 lg:py-5 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
            <dt className="font-medium text-lg leading-6 text-gray-600">
              Contact person details
            </dt>

            <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
              <p>
                <span className="text-gray-600 font-medium mr-2">
                  Full Name:
                </span>{" "}
                {experienceDetails.contactPersonName ? (
                  <span>{experienceDetails.contactPersonName}</span>
                ) : (
                  <span className="italic text-sm">No details found</span>
                )}
              </p>
              <p>
                <span className="text-gray-600 font-medium mr-2">
                  Job Position:
                </span>{" "}
                {experienceDetails.contactPersonPosition ? (
                  <span>{experienceDetails.contactPersonPosition}</span>
                ) : (
                  <span className="italic text-sm">No details found</span>
                )}
              </p>
              <p className="text-primary">
                <span className="text-gray-600 font-medium mr-2">
                  Email Address:
                </span>{" "}
                {experienceDetails.contactPersonEmail ? (
                  <span>{experienceDetails.contactPersonEmail}</span>
                ) : (
                  <span className="italic text-sm text-gray-700">
                    No details found
                  </span>
                )}
              </p>
            </dd>
          </div>

          <div className="py-3 lg:py-5 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
            <dt className="font-medium text-lg leading-6 text-gray-600">
              Role description
            </dt>

            <dd className="leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
              {experienceDetails.description ? (
                <Preview value={experienceDetails.description} />
              ) : (
                <span className="italic text-sm">No details found</span>
              )}
            </dd>
          </div>
        </div>
      </dl>
    </div>
  );
};

export default NewExperienceCreated;
