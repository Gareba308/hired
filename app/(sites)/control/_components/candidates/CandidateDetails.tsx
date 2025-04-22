"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Preview } from "@/components/Preview";
import { Separator } from "@/components/ui/separator";
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
  SecondaryEducation,
  Skills,
  TertiaryEducation,
  ThumbsUp,
  WorkerBio,
  WorkerContact,
  WorkerDesires,
} from "@prisma/client";
import {
  BadgeCheck,
  Briefcase,
  CalendarClock,
  Eye,
  GraduationCap,
  Info,
  Mail,
  MapPinIcon,
  MoveRight,
  Phone,
  Printer,
  ShieldCheck,
  ThumbsUp as Thumb,
  Undo,
  UserSquare2,
  Building2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CandidateProfileMessageModal from "../models/candidate/NewMessageModal";

interface CombinedDataItemProps {
  workersBio: WorkerBio | null;
  workersDesire: WorkerDesires | null;
  workersAbout: About | null;
  workersExperience: Experience[];
  workersContact: WorkerContact | null;
  workersSkills: Skills | null;
  workersCertification: CertificationLicense[];
  workersAward: Award[];
  workersLanguage: Language[];
  workersSecondary: SecondaryEducation | null;
  workersTertiary: TertiaryEducation[];
  candidateID: string;
  candidateThumbed: ThumbsUp | null;
}

const CandidateDetails = ({
  candidateID,
  workersBio,
  workersDesire,
  workersAbout,
  workersExperience,
  workersContact,
  workersSkills,
  workersCertification,
  workersAward,
  workersLanguage,
  workersSecondary,
  workersTertiary,
}: CombinedDataItemProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [messageOpen, setMessageOpen] = useState<boolean>(false);
  const onClose = () => {
    setMessageOpen((prev) => !prev);
  };
  const onConfirm = () => {
    setMessageOpen((prev) => !prev);
  };
  const toggleOpen = () => {
    setMessageOpen(true);
  };
  const [isBioChecked, setIsBioChecked] = useState<boolean>(
    workersBio?.checked || false
  );

  const { mutate: checkProfile } = trpc.adminCheckCandidateProfile.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (err) => {
      if (err.message) {
        toast({
          title: "Something went wrong",
          variant: "destructive",
          description: err.message,
          duration: 3000,
        });
      } else {
        toast({
          title: "Something went wrong",
          description:
            "There was a problem changing this profiles checked status.",
          variant: "destructive",
          duration: 3000,
        });
        window.location.reload();
      }
    },
  });

  const handleCheckClick = async () => {
    setIsBioChecked((prevState) => !prevState);
    if (!isBioChecked) {
      toast({
        title: "Success",
        description: "This candidate has been marked as checked.",
        variant: "default",
        duration: 3000,
      });
    } else {
      toast({
        title: "Success",
        description: "This candidate has been marked as unchecked.",
        variant: "default",
        duration: 3000,
      });
    }
    checkProfile({
      checked: !isBioChecked,
      bioID: workersBio?.id as string,
    });
  };

  return (
    <>
      <div>
        <main className="mx-auto lg:-mt-2 max-w-7xl">
          <section>
            <div className="flex flex-wrap">
              <div className="w-full min-h-[calc(100vh-100px)] lg:mt-2 pt-2 pb-4 mx-auto print:shadow-none bg-white sm:rounded-md sm:shadow-sm lg:w-2/3">
                <div className="flex w-full items-end justify-between px-4 print:hidden border-b border-gray-300 pb-0.5">
                  <div className="flex items-center gap-x-1.5">
                    <h3 className="font-bold text-gray-600 tracking-tight text-2xl lg:text-3xl">
                      Candidate&apos;s Profile
                    </h3>
                  </div>
                </div>
                <div
                  id="divToPrint"
                  className="lg:col-span-3 px-4 mt-2 lg:mt-3 lg:pb-2"
                >
                  <div>
                    <>
                      <div className="border-b border-gray-200 pb-2 shadow-sm">
                        <div className="flex flex-row gap-x-4 w-full justify-between item-start">
                          <div className="w-full mt-0">
                            {workersBio?.name && (
                              <h3 className="font-bold text-gray-600 tracking-tight text-xl sm:text-2xl">
                                {workersBio?.name}
                              </h3>
                            )}
                            {workersDesire?.category && (
                              <h2 className="text-lg font-medium shrink-0 tracking-tight leading-tight text-gray-600">
                                {workersDesire?.category}
                              </h2>
                            )}
                            {workersContact?.county && (
                              <p className="flex items-center text-sm text-gray-500 font-normal">
                                <MapPinIcon className="h-4 w-4 mr-1.5 text-gray-500" />{" "}
                                {workersContact?.county && (
                                  <span className="mr-1">
                                    {workersContact?.town},
                                  </span>
                                )}
                                <span>{workersContact?.county}</span>
                              </p>
                            )}
                            {workersBio?.yearOfBirth && (
                              <p className="flex items-center text-sm font-normal text-gray-500">
                                <CalendarClock className="h-4 w-4 mr-1.5 text-gray-500" />{" "}
                                {workersBio?.yearOfBirth && (
                                  <span className="mr-1">
                                    {workersBio?.yearOfBirth}
                                  </span>
                                )}
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="h-4 w-4 ml-0.5 text-gray-500" />
                                    </TooltipTrigger>
                                    <TooltipContent className="text-gray-600 tracking-normal">
                                      <p>Represents the birth year</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </p>
                            )}
                            {workersBio?.gender && (
                              <p className="flex items-center text-sm text-gray-500 font-normal">
                                <UserSquare2 className="h-4 w-4 mr-1.5 text-gray-500" />{" "}
                                {workersBio?.gender && (
                                  <span className="mr-1">
                                    {workersBio?.gender}
                                  </span>
                                )}
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0 flex justify-end">
                            {workersBio && (
                              <div>
                                {workersBio.profilePic ? (
                                  <div className="relative cursor-pointer shrink-0 h-[84px] w-[84px] md:h-[90px] md:w-[90px] overflow-hidden rounded-sm">
                                    <Image
                                      src={workersBio.profilePic as string}
                                      alt={workersBio.name as string}
                                      title={workersBio.name as string}
                                      quality={100}
                                      fill
                                      sizes="100%"
                                      priority
                                    />
                                  </div>
                                ) : (
                                  <div className="relative cursor-pointer shrink-0 h-[84px] w-[84px] md:h-[90px] md:w-[90px] overflow-hidden rounded-sm">
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
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-row items-center mt-1.5 w-full justify-between text-base">
                          {workersContact?.phone && (
                            <Button
                              variant="secondary"
                              size="sm"
                              title="Make a call"
                              type="button"
                              className="rounded-sm h-9 w-24 font-normal text-sm border text-primary hover:text-primary hover:bg-secondary bg-white border-gray-200 hover:border-gray-200"
                            >
                              <a
                                target="_blank"
                                href={`tel:${workersContact?.phone}`}
                                className="flex items-center text-sm"
                              >
                                <Phone className="w-4 h-4 mr-1.5 font-semibold" />
                                Phone
                              </a>
                            </Button>
                          )}
                          {workersContact?.email && (
                            <Button
                              variant="outline"
                              size="sm"
                              title="Send an email"
                              onClick={() => {
                                const mailtoLink = `mailto:${workersContact?.email}`;
                                window.location.href = mailtoLink;
                              }}
                              className="rounded-sm h-9 w-24 text-sm font-normal text-destructive-foreground bg-white border border-red-100 hover:bg-red-50 hover:text-destructive-foreground"
                            >
                              <Mail className="w-4 h-4 mr-1.5" />
                              Email
                            </Button>
                          )}
                        </div>
                      </div>
                    </>
                    <div className="lg:col-span-2 lg:col-start-1 mt-4">
                      <div className="w-full">
                        <div className="flex items-end justify-between border-b border-gray-300 mb-1 pb-1">
                          <h3 className="text-xl font-medium text-gray-700">
                            About
                          </h3>
                          {workersBio && (
                            <Button
                              variant="default"
                              size="sm"
                              type="button"
                              onClick={handleCheckClick}
                              className="rounded-sm h-9 font-normal hover:bg-primary hover:opacity-90"
                            >
                              {isBioChecked ? (
                                <>
                                  <ShieldCheck className="h-4 w-4 font-normal mr-1.5" />
                                  Checked
                                </>
                              ) : (
                                <>
                                  <ShieldCheck className="h-4 w-4 font-normal mr-1.5" />
                                  Unchecked
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                        {workersAbout && workersAbout?.about ? (
                          <div className="text-gray-600 w-full text-base">
                            <Preview value={workersAbout?.about as string} />
                          </div>
                        ) : (
                          <p className="text-base text-gray-700 italic">
                            No about summary has been provided
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-2 lg:col-start-1 mt-3">
                      <h3 className="text-xl font-medium text-gray-600 border-b border-gray-200 mb-1 pb-0.5">
                        Work Experience
                      </h3>
                      {workersExperience.length !== 0 ? (
                        <>
                          {workersExperience.flatMap((experience) => (
                            <div key={experience.id} className="w-full mb-3">
                              <div className="flex items-center gap-x-3 justify-between">
                                <div className="flex items-center h-4 gap-x-1">
                                  <h3 className="text-lg line-clamp-1 font-medium text-gray-600">
                                    {experience.position}
                                  </h3>
                                  {experience.employmentType && (
                                    <Separator orientation="vertical" />
                                  )}
                                  <p className="text-xs line-clamp-1 text-gray-600 font-normal">
                                    {experience.employmentType}
                                  </p>
                                </div>
                                <div className="text-sm line-clamp-1 -mt-0.5 text-gray-600">
                                  {experience.startMonth}/{experience.startYear}{" "}
                                  -{" "}
                                  {experience.endMonth && experience.endYear ? (
                                    <>
                                      {experience.endMonth}/{experience.endYear}
                                    </>
                                  ) : experience.stillWorking &&
                                    !experience.endMonth &&
                                    !experience.endYear ? (
                                    "Present"
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                              <div className="text-gray-500">
                                <h3 className="text-sm flex font-medium text-gray-600 items-center">
                                  <Building2 className="h-4 w-4 mr-0.5 text-gray-500" />
                                  {experience.nameCompany}
                                </h3>
                                <p className="text-sm flex items-center">
                                  <MapPinIcon className="h-4 w-4 mr-0.5" />
                                  {experience.location}
                                </p>
                              </div>
                              <div className="text-gray-600 w-full text-base">
                                <Preview
                                  value={experience?.description as string}
                                />
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <p className="text-base text-gray-700 italic">
                          No experience details has been provided
                        </p>
                      )}
                    </div>

                    <div className="lg:col-span-2 lg:col-start-1 mt-3">
                      {workersTertiary.length !== 0 ? (
                        <>
                          <h3 className="text-xl font-medium text-gray-600 border-b border-gray-200 mb-1 pb-0.5">
                            Education
                          </h3>
                          {workersTertiary.flatMap((education) => (
                            <div key={education.id} className="w-full mb-3">
                              <div className="flex items-center gap-x-3 justify-between">
                                <div className="flex items-center h-4 gap-x-1">
                                  <h3 className="text-lg line-clamp-1 font-medium mr-1 text-gray-600">
                                    {education.institution}
                                  </h3>
                                  {education.programArea && (
                                    <Separator orientation="vertical" />
                                  )}
                                  <p className="text-xs line-clamp-1 text-gray-600 font-normal">
                                    {education.programArea}
                                  </p>
                                </div>
                                <div className="text-sm line-clamp-1 -mt-0.5 text-gray-600">
                                  {education.startMonth}/{education.startYear} -{" "}
                                  {education.endMonth && education.endYear ? (
                                    <>
                                      {education.endMonth}/{education.endYear}
                                    </>
                                  ) : education.stillStudying &&
                                    !education.endMonth &&
                                    !education.endYear ? (
                                    "In progress"
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                              <div className="text-gray-500">
                                <h3 className="text-sm flex font-medium text-gray-600 items-center">
                                  <GraduationCap className="h-4 w-4 mr-0.5 text-gray-500" />
                                  {education.field}
                                </h3>
                                <p className="text-sm flex items-center">
                                  <MapPinIcon className="h-4 w-4 mr-0.5" />
                                  {education.county}
                                </p>
                              </div>
                              <div className="text-gray-600 w-full text-base">
                                <Preview
                                  value={education?.activities as string}
                                />
                              </div>
                            </div>
                          ))}
                        </>
                      ) : workersSecondary ? (
                        <>
                          <h3 className="text-xl font-medium text-gray-600 border-b border-gray-200 mb-1 pb-0.5">
                            Education
                          </h3>
                          <div className="w-full mb-3">
                            <div className="flex items-center gap-x-3 justify-between">
                              <div className="flex items-center h-4 gap-x-1">
                                <h3 className="text-lg font-medium mr-1 text-gray-600">
                                  {workersSecondary?.school}
                                </h3>
                                <Separator orientation="vertical" />
                                <p className="text-xs text-gray-600 font-normal">
                                  KCSE
                                </p>
                              </div>
                              <div className="text-sm -mt-0.5 text-gray-600">
                                {workersSecondary?.startMonth}/
                                {workersSecondary?.startYear} -{" "}
                                {workersSecondary?.endMonth}/
                                {workersSecondary?.endYear}
                              </div>
                            </div>
                            <div className="text-gray-500">
                              <p className="text-sm flex items-center">
                                <MapPinIcon className="h-4 w-4 mr-0.5" />
                                {workersSecondary?.county}
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <h3 className="text-xl font-medium text-gray-600 border-b border-gray-200 mb-1 pb-0.5">
                            Education
                          </h3>
                          <p className="text-base text-gray-700 italic">
                            No education details has been provided
                          </p>
                        </>
                      )}
                    </div>

                    <div className="lg:col-span-2 lg:col-start-1 mt-3">
                      <h3 className="text-xl font-medium text-gray-600 border-b border-gray-200 mb-1 pb-0.5">
                        Skills
                      </h3>
                      {workersSkills ? (
                        <div className="flex flex-wrap -mx-1">
                          {workersSkills?.skills.flatMap((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-sm bg-secondary px-2 py-1 text-[13px] font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 mx-1 my-1"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-base text-gray-700 italic">
                          Candidate has not listed skills
                        </p>
                      )}
                    </div>

                    <div className="lg:col-span-2 lg:col-start-1 mt-3">
                      {workersAward.length !== 0 && (
                        <>
                          <h3 className="text-xl font-medium text-gray-600 border-b border-gray-200 mb-1 pb-0.5">
                            Awards & Honors
                          </h3>
                          {workersAward.flatMap((award) => (
                            <div key={award.id} className="w-full mb-3">
                              <div className="flex items-center gap-x-3 justify-between">
                                <h3 className="text-lg line-clamp-1 font-medium mr-1 text-gray-600">
                                  {award.title}
                                </h3>
                                {award.awardedMonth && award.awardedYear && (
                                  <div className="text-sm line-clamp-1 text-gray-600">
                                    {award.awardedMonth}/{award.awardedYear}
                                  </div>
                                )}
                              </div>
                              <div className="text-gray-600 w-full text-base">
                                <Preview value={award.description as string} />
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>

                    <div className="lg:col-span-2 lg:col-start-1 mt-3">
                      {workersCertification.length !== 0 && (
                        <>
                          <h3 className="text-xl font-medium text-gray-600 border-b border-gray-200 mb-1 pb-0.5">
                            Certification & Licenses
                          </h3>
                          {workersCertification.flatMap((certificate) => (
                            <div key={certificate.id} className="w-full mb-3">
                              <div className="flex items-center gap-x-3 justify-between">
                                <h3 className="text-lg font-medium mr-1 text-gray-600">
                                  {certificate.certificateLicenseName}
                                </h3>
                                <div className="text-sm text-gray-600">
                                  {certificate.validStartMonth}/
                                  {certificate.validStartYear} -{" "}
                                  {certificate.validEndMonth}/
                                  {certificate.validEndYear}
                                </div>
                              </div>
                              <div className="text-gray-600 text-base">
                                <Preview
                                  value={certificate.description as string}
                                />
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>

                    <div className="lg:col-span-2 lg:col-start-1 mt-3">
                      {workersLanguage.length !== 0 && (
                        <>
                          <h3 className="text-xl font-medium text-gray-600 border-b border-gray-200 mb-1 pb-0.5">
                            Languages
                          </h3>
                          {workersLanguage.flatMap((language) => (
                            <div key={language.id} className="w-full mb-2">
                              <div className="flex items-center">
                                <p className="text-base font-normal mr-1 text-gray-600">
                                  {language.language}
                                </p>{" "}
                                <MoveRight className="h-4 w-4 font-light text-gray-500" />{" "}
                                <span className="inline-flex items-center ml-1 rounded-sm bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                  {language.proficiency}
                                </span>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full hidden lg:flex lg:w-1/3 lg:pl-4 lg:sticky lg:top-[65px] lg:max-h-[calc(100vh-10rem)]">
                <div className="flex flex-col w-full h-full">
                  <div className="lg:rounded-lg h-full lg:sticky lg:top-0 z-10 lg:mt-2">
                    <div className="flex justify-between gap-y-6 flex-col">
                      <div className="lg:block rounded-none py-4 px-4 lg:pb-4 lg:space-y-4 shadow-md bg-slate-200 border border-slate-200 lg:pt-3">
                        <div>
                          <h2 className="text-[18px] mb-1 text-start text-gray-600 font-semibold">
                            Candidate Verification
                          </h2>
                          <p className="text-xs text-gray-600">
                            This is a candidates detailed profile to help the
                            Hired team to assess the authenticity and if the
                            candidate is indeed real.
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mt-1.5">
                            <span className="font-semibold">Note:</span> Real
                            candidates should be given a checkmark to show proof
                            of identity.
                          </p>
                        </div>
                      </div>

                      <div className="flex mt-4 lg:mt-0 flex-col h-full justify-center">
                        <div className="lg:block py-4 rounded-none px-4 lg:pb-4 lg:space-y-4 shadow-md bg-slate-200 border border-slate-200 lg:pt-3">
                          <h2 className="text-[18px] text-start text-gray-600 font-semibold">
                            Further Actions
                          </h2>
                          <div className="flex w-full mb-1 justify-between flex-col gap-y-5">
                            <CandidateProfileMessageModal
                              onClose={onClose}
                              userName={workersBio?.name as string}
                              userId={candidateID}
                              isOpen={messageOpen}
                              onConfirm={onConfirm}
                            />
                            <Button
                              variant="default"
                              size="default"
                              title="message candidate"
                              type="button"
                              onClick={toggleOpen}
                              className="rounded-sm bg-slate-800 hover:bg-slate-800 hover:opacity-90 font-normal"
                            >
                              <Mail className="h-4 w-4 mr-1.5" />
                              Message
                            </Button>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 w-full">
                              This profile is automatically generated from the
                              candidate&apos;s submitted details and portfolio.
                            </p>
                            <p className="text-xs mt-1 text-gray-600 w-full">
                              <span className="font-medium">Note:</span> Please
                              maintain a professional tone in all
                              communications.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default CandidateDetails;
