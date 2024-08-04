import { Preview } from "@/components/Preview";
import QuillPreview from "@/components/QuillPreview";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { TertiaryEducation } from "@prisma/client";
import { ArrowBigLeft, Link, PenLine } from "lucide-react";
import React from "react";

interface NewExperienceDetailsProps {
  tertiaryDetails: TertiaryEducation;
  toggleView: (selectedExperienceId: string) => void;
  toggleEdit: () => void;
}

const NewTertiaryCreated = ({
  tertiaryDetails,
  toggleView,
  toggleEdit,
}: NewExperienceDetailsProps) => {
  return (
    <div className="font-normal border border-gray-200 rounded-lg pb-3">
      <div>
        <div className="bg-secondary flex items-center py-1.5 justify-between rounded-tl-lg rounded-tr-lg pl-2.5 lg:pl-3 border-b border-gray-200">
          <h2 className="font-medium text-gray-600 text-lg">
            Institutions Details
          </h2>
          <div className="flex h-5 items-center">
            <Button
              variant="ghost"
              onClick={() => toggleView(tertiaryDetails.id)}
              type="button"
              className="flex items-center transition-all text-primary hover:text-primary duration-300 ease-in"
            >
              <ArrowBigLeft className="h-4 w-4 lg:h-5 lg:w-5" /> Back
            </Button>{" "}
            <Separator orientation="vertical"/>
            <Button
              onClick={toggleEdit}
              variant="ghost"
              type="button"
              className="flex items-center text-destructive-foreground hover:text-destructive-foreground"
            >
              <PenLine className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <dl className="divide-y divide-gray-100 px-2.5 sm:px-3">
        <div className="py-3 sm:py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
          <dt className="font-medium text-base leading-6 text-gray-700">
            Institution
          </dt>

          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
            {tertiaryDetails.institution ? (
              tertiaryDetails.institution
            ) : (
              <span className="italic text-sm text-gray-5">No details found</span>
            )}
          </dd>
        </div>

        <div className="py-3 sm:py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
          <dt className="font-medium text-base leading-6 text-gray-700">
            County
          </dt>

          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
            {tertiaryDetails.county ? (
              tertiaryDetails.county
            ) : (
              <span className="italic text-sm text-gray-5">No details found</span>
            )}
          </dd>
        </div>

        <div className="py-3 sm:py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
          <dt className="font-medium text-base leading-6 text-gray-700">
            Program Area
          </dt>

          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
            {tertiaryDetails.programArea ? (
              tertiaryDetails.programArea
            ) : (
              <span className="italic text-sm text-gray-5">No details found</span>
            )}
          </dd>
        </div>

        <div className="py-3 sm:py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
          <dt className="font-medium text-base leading-6 text-gray-700">
            Field of study
          </dt>

          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
            {tertiaryDetails.field ? (
              tertiaryDetails.field
            ) : (
              <span className="italic text-sm text-gray-5">No details found</span>
            )}
          </dd>
        </div>

        <div className="py-3 sm:py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
          <dt className="font-medium text-base leading-6 text-gray-700">
            Still studying
          </dt>

          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
            {tertiaryDetails.stillStudying === true ? (
              <>Yes, still studying for this qualification</>
            ) : (
              <>No, not studying for this qualification</>
            )}
          </dd>
        </div>

        <div className="py-3 sm:py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
          <dt className="font-medium text-base leading-6 text-gray-700">
            Start date
          </dt>

          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
            <div className="flex flex-row gap-4 xl:gap-8 w-full mt-4">
              {tertiaryDetails.startMonth && tertiaryDetails.startYear ? (
                <>
                  {tertiaryDetails.startMonth}-{tertiaryDetails.startYear}
                </>
              ) : (
                <span className="italic text-sm text-gray-5">No details found</span>
              )}
            </div>
          </dd>
        </div>

        <div className="py-3 sm:py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
          <dt className="font-medium text-base leading-6 text-gray-700">
            End date
          </dt>

          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
            <div className="flex flex-row gap-4 xl:gap-8 w-full mt-4">
              {tertiaryDetails.endMonth && tertiaryDetails.endYear ? (
                <>
                  {tertiaryDetails.endMonth}-{tertiaryDetails.endYear}
                </>
              ) : (
                <>
                  {tertiaryDetails.stillStudying === true ? (
                    <span className="text-base">Still studying</span>
                  ) : (
                    <span className="italic text-sm text-gray-5">No details found</span>
                  )}
                </>
              )}
            </div>
          </dd>
        </div>

        <div className="py-3 sm:py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
          <dt className="font-medium text-base leading-6 text-gray-700">
            Grade
          </dt>

          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
            {tertiaryDetails.grade ? (
              tertiaryDetails.grade
            ) : (
              <span className="italic text-sm text-gray-5">No details found</span>
            )}
          </dd>
        </div>

        <div className="py-3 sm:py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
          <dt className="font-medium text-base leading-6 text-gray-700">
            Uploaded certificated
          </dt>

          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
            {tertiaryDetails.uploadCertificate ? (
              <a
                href={tertiaryDetails.uploadCertificate}
                target="_blank"
                className="text-primary flex items-center"
              >
                <Link className="h-4 w-4 mr-1" />
                View cerificate
              </a>
            ) : (
              <span className="italic text-sm text-gray-5">No details found</span>
            )}
          </dd>
        </div>

        <div className="py-3 sm:py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
          <dt className="font-medium text-base leading-6 text-gray-700">
            Contact person details
          </dt>

          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
            <p>
              <span className="text-gray-700 font-medium mr-2">Full Name:</span>{" "}
              {tertiaryDetails.contactPersonName ? (
                <span>{tertiaryDetails.contactPersonName}</span>
              ) : (
                <span className="italic text-sm text-gray-5">No details found</span>
              )}
            </p>
            <p>
              <span className="text-gray-700 font-medium mr-2">
                Job Position:
              </span>{" "}
              {tertiaryDetails.contactPersonPosition ? (
                <span>{tertiaryDetails.contactPersonPosition}</span>
              ) : (
                <span className="italic text-sm text-gray-5">No details found</span>
              )}
            </p>
            <p className="text-primary">
              <span className="text-gray-700 font-medium mr-2">
                Email Address:
              </span>{" "}
              {tertiaryDetails.contactPersonEmail ? (
                <span>{tertiaryDetails.contactPersonEmail}</span>
              ) : (
                <span className="italic text-sm text-gray-5">
                  No details found
                </span>
              )}
            </p>
          </dd>
        </div>

        <div className="py-3 sm:py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
          <dt className="font-medium text-base leading-6 text-gray-700">
            Activities/Societies
          </dt>

          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
            {tertiaryDetails.activities ? (
              <div className="mt-2">
                <QuillPreview htmlContent={tertiaryDetails.activities}/>
              </div>
            ) : (
              <span className="italic text-sm text-gray-500">No details found</span>
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default NewTertiaryCreated;
