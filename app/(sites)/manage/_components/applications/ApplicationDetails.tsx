"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import {
  ArrowBigRight,
  Loader2,
  MailIcon,
  MailPlus,
  MapPin,
  PhoneForwardedIcon,
  PhoneIcon,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Application } from "@prisma/client";
import QuillPreview from "@/components/QuillPreview";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";

interface ApplicationDetailsProps {
  application: Application;
}

export default function ApplicationDetails({
  application,
}: ApplicationDetailsProps) {
  const { toast } = useToast();
  const router = useRouter();

  const [ratingAbout, setRatingAbout] = useState<number>(
    application.aboutRating || 0
  );

  const [ratingExperience, setRatingExperience] = useState<number>(
    application.experienceRating || 0
  );

  const [ratingEducation, setRatingEducation] = useState<number>(
    application.educationRating || 0
  );

  const [ratingSkills, setRatingSkills] = useState<number>(
    application.skillsRating || 0
  );

  const [ratingCertification, setRatingCertification] = useState<number>(
    application.certificationRating || 0
  );

  const [ratingAward, setRatingAward] = useState<number>(
    application.awardsRating || 0
  );

  function getInitials(fullName: string): string {
    const nameParts = fullName.split(" ");
    if (nameParts.length >= 2) {
      const initials =
        nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0);
      return initials.toUpperCase();
    }
    return fullName.charAt(0).toUpperCase();
  }

  const printDiv = () => {
    const printableArea = document.getElementById("divToPrint");
    if (printableArea) {
      const originalContents = document.body.innerHTML;
      const printContents = printableArea.innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
    } else {
      toast({
        title: "Something went wrong",
        description: "Could not find the element to print.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const { mutate: rateAbout, isLoading: aboutLoading } =
    trpc.employerRateAbout.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "The rating on about has been recorded.",
          variant: "default",
          duration: 3000,
        });
        router.refresh();
      },
      onError: (err) => {
        if (err.message) {
          toast({
            title: "Something went wrong.",
            description: err.message,
            variant: "destructive",
            duration: 4000,
          });
        } else {
          toast({
            title: "Something went wrong",
            description: "There was a problem submitting your rating.",
            variant: "destructive",
            duration: 4000,
          });
        }
        window.location.reload();
      },
    });

  const { mutate: rateExperience, isLoading: experienceLoading } =
    trpc.employerRateExperience.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "The rating on experience has been recorded.",
          variant: "default",
          duration: 3000,
        });
        router.refresh();
      },
      onError: (err) => {
        if (err.message) {
          toast({
            title: "Something went wrong.",
            description: err.message,
            variant: "destructive",
            duration: 4000,
          });
        } else {
          toast({
            title: "Something went wrong",
            description: "There was a problem submitting your rating.",
            variant: "destructive",
            duration: 4000,
          });
        }
        window.location.reload();
      },
    });

  const { mutate: rateEducation, isLoading: educationLoading } =
    trpc.employerRateEducation.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "The rating on education has been recorded.",
          variant: "default",
          duration: 3000,
        });
        router.refresh();
      },
      onError: (err) => {
        if (err.message) {
          toast({
            title: "Something went wrong.",
            description: err.message,
            variant: "destructive",
            duration: 4000,
          });
        } else {
          toast({
            title: "Something went wrong",
            description: "There was a problem submitting your rating.",
            variant: "destructive",
            duration: 4000,
          });
        }
        window.location.reload();
      },
    });

  const { mutate: rateSkills, isLoading: skillsLoading } =
    trpc.employerRateSkills.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "The rating on skills has been recorded.",
          variant: "default",
          duration: 3000,
        });
        router.refresh();
      },
      onError: (err) => {
        if (err.message) {
          toast({
            title: "Something went wrong.",
            description: err.message,
            variant: "destructive",
            duration: 4000,
          });
        } else {
          toast({
            title: "Something went wrong",
            description: "There was a problem submitting your rating.",
            variant: "destructive",
            duration: 4000,
          });
        }
        window.location.reload();
      },
    });

  const { mutate: rateAward, isLoading: awardLoading } =
    trpc.employerRateAwards.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "The rating on awards has been recorded.",
          variant: "default",
          duration: 3000,
        });
        router.refresh();
      },
      onError: (err) => {
        if (err.message) {
          toast({
            title: "Something went wrong.",
            description: err.message,
            variant: "destructive",
            duration: 4000,
          });
        } else {
          toast({
            title: "Something went wrong",
            description: "There was a problem submitting your rating.",
            variant: "destructive",
            duration: 4000,
          });
        }
        window.location.reload();
      },
    });

  const { mutate: rateCertificate, isLoading: certificationLoading } =
    trpc.employerRateCertification.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "The rating on certification has been recorded.",
          variant: "default",
          duration: 3000,
        });
        router.refresh();
      },
      onError: (err) => {
        if (err.message) {
          toast({
            title: "Something went wrong.",
            description: err.message,
            variant: "destructive",
            duration: 4000,
          });
        } else {
          toast({
            title: "Something went wrong",
            description: "There was a problem submitting your rating.",
            variant: "destructive",
            duration: 4000,
          });
        }
        window.location.reload();
      },
    });

  const handleRatingAbout = (value: number) => {
    let newRating: number;
    if (value === ratingAbout) {
      newRating = ratingAbout - 1;
    } else {
      newRating = ratingAbout < value ? value : value - 1;
    }
    setRatingAbout(newRating);
    rateAbout({
      applicationID: application.id,
      aboutRating: newRating,
    });
  };

  const handleRatingExperience = (value: number) => {
    let newRating: number;
    if (value === ratingExperience) {
      newRating = ratingExperience - 1;
    } else {
      newRating = ratingExperience < value ? value : value - 1;
    }
    setRatingExperience(newRating);
    rateExperience({
      applicationID: application.id,
      experienceRating: newRating,
    });
  };

  const handleRatingEducation = (value: number) => {
    let newRating: number;
    if (value === ratingEducation) {
      newRating = ratingEducation - 1;
    } else {
      newRating = ratingEducation < value ? value : value - 1;
    }
    setRatingEducation(newRating);
    rateEducation({
      applicationID: application.id,
      educationRating: newRating,
    });
  };

  const handleRatingSkills = (value: number) => {
    let newRating: number;
    if (value === ratingSkills) {
      newRating = ratingSkills - 1;
    } else {
      newRating = ratingSkills < value ? value : value - 1;
    }
    setRatingSkills(newRating);
    rateSkills({
      applicationID: application.id,
      skillsRating: newRating,
    });
  };

  const handleRatingAward = (value: number) => {
    let newRating: number;
    if (value === ratingAward) {
      newRating = ratingAward - 1;
    } else {
      newRating = ratingAward < value ? value : value - 1;
    }
    setRatingAward(newRating);
    rateAward({
      applicationID: application.id,
      awardsRating: newRating,
    });
  };

  const handleRatingCertification = (value: number) => {
    let newRating: number;
    if (value === ratingCertification) {
      newRating = ratingCertification - 1;
    } else {
      newRating = ratingCertification < value ? value : value - 1;
    }
    setRatingCertification(newRating);
    rateCertificate({
      applicationID: application.id,
      certificationRating: newRating,
    });
  };

  return (
    <div
      id="divToPrint"
      className="w-full relative mx-auto scroll-my-12 print:p-12"
    >
      <section className="mx-auto bg-white tracking-tight print:shadow-none w-full max-w-4xl space-y-4  print:space-y-6">
        <div className="flex-1 w-full">
          <div>
            <div className="flex items-center justify-between gap-x-4 tracking-tight">
              <div className="flex-1 space-y-1.5">
                <h1 className="text-2xl font-bold text-gray-700">
                  {application.applicantName}
                </h1>
                {application.workerBio.map((bioData, index) => (
                  <p
                    key={index}
                    className="max-w-2xl text-pretty text-sm text-gray-700"
                  >
                    {JSON.parse(JSON.stringify(bioData)).currentJobTitle}
                  </p>
                ))}
                <div className="max-w-md items-center text-pretty text-xs text-gray-700">
                  <div className="flex items-center gap-x-1.5 align-baseline leading-none hover:underline">
                    <MapPin className="h-4 w-4" />
                    {application.workerBio.map((bioData, index) => (
                      <p key={index}>
                        {JSON.parse(JSON.stringify(bioData)).county}
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  {application.workerContact.flatMap((contact, index) => (
                    <div
                      key={index}
                      className="flex gap-x-1 pt-1 text-sm text-gray-700 print:hidden"
                    >
                      {JSON.parse(JSON.stringify(contact)).email ? (
                        <Button
                          className=""
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a
                            href={`mailto:${
                              JSON.parse(JSON.stringify(contact)).email
                            }`}
                          >
                            <MailIcon className="w-5 -m-1 h-5" />
                          </a>
                        </Button>
                      ) : null}
                      {JSON.parse(JSON.stringify(contact)).phone ? (
                        <Button
                          className=""
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a
                            href={`tel:${
                              JSON.parse(JSON.stringify(contact)).phone
                            }`}
                          >
                            <PhoneIcon className="w-5 -m-1 h-5" />
                          </a>
                        </Button>
                      ) : null}
                      {JSON.parse(JSON.stringify(contact)).secondaryEmail ? (
                        <Button
                          className=""
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a
                            href={`mailto:${
                              JSON.parse(JSON.stringify(contact)).secondaryEmail
                            }`}
                          >
                            <MailPlus className="w-5 -m-1 h-5" />
                          </a>
                        </Button>
                      ) : null}
                      {JSON.parse(JSON.stringify(contact)).secondaryPhone ? (
                        <Button
                          className=""
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a
                            href={`tel:${
                              JSON.parse(JSON.stringify(contact)).secondaryPhone
                            }`}
                          >
                            <PhoneForwardedIcon className="w-5 -m-1 h-5" />
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  ))}
                </div>
                <div className="hidden flex-col gap-x-1 text-sm text-gray-700 print:flex">
                  {application.workerContact.flatMap((contact, index) => (
                    <div key={index}>
                      {JSON.parse(JSON.stringify(contact)).email ? (
                        <a
                          href={`mailto:${
                            JSON.parse(JSON.stringify(contact)).email
                          }`}
                        >
                          <span className="underline">
                            {JSON.parse(JSON.stringify(contact)).email}
                          </span>
                        </a>
                      ) : null}
                      {JSON.parse(JSON.stringify(contact)).phone ? (
                        <a
                          href={`tel:${
                            JSON.parse(JSON.stringify(contact)).phone
                          }`}
                        >
                          <span className="underline">
                            {JSON.parse(JSON.stringify(contact)).phone}
                          </span>
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-shrink-0 flex justify-end">
                {application.workerBio.flatMap((bioData, index) => (
                  <div key={index}>
                    {JSON.parse(JSON.stringify(bioData)).profilePic ? (
                      <div>
                        <div className="flex-none w-16 h-16 border rounded-sm border-gray-200 md:hidden bg-sky-100 text-indigo-600 flex items-center justify-center">
                          <Image
                            src={
                              JSON.parse(JSON.stringify(bioData))
                                .profilePic as string
                            }
                            alt={
                              JSON.parse(JSON.stringify(bioData)).name as string
                            }
                            width={64}
                            className="rounded-sm"
                            height={64}
                          />
                        </div>
                        <div className="hidden flex-none w-20 h-20 border rounded-sm border-gray-200 bg-sky-100 text-indigo-600 md:flex items-center justify-center">
                          <Image
                            src={
                              JSON.parse(JSON.stringify(bioData))
                                .profilePic as string
                            }
                            alt={
                              JSON.parse(JSON.stringify(bioData)).name as string
                            }
                            width={80}
                            className="rounded-sm"
                            height={80}
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex-none w-16 h-16 border rounded-sm border-gray-200 md:hidden bg-sky-100 text-indigo-600 flex items-center justify-center">
                          <Image
                            src={
                              "https://res.cloudinary.com/dx0i37cyd/image/upload/v1708947730/avatar-159236_1280_1_r7od9k.png"
                            }
                            alt="Profile Picture"
                            width={64}
                            className="rounded-sm"
                            height={64}
                            priority={true}
                          />
                        </div>
                        <div className="hidden flex-none w-20 h-20 border rounded-sm border-gray-200 bg-sky-100 text-indigo-600 md:flex items-center justify-center">
                          <Image
                            src={
                              "https://res.cloudinary.com/dx0i37cyd/image/upload/v1708947730/avatar-159236_1280_1_r7od9k.png"
                            }
                            alt="Profile Picture"
                            width={80}
                            className="rounded-sm"
                            height={80}
                            priority={true}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Section className="tracking-tight mt-4">
              <div className="flex items-center justify-between  border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-700">About</h2>
                <div className="flex items-center">
                  {aboutLoading && (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin shrink-0 text-gray-600" />
                  )}
                  <p className="mr-1.5 text-lg text-gray-600 font-semibold">
                    Rate:
                  </p>
                  <div className="flex items-center gap-x-1 flex-row">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <svg
                        key={value}
                        viewBox="0 0 1920 1920"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 cursor-pointer"
                        stroke="#005580"
                        onClick={() => handleRatingAbout(value)}
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {value <= ratingAbout ? (
                            <path
                              d="M1915.918 737.475c-10.955-33.543-42.014-56.131-77.364-56.131h-612.029l-189.063-582.1v-.112C1026.394 65.588 995.335 43 959.984 43c-35.237 0-66.41 22.588-77.365 56.245L693.443 681.344H81.415c-35.35 0-66.41 22.588-77.365 56.131-10.955 33.544.79 70.137 29.478 91.03l495.247 359.831-189.177 582.212c-10.955 33.657 1.13 70.25 29.817 90.918 14.23 10.278 30.946 15.487 47.66 15.487 16.716 0 33.432-5.21 47.775-15.6l495.134-359.718 495.021 359.718c28.574 20.781 67.087 20.781 95.662.113 28.687-20.668 40.658-57.261 29.703-91.03l-189.176-582.1 495.36-359.83c28.574-20.894 40.433-57.487 29.364-91.03"
                              fill="#005580"
                              fillRule="evenodd"
                            />
                          ) : (
                            <path
                              d="M1306.181 1110.407c-28.461 20.781-40.32 57.261-29.477 91.03l166.136 511.398-435.05-316.122c-28.686-20.781-67.086-20.781-95.66 0l-435.05 316.122 166.25-511.623c10.842-33.544-1.017-70.024-29.591-90.805L178.577 794.285h537.825c35.351 0 66.523-22.701 77.365-56.245l166.25-511.51 166.136 511.397a81.155 81.155 0 0 0 77.365 56.358h537.939l-435.276 316.122Zm609.77-372.819c-10.956-33.656-42.014-56.244-77.365-56.244h-612.141l-189.064-582.1C1026.426 65.589 995.367 43 960.017 43c-35.351 0-66.523 22.588-77.365 56.245L693.475 681.344H81.335c-35.351 0-66.41 22.588-77.366 56.244-10.842 33.657 1.017 70.137 29.591 90.918l495.247 359.718-189.29 582.211c-10.842 33.657 1.017 70.137 29.704 90.918 14.23 10.39 31.059 15.586 47.661 15.586 16.829 0 33.657-5.195 47.887-15.699l495.248-359.718 495.02 359.718c28.575 20.894 67.088 20.894 95.775.113 28.574-20.781 40.433-57.261 29.59-91.03l-189.289-582.1 495.247-359.717c28.687-20.781 40.546-57.261 29.59-90.918Z"
                              fill="#005580"
                              fillRule="evenodd"
                            />
                          )}
                        </g>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-pretty text-sm text-gray-700">
                <QuillPreview htmlContent={application.about as string} />
              </div>
            </Section>
            <Section className="tracking-tight mt-4">
              <div className="flex items-center justify-between  border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-700">
                  Work Experience
                </h2>
                <div className="flex items-center">
                  {experienceLoading && (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin shrink-0 text-gray-600" />
                  )}
                  <p className="mr-1.5 text-lg text-gray-600 font-semibold">
                    Rate:
                  </p>
                  <div className="flex items-center gap-x-1 flex-row">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <svg
                        key={value}
                        viewBox="0 0 1920 1920"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 cursor-pointer"
                        stroke="#005580"
                        onClick={() => handleRatingExperience(value)}
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {value <= ratingExperience ? (
                            <path
                              d="M1915.918 737.475c-10.955-33.543-42.014-56.131-77.364-56.131h-612.029l-189.063-582.1v-.112C1026.394 65.588 995.335 43 959.984 43c-35.237 0-66.41 22.588-77.365 56.245L693.443 681.344H81.415c-35.35 0-66.41 22.588-77.365 56.131-10.955 33.544.79 70.137 29.478 91.03l495.247 359.831-189.177 582.212c-10.955 33.657 1.13 70.25 29.817 90.918 14.23 10.278 30.946 15.487 47.66 15.487 16.716 0 33.432-5.21 47.775-15.6l495.134-359.718 495.021 359.718c28.574 20.781 67.087 20.781 95.662.113 28.687-20.668 40.658-57.261 29.703-91.03l-189.176-582.1 495.36-359.83c28.574-20.894 40.433-57.487 29.364-91.03"
                              fill="#005580"
                              fillRule="evenodd"
                            />
                          ) : (
                            <path
                              d="M1306.181 1110.407c-28.461 20.781-40.32 57.261-29.477 91.03l166.136 511.398-435.05-316.122c-28.686-20.781-67.086-20.781-95.66 0l-435.05 316.122 166.25-511.623c10.842-33.544-1.017-70.024-29.591-90.805L178.577 794.285h537.825c35.351 0 66.523-22.701 77.365-56.245l166.25-511.51 166.136 511.397a81.155 81.155 0 0 0 77.365 56.358h537.939l-435.276 316.122Zm609.77-372.819c-10.956-33.656-42.014-56.244-77.365-56.244h-612.141l-189.064-582.1C1026.426 65.589 995.367 43 960.017 43c-35.351 0-66.523 22.588-77.365 56.245L693.475 681.344H81.335c-35.351 0-66.41 22.588-77.366 56.244-10.842 33.657 1.017 70.137 29.591 90.918l495.247 359.718-189.29 582.211c-10.842 33.657 1.017 70.137 29.704 90.918 14.23 10.39 31.059 15.586 47.661 15.586 16.829 0 33.657-5.195 47.887-15.699l495.248-359.718 495.02 359.718c28.575 20.894 67.088 20.894 95.775.113 28.574-20.781 40.433-57.261 29.59-91.03l-189.289-582.1 495.247-359.717c28.687-20.781 40.546-57.261 29.59-90.918Z"
                              fill="#005580"
                              fillRule="evenodd"
                            />
                          )}
                        </g>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              {application.experience.flatMap((work, index) => {
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between gap-x-2 text-base">
                        <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none">
                          <a
                            className="hover:underline text-gray-700"
                            href="#!"
                          >
                            {JSON.parse(JSON.stringify(work)).nameCompany}
                          </a>
                          <span className="inline-flex gap-x-1">
                            <Badge
                              variant="secondary"
                              className="align-middle rounded-sm border text-gray-600 capitalize border-gray-300 text-xs"
                            >
                              {JSON.parse(JSON.stringify(work)).employmentType}
                            </Badge>
                          </span>
                        </h3>
                        <div className="text-sm tabular-nums text-gray-600">
                          {
                            JSON.parse(JSON.stringify(work))
                              .startMonth as string
                          }
                          /
                          {JSON.parse(JSON.stringify(work)).startYear as string}{" "}
                          -{" "}
                          {JSON.parse(JSON.stringify(work)).endMonth as string}/
                          {JSON.parse(JSON.stringify(work)).endYear as string}
                        </div>
                      </div>

                      {JSON.parse(JSON.stringify(work)).position && (
                        <h4 className="text-sm leading-none text-gray-700">
                          {JSON.parse(JSON.stringify(work)).position}
                        </h4>
                      )}
                    </CardHeader>
                    {JSON.parse(JSON.stringify(work)).description && (
                      <CardContent className="text-sm text-gray-700">
                        <QuillPreview
                          htmlContent={
                            JSON.parse(JSON.stringify(work))
                              .description as string
                          }
                        />
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </Section>
            <Section className="tracking-tight mt-4">
              <div className="flex items-center justify-between  border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-700">Education</h2>
                <div className="flex items-center">
                  {educationLoading && (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin shrink-0 text-gray-600" />
                  )}
                  <p className="mr-1.5 text-lg text-gray-600 font-semibold">
                    Rate:
                  </p>
                  <div className="flex items-center gap-x-1 flex-row">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <svg
                        key={value}
                        viewBox="0 0 1920 1920"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 cursor-pointer"
                        stroke="#005580"
                        onClick={() => handleRatingEducation(value)}
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {value <= ratingEducation ? (
                            <path
                              d="M1915.918 737.475c-10.955-33.543-42.014-56.131-77.364-56.131h-612.029l-189.063-582.1v-.112C1026.394 65.588 995.335 43 959.984 43c-35.237 0-66.41 22.588-77.365 56.245L693.443 681.344H81.415c-35.35 0-66.41 22.588-77.365 56.131-10.955 33.544.79 70.137 29.478 91.03l495.247 359.831-189.177 582.212c-10.955 33.657 1.13 70.25 29.817 90.918 14.23 10.278 30.946 15.487 47.66 15.487 16.716 0 33.432-5.21 47.775-15.6l495.134-359.718 495.021 359.718c28.574 20.781 67.087 20.781 95.662.113 28.687-20.668 40.658-57.261 29.703-91.03l-189.176-582.1 495.36-359.83c28.574-20.894 40.433-57.487 29.364-91.03"
                              fill="#005580"
                              fillRule="evenodd"
                            />
                          ) : (
                            <path
                              d="M1306.181 1110.407c-28.461 20.781-40.32 57.261-29.477 91.03l166.136 511.398-435.05-316.122c-28.686-20.781-67.086-20.781-95.66 0l-435.05 316.122 166.25-511.623c10.842-33.544-1.017-70.024-29.591-90.805L178.577 794.285h537.825c35.351 0 66.523-22.701 77.365-56.245l166.25-511.51 166.136 511.397a81.155 81.155 0 0 0 77.365 56.358h537.939l-435.276 316.122Zm609.77-372.819c-10.956-33.656-42.014-56.244-77.365-56.244h-612.141l-189.064-582.1C1026.426 65.589 995.367 43 960.017 43c-35.351 0-66.523 22.588-77.365 56.245L693.475 681.344H81.335c-35.351 0-66.41 22.588-77.366 56.244-10.842 33.657 1.017 70.137 29.591 90.918l495.247 359.718-189.29 582.211c-10.842 33.657 1.017 70.137 29.704 90.918 14.23 10.39 31.059 15.586 47.661 15.586 16.829 0 33.657-5.195 47.887-15.699l495.248-359.718 495.02 359.718c28.575 20.894 67.088 20.894 95.775.113 28.574-20.781 40.433-57.261 29.59-91.03l-189.289-582.1 495.247-359.717c28.687-20.781 40.546-57.261 29.59-90.918Z"
                              fill="#005580"
                              fillRule="evenodd"
                            />
                          )}
                        </g>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              {application.tertiaryEducation?.flatMap((education, index) => {
                return (
                  <Card key={index} className="text-sm">
                    <CardHeader>
                      <div className="flex items-center text-gray-700 justify-between gap-x-2 text-base">
                        <h3 className="font-semibold text-gray-700 leading-none">
                          {JSON.parse(JSON.stringify(education)).institution}
                        </h3>
                        <div className="text-sm tabular-nums text-gray-600">
                          {
                            JSON.parse(JSON.stringify(education))
                              .startMonth as string
                          }
                          /
                          {
                            JSON.parse(JSON.stringify(education))
                              .startYear as string
                          }{" "}
                          -{" "}
                          {
                            JSON.parse(JSON.stringify(education))
                              .endMonth as string
                          }
                          /
                          {
                            JSON.parse(JSON.stringify(education))
                              .endYear as string
                          }
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="mt-2 text-gray-700">
                      <p>{JSON.parse(JSON.stringify(education)).programArea}</p>
                      <p>{JSON.parse(JSON.stringify(education)).field}</p>
                      <p>{JSON.parse(JSON.stringify(education)).grade}</p>
                      <div>
                        <QuillPreview
                          htmlContent={
                            JSON.parse(JSON.stringify(education))
                              .activities as string
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {application.secondaryEducation.flatMap(
                (secondaryEducation, index) => (
                  <Card key={index} className="text-sm">
                    <CardHeader>
                      <div className="flex items-center text-gray-700 justify-between gap-x-2 text-base">
                        <h3 className="font-semibold text-gray-700 leading-none">
                          {
                            JSON.parse(JSON.stringify(secondaryEducation))
                              .school
                          }
                        </h3>
                        <div className="text-sm tabular-nums text-gray-600">
                          {
                            JSON.parse(JSON.stringify(secondaryEducation))
                              .startMonth as string
                          }
                          /
                          {
                            JSON.parse(JSON.stringify(secondaryEducation))
                              .startYear as string
                          }{" "}
                          -{" "}
                          {
                            JSON.parse(JSON.stringify(secondaryEducation))
                              .endMonth as string
                          }
                          /
                          {
                            JSON.parse(JSON.stringify(secondaryEducation))
                              .endYear as string
                          }
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="mt-2">
                      <p>
                        {JSON.parse(JSON.stringify(secondaryEducation)).county}
                      </p>
                    </CardContent>
                  </Card>
                )
              )}
            </Section>
            {application.userSkills.flatMap((skills) => (
              <Section
                key={JSON.parse(JSON.stringify(skills)).id}
                className="tracking-tight mt-4"
              >
                <div className="flex items-center justify-between  border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-700">
                    Candidate&apos;s Skills
                  </h2>
                  <div className="flex items-center">
                    {skillsLoading && (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin shrink-0 text-gray-600" />
                    )}
                    <p className="mr-1.5 text-lg text-gray-600 font-semibold">
                      Rate:
                    </p>
                    <div className="flex items-center gap-x-1 flex-row">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <svg
                          key={value}
                          viewBox="0 0 1920 1920"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 cursor-pointer"
                          stroke="#005580"
                          onClick={() => handleRatingSkills(value)}
                        >
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {value <= ratingSkills ? (
                              <path
                                d="M1915.918 737.475c-10.955-33.543-42.014-56.131-77.364-56.131h-612.029l-189.063-582.1v-.112C1026.394 65.588 995.335 43 959.984 43c-35.237 0-66.41 22.588-77.365 56.245L693.443 681.344H81.415c-35.35 0-66.41 22.588-77.365 56.131-10.955 33.544.79 70.137 29.478 91.03l495.247 359.831-189.177 582.212c-10.955 33.657 1.13 70.25 29.817 90.918 14.23 10.278 30.946 15.487 47.66 15.487 16.716 0 33.432-5.21 47.775-15.6l495.134-359.718 495.021 359.718c28.574 20.781 67.087 20.781 95.662.113 28.687-20.668 40.658-57.261 29.703-91.03l-189.176-582.1 495.36-359.83c28.574-20.894 40.433-57.487 29.364-91.03"
                                fill="#005580"
                                fillRule="evenodd"
                              />
                            ) : (
                              <path
                                d="M1306.181 1110.407c-28.461 20.781-40.32 57.261-29.477 91.03l166.136 511.398-435.05-316.122c-28.686-20.781-67.086-20.781-95.66 0l-435.05 316.122 166.25-511.623c10.842-33.544-1.017-70.024-29.591-90.805L178.577 794.285h537.825c35.351 0 66.523-22.701 77.365-56.245l166.25-511.51 166.136 511.397a81.155 81.155 0 0 0 77.365 56.358h537.939l-435.276 316.122Zm609.77-372.819c-10.956-33.656-42.014-56.244-77.365-56.244h-612.141l-189.064-582.1C1026.426 65.589 995.367 43 960.017 43c-35.351 0-66.523 22.588-77.365 56.245L693.475 681.344H81.335c-35.351 0-66.41 22.588-77.366 56.244-10.842 33.657 1.017 70.137 29.591 90.918l495.247 359.718-189.29 582.211c-10.842 33.657 1.017 70.137 29.704 90.918 14.23 10.39 31.059 15.586 47.661 15.586 16.829 0 33.657-5.195 47.887-15.699l495.248-359.718 495.02 359.718c28.575 20.894 67.088 20.894 95.775.113 28.574-20.781 40.433-57.261 29.59-91.03l-189.289-582.1 495.247-359.717c28.687-20.781 40.546-57.261 29.59-90.918Z"
                                fill="#005580"
                                fillRule="evenodd"
                              />
                            )}
                          </g>
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-gray-700 text-sm">
                  {((skills as any)?.skills as string[] | undefined)?.map(
                    (skill: string) => {
                      return (
                        <div
                          key={skill}
                          className="inline-flex items-center tracking-tighter leading-tight rounded-sm bg-gray-100 px-2 py-1  text-gray-600 ring-1 ring-inset ring-gray-500/20"
                        >
                          <span className="text-[14px] font-semibold">{skill}</span>
                        </div>
                      );
                    }
                  )}
                </div>
              </Section>
            ))}

            <Section className="tracking-tight text-sm mt-4">
              <div className="flex items-center justify-between  border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-700">
                  Awards & Honours
                </h2>
                <div className="flex items-center">
                  {awardLoading && (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin shrink-0 text-gray-600" />
                  )}
                  <p className="mr-1.5 text-lg text-gray-600 font-semibold">
                    Rate:
                  </p>
                  <div className="flex items-center gap-x-1 flex-row">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <svg
                        key={value}
                        viewBox="0 0 1920 1920"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 cursor-pointer"
                        stroke="#005580"
                        onClick={() => handleRatingAward(value)}
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {value <= ratingAward ? (
                            <path
                              d="M1915.918 737.475c-10.955-33.543-42.014-56.131-77.364-56.131h-612.029l-189.063-582.1v-.112C1026.394 65.588 995.335 43 959.984 43c-35.237 0-66.41 22.588-77.365 56.245L693.443 681.344H81.415c-35.35 0-66.41 22.588-77.365 56.131-10.955 33.544.79 70.137 29.478 91.03l495.247 359.831-189.177 582.212c-10.955 33.657 1.13 70.25 29.817 90.918 14.23 10.278 30.946 15.487 47.66 15.487 16.716 0 33.432-5.21 47.775-15.6l495.134-359.718 495.021 359.718c28.574 20.781 67.087 20.781 95.662.113 28.687-20.668 40.658-57.261 29.703-91.03l-189.176-582.1 495.36-359.83c28.574-20.894 40.433-57.487 29.364-91.03"
                              fill="#005580"
                              fillRule="evenodd"
                            />
                          ) : (
                            <path
                              d="M1306.181 1110.407c-28.461 20.781-40.32 57.261-29.477 91.03l166.136 511.398-435.05-316.122c-28.686-20.781-67.086-20.781-95.66 0l-435.05 316.122 166.25-511.623c10.842-33.544-1.017-70.024-29.591-90.805L178.577 794.285h537.825c35.351 0 66.523-22.701 77.365-56.245l166.25-511.51 166.136 511.397a81.155 81.155 0 0 0 77.365 56.358h537.939l-435.276 316.122Zm609.77-372.819c-10.956-33.656-42.014-56.244-77.365-56.244h-612.141l-189.064-582.1C1026.426 65.589 995.367 43 960.017 43c-35.351 0-66.523 22.588-77.365 56.245L693.475 681.344H81.335c-35.351 0-66.41 22.588-77.366 56.244-10.842 33.657 1.017 70.137 29.591 90.918l495.247 359.718-189.29 582.211c-10.842 33.657 1.017 70.137 29.704 90.918 14.23 10.39 31.059 15.586 47.661 15.586 16.829 0 33.657-5.195 47.887-15.699l495.248-359.718 495.02 359.718c28.575 20.894 67.088 20.894 95.775.113 28.574-20.781 40.433-57.261 29.59-91.03l-189.289-582.1 495.247-359.717c28.687-20.781 40.546-57.261 29.59-90.918Z"
                              fill="#005580"
                              fillRule="evenodd"
                            />
                          )}
                        </g>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              {application.award.flatMap((award) => {
                return (
                  <Card key={JSON.parse(JSON.stringify(award)).id}>
                    <CardHeader>
                      <div className="flex items-center text-gray-700 justify-between gap-x-2 text-base">
                        <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none">
                          <a
                            className="hover:underline text-gray-700"
                            href="#!"
                          >
                            {JSON.parse(JSON.stringify(award)).title}
                          </a>
                        </h3>
                        <div className="text-sm tabular-nums text-gray-600">
                          {
                            JSON.parse(JSON.stringify(award))
                              .awardedMonth as string
                          }
                          /
                          {
                            JSON.parse(JSON.stringify(award))
                              .awardedYear as string
                          }
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700">
                      <QuillPreview
                        htmlContent={
                          JSON.parse(JSON.stringify(award))
                            .description as string
                        }
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </Section>

            <Section className="tracking-tight text-sm mt-4">
              <div className="flex items-center justify-between  border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-700">
                  Certifications
                </h2>
                <div className="flex items-center">
                  {certificationLoading && (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin shrink-0 text-gray-600" />
                  )}
                  <p className="mr-1.5 text-lg text-gray-600 font-semibold">
                    Rate:
                  </p>
                  <div className="flex items-center gap-x-1 flex-row">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <svg
                        key={value}
                        viewBox="0 0 1920 1920"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 cursor-pointer"
                        stroke="#005580"
                        onClick={() => handleRatingCertification(value)}
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {value <= ratingCertification ? (
                            <path
                              d="M1915.918 737.475c-10.955-33.543-42.014-56.131-77.364-56.131h-612.029l-189.063-582.1v-.112C1026.394 65.588 995.335 43 959.984 43c-35.237 0-66.41 22.588-77.365 56.245L693.443 681.344H81.415c-35.35 0-66.41 22.588-77.365 56.131-10.955 33.544.79 70.137 29.478 91.03l495.247 359.831-189.177 582.212c-10.955 33.657 1.13 70.25 29.817 90.918 14.23 10.278 30.946 15.487 47.66 15.487 16.716 0 33.432-5.21 47.775-15.6l495.134-359.718 495.021 359.718c28.574 20.781 67.087 20.781 95.662.113 28.687-20.668 40.658-57.261 29.703-91.03l-189.176-582.1 495.36-359.83c28.574-20.894 40.433-57.487 29.364-91.03"
                              fill="#005580"
                              fillRule="evenodd"
                            />
                          ) : (
                            <path
                              d="M1306.181 1110.407c-28.461 20.781-40.32 57.261-29.477 91.03l166.136 511.398-435.05-316.122c-28.686-20.781-67.086-20.781-95.66 0l-435.05 316.122 166.25-511.623c10.842-33.544-1.017-70.024-29.591-90.805L178.577 794.285h537.825c35.351 0 66.523-22.701 77.365-56.245l166.25-511.51 166.136 511.397a81.155 81.155 0 0 0 77.365 56.358h537.939l-435.276 316.122Zm609.77-372.819c-10.956-33.656-42.014-56.244-77.365-56.244h-612.141l-189.064-582.1C1026.426 65.589 995.367 43 960.017 43c-35.351 0-66.523 22.588-77.365 56.245L693.475 681.344H81.335c-35.351 0-66.41 22.588-77.366 56.244-10.842 33.657 1.017 70.137 29.591 90.918l495.247 359.718-189.29 582.211c-10.842 33.657 1.017 70.137 29.704 90.918 14.23 10.39 31.059 15.586 47.661 15.586 16.829 0 33.657-5.195 47.887-15.699l495.248-359.718 495.02 359.718c28.575 20.894 67.088 20.894 95.775.113 28.574-20.781 40.433-57.261 29.59-91.03l-189.289-582.1 495.247-359.717c28.687-20.781 40.546-57.261 29.59-90.918Z"
                              fill="#005580"
                              fillRule="evenodd"
                            />
                          )}
                        </g>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              {application.certificateLicense.flatMap((item) => {
                return (
                  <Card key={JSON.parse(JSON.stringify(item)).id}>
                    <CardHeader>
                      <div className="flex text-gray-700 items-center justify-between gap-x-2 text-base">
                        <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none">
                          <a
                            className="hover:underline text-gray-700"
                            href="#!"
                          >
                            {
                              JSON.parse(JSON.stringify(item))
                                .certificateLicenseName
                            }
                          </a>
                        </h3>
                        <div className="text-sm tabular-nums text-gray-600">
                          {
                            JSON.parse(JSON.stringify(item))
                              .validStartMonth as string
                          }
                          /
                          {
                            JSON.parse(JSON.stringify(item))
                              .validStartYear as string
                          }
                          -
                          {
                            JSON.parse(JSON.stringify(item))
                              .validEndMonth as string
                          }
                          /
                          {
                            JSON.parse(JSON.stringify(item))
                              .validEndYear as string
                          }
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700">
                      <QuillPreview
                        htmlContent={
                          JSON.parse(JSON.stringify(item)).description as string
                        }
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </Section>

            <Section className="tracking-tight text-sm mt-4">
              <h2 className="text-xl font-bold text-gray-700 border-b border-gray-200">
                Languages
              </h2>
              {application.language.flatMap((item) => {
                return (
                  <Card key={JSON.parse(JSON.stringify(item)).id}>
                    <CardContent className="text-sm">
                      <p className="inline-flex text-gray-700 items-center justify-center gap-x-1 font-normal leading-tight">
                        <span>{JSON.parse(JSON.stringify(item)).language}</span>
                        <ArrowBigRight className="h-4 w-4 mx-1" />
                        {JSON.parse(JSON.stringify(item)).proficiency}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </Section>
          </div>
        </div>
      </section>
    </div>
  );
}
