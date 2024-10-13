"use client";

import { trpc } from "@/app/_trpc/client";
import QuillPreview from "@/components/QuillPreview";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import {
  About,
  Award,
  CertificationLicense,
  Experience,
  Language,
  ProfileView,
  SecondaryEducation,
  Skills,
  TertiaryEducation,
  WorkerBio,
  WorkerContact,
  WorkerDesires,
} from "@prisma/client";
import { MapPinIcon, Pin} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CombinedDataItem {
  userId: string;
  bio: WorkerBio;
  desire: WorkerDesires | null;
  about: About | null;
  experience: Experience[];
  contact: WorkerContact | null;
  skills: Skills | null;
  certification: CertificationLicense[];
  award: Award[];
  language: Language[];
  secondary: SecondaryEducation | null;
  tertiary: TertiaryEducation[];
  profileViews: ProfileView[];
}

interface AllCandidatesProps {
  combinedData: CombinedDataItem[];
  profileViews: ProfileView[];
  userId: string;
}

const calculateCompleteness = (candidate: CombinedDataItem) => {
  let score = 0;
  if (candidate.bio) score++;
  if (candidate.desire) score++;
  if (candidate.about) score++;
  if (candidate.experience.length > 0) score++;
  if (candidate.contact) score++;
  if (candidate.skills && candidate.skills.skills.length > 0) score++;
  if (candidate.certification.length > 0) score++;
  if (candidate.award.length > 0) score++;
  if (candidate.language.length > 0) score++;
  if (candidate.secondary) score++;
  if (candidate.tertiary.length > 0) score++;
  return score;
};

const CandidateCard = ({
  combinedData,
  profileViews,
  userId,
}: AllCandidatesProps) => {
  const sortedCandidates = combinedData.sort((a, b) => {
    const scoreA = calculateCompleteness(a);
    const scoreB = calculateCompleteness(b);
    return scoreB - scoreA;
  });

  const router = useRouter();
  const { toast } = useToast();
  function formatNumber(number: number): string {
    if (number < 1000) {
      return number.toString();
    } else if (number < 10000) {
      return (number / 1000).toFixed(1) + "k";
    } else {
      return Math.round(number / 1000) + "k";
    }
  }

  function getInitials(fullName: string): string {
    const titlesToOmit = [
      "Mr.",
      "Mr",
      "Mrs.",
      "Mrs",
      "Miss.",
      "Miss",
      "Ms.",
      "Ms",
      "Dr.",
      "Dr",
      "Prof.",
      "Prof",
    ];
    for (const title of titlesToOmit) {
      if (fullName.startsWith(title + " ") || fullName === title) {
        fullName = fullName.substring(title.length).trim();
        break;
      }
    }
    const nameParts = fullName.split(" ");
    if (nameParts.length >= 2) {
      let initials = nameParts[0];
      for (let i = 1; i < nameParts.length; i++) {
        if (i < nameParts.length - 1) {
          initials += " " + nameParts[i].charAt(0) + ".";
        } else {
          if (nameParts.length > 2) {
            initials += nameParts[i].charAt(0);
          } else {
            initials += " " + nameParts[i].charAt(0);
          }
        }
      }
      return initials.toUpperCase() + ".";
    }
    return fullName.charAt(0).toUpperCase();
  }

  return (
    <div className="mx-auto max-w-2xl md:max-w-7xl">
      <>
        <div className="max-w-screen-xl mx-auto">
          <div className="mt-3 lg:mt-0">
            <div className="grid gap-4 xl:grid-cols-2">
              {sortedCandidates.flatMap((item) => (
                <div
                  onClick={() => router.push(`/manage/candidates/${item.userId}?origin=manage/candidates`)}
                  key={item.userId}
                  className="border border-gray-200 pt-1 pb-2.5 px-2.5 cursor-pointer lg:px-3 rounded-sm"
                >
                  <div className="flex w-full items-start gap-3">
                    {item.bio.profilePic ? (
                      <div className="relative cursor-pointer border border-gray-200 h-[80px] shrink-0 w-[80px] overflow-hidden rounded-md">
                        <Image
                          src={item.bio.profilePic as string}
                          alt={item.bio.name as string}
                          title={item.bio.name as string}
                          quality={100}
                          fill
                          sizes="100%"
                          priority
                        />
                      </div>
                    ) : (
                      <div className="relative cursor-pointer border-border-gray-200 shrink-0 h-[80px] w-[80px] overflow-hidden rounded-md">
                        <Image
                          src={
                            "https://res.cloudinary.com/dx0i37cyd/image/upload/v1708947730/avatar-159236_1280_1_r7od9k.png"
                          }
                          alt="Profile picture"
                          title="User profile"
                          quality={100}
                          fill
                          sizes="100%"
                          priority
                        />
                      </div>
                    )}
                    <div className="-space-y-1 w-full">
                      <div className="flex items-center justify-between">
                        {item.bio.name && (
                          <h4 className="text-gray-600 line-clamp-1 font-semibold text-lg">
                            {getInitials(item.bio.name)}
                          </h4>
                        )}
                        <>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="inline-flex rounded-sm bg-sky-50 px-2 py-[3px] font-medium text-sky-700 ring-1 ring-inset ring-sky-600/20">
                                  <span className="text-[12.5px]">
                                    Likes:{" "}
                                    {formatNumber(item.bio.thumbUp as number)}
                                  </span>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="text-gray-500 leading-tight">
                                <span>
                                  This is the number of thumb up this candidates
                                  has received. The thumb ups are given by other
                                  employers.
                                </span>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </>
                      </div>
                      {item.bio.currentJobTitle && (
                        <p className="text-primary text-base font-medium pb-1 line-clamp-1">
                          {item.bio.currentJobTitle}
                        </p>
                      )}
                      {item.bio.county && (
                        <p className="text-gray-500 text-sm flex items-center pb-0.5">
                          <MapPinIcon className="h-4 w-4 mr-1 line-clamp-1 text-gray-400" />
                          <span className="line-clamp-1">
                            {item.bio.county} County
                          </span>
                        </p>
                      )}
                      {item.contact?.town && (
                        <p className="text-gray-500 text-sm flex items-center">
                          <Pin className="h-4 w-4 mr-1 line-clamp-1 text-gray-400" />
                          <span className="line-clamp-1">
                            {item.contact?.town} Town
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  {item.about?.about && (
                    <>
                      <span className="font-medium text-sm text-gray-600">
                        About:
                      </span>
                      <div className="text-gray-500 text-base leading-tight -mt-1 font-normal line-clamp-2">
                        <QuillPreview
                          htmlContent={item.about?.about as string}
                        />
                      </div>
                    </>
                  )}
                  {item.skills && (
                    <div className="mt-0.5">
                      <span className="font-medium text-sm text-gray-600">
                        Skills:
                      </span>
                      <div className="-mt-1 flex flex-wrap -mx-1">
                        {item.skills?.skills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-[13px] font-normal text-gray-600 ring-1 ring-inset ring-gray-500/10 mx-0.5 my-0.5"
                          >
                            {skill}
                          </span>
                        ))}
                        {item.skills?.skills?.length &&
                          item.skills?.skills.length > 4 && (
                            <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-[12.5px] italic font-normal text-primary ring-1 ring-inset ring-gray-500/10 mx-0.5 my-0.5">
                              +{item.skills?.skills.length - 4} more
                            </span>
                          )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default CandidateCard;
