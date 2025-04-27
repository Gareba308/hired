"use client";

import QuillPreview from "@/components/QuillPreview";
import { Menu, Transition } from "@headlessui/react";
import { Company, Job } from "@prisma/client";
import {
  BadgeCheck,
  BadgeX,
  Ban,
  Briefcase,
  Gem,
  Loader2,
  Mail,
  MapPinIcon,
  MoreVertical,
  Trash,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import NewMessageModal from "../models/companies/NewMessageModal";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { DeleteEmployerAlertModal } from "../models/companies/DeleteEmployer";
import { useRouter } from "next/navigation";
import { SuspendEmployerAlertModal } from "../models/companies/SuspendCompany";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SpecialEmployerAlertModal } from "../models/companies/SpecialCompanyModal";

interface TopEmployer {
  companyDetails: Company;
  vacanciesCount: number;
  individualJobs: Job[];
}

interface CompanyCardProps {
  combinedData: TopEmployer[];
}

const CompanyCard = ({ combinedData }: CompanyCardProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const [currentlyMessagingID, setCurrentlyMessagingID] = useState<
    string | null
  >(null);
  const [currentlyDeletingID, setCurrentlyDeletingID] = useState<string | null>(
    null
  );
  const [messageOpen, setMessageOpen] = useState<boolean>(false);
  const messageClose = () => {
    setMessageOpen((prev) => !prev);
  };
  const messageConfirm = () => {
    setMessageOpen((prev) => !prev);
  };

  const [currentlyUpdatingSuspensionID, setCurrentlyUpdatingSuspensionID] =
    useState<string | null>(null);

  const [currentlyUpdatingSpecialID, setCurrentlyUpdatingSpecialID] = useState<
    string | null
  >(null);
  const [suspensionOpen, setSuspensionOpen] = useState<boolean>(false);
  const suspensionClose = () => {
    setSuspensionOpen((prev) => !prev);
  };
  const toggleSuspension = (companyId: string) => {
    setCurrentlyUpdatingSuspensionID(companyId);
    setSuspensionOpen(true);
  };

  const [specialOpen, setSpecialOpen] = useState<boolean>(false);
  const specialClose = () => {
    setSpecialOpen((prev) => !prev);
  };
  const toggleSpecial = (companyId: string) => {
    setCurrentlyUpdatingSpecialID(companyId);
    setSpecialOpen(true);
  };

  const toggleMessage = (companyID: string) => {
    setCurrentlyMessagingID(companyID);
    setMessageOpen(true);
  };

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const deleteClose = () => {
    setDeleteOpen((prev) => !prev);
    setCurrentlyDeletingID(null);
  };

  const toggleDelete = (employerUserId: string) => {
    setCurrentlyDeletingID(employerUserId);
    setDeleteOpen(true);
  };

  function getInitials(fullName: string): string {
    const nameParts = fullName.split(" ");

    if (nameParts.length >= 2) {
      const initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);
      return initials.toUpperCase();
    } else if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    } else {
      return "";
    }
  }

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const { mutate: deleteEmployer, isLoading } = trpc.deleteEmployer.useMutation(
    {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Deleted this employer from our database",
          variant: "default",
          duration: 3000,
        });
        router.refresh();
        setDeleteOpen(false);
      },
      onError: (err) => {
        if (err.message) {
          toast({
            title: "Something went wrong",
            description: err.message,
            variant: "destructive",
            duration: 3000,
          });
        } else {
          toast({
            title: "Something went wrong",
            description: "There was a problem deleting this user.",
            variant: "destructive",
            duration: 3000,
          });
        }
        setDeleteOpen(false);
      },
      onMutate: ({ employerUserID }) => {
        setCurrentlyDeletingID(employerUserID);
      },
      onSettled: () => {
        setCurrentlyDeletingID(null);
      },
    }
  );

  const deleteConfirm = (company: Company) => {
    deleteEmployer({ employerUserID: company.userId, companyId: company.id });
  };

  const { mutate: toggleEmployerSuspension, isLoading: suspensionLoading } =
    trpc.adminEmployerSuspensionUpdate.useMutation({
      onSuccess: (action) => {
        const suspended = action.suspended;
        const accountAction = suspended ? "suspended" : "unsuspended";
        toast({
          title: "Success",
          description: `This user's account has been ${accountAction}.`,
          variant: "default",
          duration: 3000,
        });
        setSuspensionOpen(false);
        router.refresh();
      },
      onError: (err) => {
        if (err.message) {
          toast({
            title: "Something went wrong",
            description: err.message,
            variant: "destructive",
            duration: 3000,
          });
        } else {
          toast({
            title: "Something went wrong",
            description: "There was a problem updating suspension details",
            variant: "destructive",
            duration: 3000,
          });
        }
        setSuspensionOpen(false);
      },
      onMutate: ({ companyId }) => {
        setCurrentlyUpdatingSuspensionID(companyId);
      },
      onSettled: () => {
        setCurrentlyUpdatingSuspensionID(null);
      },
    });

  const confirmSuspension = (
    companyId: string,
    employerUserId: string,
    suspension: boolean
  ) => {
    setCurrentlyUpdatingSuspensionID(companyId);
    toggleEmployerSuspension({
      companyId,
      employerUserId: employerUserId,
      suspended: suspension,
    });
  };

  const { mutate: specialEmployer, isLoading: specialLoading } =
    trpc.adminSpecialEmployerUpdate.useMutation({
      onSuccess: (event) => {
        const special = event.special;
        const accountAction = special
          ? "upgraded to special"
          : "downgraded from special";
        toast({
          title: "Success",
          description: `This account has been ${accountAction}.`,
          variant: "default",
          duration: 3000,
        });
        setSpecialOpen(false);
        router.refresh();
      },
      onError: (err) => {
        if (err.message) {
          toast({
            title: "Something went wrong",
            description: err.message,
            variant: "destructive",
            duration: 3000,
          });
        } else {
          toast({
            title: "Something went wrong",
            description:
              "There was a problem trying to update special status of this account.",
            variant: "destructive",
            duration: 3000,
          });
        }
        setSpecialOpen(false);
      },
      onMutate: ({ companyId }) => {
        setCurrentlyUpdatingSpecialID(companyId);
      },
      onSettled: () => {
        setCurrentlyUpdatingSpecialID(null);
      },
    });

  const confirmSpecial = (
    companyId: string,
    employerUserId: string,
    special: boolean
  ) => {
    setCurrentlyUpdatingSpecialID(companyId);
    specialEmployer({ companyId, employerUserId, special });
  };

  return (
    <div className="mx-auto max-w-2xl md:max-w-7xl">
      <>
        <div className="max-w-screen-xl mx-auto">
          <div className="mt-3 lg:mt-0">
            <div className="grid gap-4 xl:grid-cols-2">
              {combinedData.flatMap((item) => (
                <div
                  key={item.companyDetails.id}
                  className="border w-full border-gray-300 pt-2 pb-2.5 px-2.5 lg:px-3 rounded-lg"
                >
                  <div className="flex items-center w-full gap-x-3 justify-between">
                    <div className="flex items-center">
                      {item.companyDetails.company_name && (
                        <Link
                          prefetch={true}
                          href={`/control/companies/${item.companyDetails.id}?origin=control/companies`}
                          className="text-gray-600 hover:underline line-clamp-1 font-semibold text-[17.5px]"
                        >
                          {item.companyDetails.company_name}
                        </Link>
                      )}
                      {item.companyDetails.verified &&
                        !item.companyDetails.suspended &&
                        !item.companyDetails.special && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <BadgeCheck className="h-[22px] w-[22px] fill-[#b45309] text-primary-foreground text-base" />
                              </TooltipTrigger>
                              <TooltipContent className="text-gray-600 text-sm tracking-normal font-normal">
                                The checkmark indicates that the admin did a
                                background check to verify authenticity of this
                                company.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      {item.companyDetails.suspended &&
                        item.companyDetails.verified &&
                        !item.companyDetails.special && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <BadgeCheck className="h-[22px] w-[22px] fill-red-700 text-primary-foreground text-base" />
                              </TooltipTrigger>
                              <TooltipContent className="text-gray-600 text-sm tracking-normal font-normal">
                                The checkmark indicates that the company is
                                verified although at the moment it has been
                                suspended.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      {item.companyDetails.suspended &&
                        item.companyDetails.verified &&
                        item.companyDetails.special && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <BadgeCheck className="h-[22px] w-[22px] fill-red-700 text-primary-foreground text-base" />
                              </TooltipTrigger>
                              <TooltipContent className="text-gray-600 text-sm tracking-normal font-normal">
                                The checkmark indicates that the company is
                                verified although at the moment it has been
                                suspended.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      {!item.companyDetails.suspended &&
                        item.companyDetails.verified &&
                        item.companyDetails.special && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <BadgeCheck className="h-[22px] w-[22px] fill-green-700 text-primary-foreground text-base" />
                              </TooltipTrigger>
                              <TooltipContent className="text-gray-600 text-sm tracking-normal font-normal">
                                The checkmark indicates that the company is
                                verified and is a special category of company.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      {item.companyDetails.special &&
                        !item.companyDetails.verified &&
                        !item.companyDetails.suspended && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <BadgeCheck className="h-[22px] w-[22px] fill-green-700 text-primary-foreground text-base" />
                              </TooltipTrigger>
                              <TooltipContent className="text-gray-600 text-sm tracking-normal font-normal">
                                The checkmark indicates that the company is a
                                special category of company.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      {item.companyDetails.suspended &&
                        !item.companyDetails.verified &&
                        !item.companyDetails.special && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <BadgeX className="h-[22px] w-[22px] fill-red-700 text-primary-foreground text-base" />
                              </TooltipTrigger>
                              <TooltipContent className="text-gray-600 text-sm tracking-normal font-normal">
                                The mark indicates that the company has been
                                suspended and it hasn&apos;t been verified.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                    </div>
                    <Menu as="div" className="relative inline-block text-left">
                      {currentlyMessagingID === item.companyDetails.id && (
                        <NewMessageModal
                          isOpen={messageOpen}
                          onClose={messageClose}
                          onConfirm={messageConfirm}
                          companyID={item.companyDetails.id}
                          companyName={
                            item.companyDetails.company_name as string
                          }
                        />
                      )}
                      {currentlyUpdatingSpecialID ===
                        item.companyDetails.id && (
                        <SpecialEmployerAlertModal
                          isOpen={specialOpen}
                          onClose={specialClose}
                          onConfirm={() =>
                            confirmSpecial(
                              item.companyDetails.id,
                              item.companyDetails.userId,
                              !item.companyDetails.special
                            )
                          }
                          loading={specialLoading}
                          special={item.companyDetails.special}
                        />
                      )}
                      {currentlyUpdatingSuspensionID ===
                        item.companyDetails.id && (
                        <SuspendEmployerAlertModal
                          isOpen={suspensionOpen}
                          onClose={suspensionClose}
                          loading={suspensionLoading}
                          onConfirm={() =>
                            confirmSuspension(
                              item.companyDetails.id,
                              item.companyDetails.userId,
                              !item.companyDetails.suspended
                            )
                          }
                          suspended={item.companyDetails.suspended}
                        />
                      )}
                      {currentlyDeletingID === item.companyDetails.userId && (
                        <DeleteEmployerAlertModal
                          isOpen={deleteOpen}
                          onClose={deleteClose}
                          onConfirm={() => deleteConfirm(item.companyDetails)}
                          loading={isLoading}
                        />
                      )}
                      <div>
                        <Menu.Button
                          disabled={
                            currentlyDeletingID ===
                              item.companyDetails.userId && isLoading
                          }
                          className="group inline-flex hover:bg-secondary font-normal p-2  hover:rounded-sm justify-center text-sm text-gray-600 hover:text-gray-700"
                        >
                          {currentlyDeletingID === item.companyDetails.userId &&
                          isLoading ? (
                            <>
                              <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
                            </>
                          ) : (
                            <MoreVertical className="h-5 w-5 text-gray-500" />
                          )}
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute divide-y divide-gray-200 w-48 right-0 z-10 mt-1 origin-top-right rounded-sm bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="">
                            <Menu.Item>
                              {({ active }) => (
                                <span
                                  onClick={() =>
                                    toggleMessage(item.companyDetails.id)
                                  }
                                  className={classNames(
                                    active
                                      ? "bg-secondary text-gray-900"
                                      : "text-gray-600",
                                    "flex items-center font-medium cursor-pointer px-4 py-2.5 text-sm"
                                  )}
                                >
                                  <Mail className="h-4 w-4 text-gray-500 mr-2" />
                                  Message User
                                </span>
                              )}
                            </Menu.Item>
                          </div>
                          <div className="">
                            <Menu.Item>
                              {({ active }) => (
                                <span
                                  onClick={() =>
                                    toggleSpecial(item.companyDetails.id)
                                  }
                                  className={classNames(
                                    active
                                      ? "bg-secondary text-gray-900"
                                      : "text-gray-600",
                                    "flex items-center font-medium cursor-pointer px-4 py-2.5 text-sm"
                                  )}
                                >
                                  <Gem className="h-4 w-4 text-gray-500 mr-2" />
                                  {item.companyDetails.special
                                    ? "Downgrade User"
                                    : "Upgrade User"}
                                </span>
                              )}
                            </Menu.Item>
                          </div>
                          <div className="">
                            <Menu.Item>
                              {({ active }) => (
                                <span
                                  onClick={() =>
                                    toggleSuspension(item.companyDetails.id)
                                  }
                                  className={classNames(
                                    active
                                      ? "bg-secondary text-gray-900"
                                      : "text-gray-600",
                                    "flex items-center font-medium cursor-pointer px-4 py-2.5 text-sm"
                                  )}
                                >
                                  <Ban className="h-4 w-4 mr-2 text-gray-500" />
                                  {item.companyDetails.suspended
                                    ? "Unsuspend User"
                                    : "Suspend User"}
                                </span>
                              )}
                            </Menu.Item>
                          </div>
                          <div className="">
                            <Menu.Item>
                              {({ active }) => (
                                <span
                                  onClick={() =>
                                    toggleDelete(item.companyDetails.userId)
                                  }
                                  className={classNames(
                                    active
                                      ? "text-secondary-foreground bg-secondary"
                                      : "text-destructive-foreground",
                                    "flex items-center cursor-pointer font-medium hover:text-destructive-foreground hover:bg-destructive px-4 py-2.5 text-sm"
                                  )}
                                >
                                  <Trash className="h-4 w-4 mr-2" />
                                  Delete User Account
                                </span>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                  <Link
                    prefetch={true}
                    href={`/control/companies/${item.companyDetails.id}?origin=control/companies`}
                    className="flex items-start w-full mb-1 gap-x-2.5"
                  >
                    <div>
                      {item.companyDetails.logo ? (
                        <div className="relative cursor-pointer shrink-0 border border-gray-200 bg-gray-200 h-[64px] w-[64px] overflow-hidden rounded-sm">
                          <Image
                            src={item.companyDetails.logo as string}
                            alt={item.companyDetails.company_name as string}
                            title={item.companyDetails.company_name as string}
                            quality={100}
                            fill
                            sizes="100%"
                            priority
                          />
                        </div>
                      ) : (
                        <div
                          title={`${
                            item.companyDetails.company_name as string
                          }'s made up logo`}
                          className="h-[64px] w-[64px] cursor-pointer py-1 px-0.5 shrink-0 text-gray-600 border border-gray-200  bg-gray-200 hover:bg-secondary rounded-sm sm:flex items-center justify-center"
                        >
                          <div className="flex items-center justify-center shrink-0 w-full h-full">
                            <div className="text-2xl sm:text-2xl font-semibold shrink-0">
                              {getInitials(
                                item.companyDetails.company_name as string
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="-space-y-1 w-full">
                      {item.companyDetails.category && (
                        <p className="text-gray-700 flex items-center text-sm font-normal pb-1 line-clamp-1">
                          <Briefcase className="h-4 w-4 mr-1 shrink-0 text-gray-500" />
                          <span className="line-clamp-1">
                            {item.companyDetails.category}
                          </span>
                        </p>
                      )}
                      {item.companyDetails.county && (
                        <p className="text-gray-700 text-sm line-clamp-1 flex items-center pb-0.5">
                          <MapPinIcon className="h-4 w-4 mr-1 shrink-0 text-gray-500" />
                          <span className="line-clamp-1">
                            {item.companyDetails.town}
                            {item.companyDetails.county && (
                              <>, {item.companyDetails.county}</>
                            )}
                          </span>
                        </p>
                      )}
                      {item && (
                        <p className="text-gray-700 text-sm flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 mr-1 line-clamp-1 text-gray-500"
                          >
                            <rect
                              width="18"
                              height="11"
                              x="3"
                              y="11"
                              rx="2"
                              ry="2"
                            />
                            <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                          </svg>
                          <span className="line-clamp-1">
                            {item.vacanciesCount} vacancies in{" "}
                            {item.individualJobs.length} openings.
                          </span>
                        </p>
                      )}
                    </div>
                  </Link>
                  {item.companyDetails.company_description && (
                    <>
                      <div className="flex items-center justify-between gap-x-4 w-full mb-0.5">
                        <span className="font-medium text-base text-gray-600">
                          Description:
                        </span>
                        {item.companyDetails.suspended && (
                          <span className="inline-flex items-center rounded-sm bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                            Suspended
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/control/companies/${item.companyDetails.id}?origin=control/companies`}
                        className="text-gray-600 text-base -mt-1 font-normal line-clamp-2"
                      >
                        <QuillPreview
                          htmlContent={
                            item.companyDetails.company_description as string
                          }
                        />
                      </Link>
                    </>
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

export default CompanyCard;
