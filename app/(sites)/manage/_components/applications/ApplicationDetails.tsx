"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Application } from "@prisma/client";
import QuillPreview from "@/components/QuillPreview";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
    <>
      <div className="w-full relative mx-auto">
        <section className="w-full print:space-y-4">
          <div className="flex-1 w-full">
            <div>
              <div className="w-full flex flex-col leading-tight items-center justify-center">
                {application.applicantName && (
                  <h1 className="text-2xl font-bold text-gray-600">
                    {application.applicantName}
                  </h1>
                )}
                {application.workerContact &&
                  application.workerContact.flatMap((contact, index) => (
                    <p className="-mt-0.5 text-sm text-gray-600" key={index}>
                      <span className="text-sm">
                        P.O Box{" "}
                        {JSON.parse(JSON.stringify(contact)).postal && (
                          <span>
                            {JSON.parse(JSON.stringify(contact)).postal}{" "}
                          </span>
                        )}
                      </span>
                      {"-"}
                      <span className="text-sm">
                        {JSON.parse(JSON.stringify(contact)).zip}
                      </span>
                      ,{" "}
                      <span className="text-sm">
                        {JSON.parse(JSON.stringify(contact)).county}
                      </span>{" "}
                      Kenya
                    </p>
                  ))}

                {application.workerContact &&
                  application.workerContact.flatMap((contact, index) => (
                    <div className="flex gap-x-1 items-center h-4" key={index}>
                      {JSON.parse(JSON.stringify(contact)).email && (
                        <p className="text-pretty text-sm text-gray-600">
                          {JSON.parse(JSON.stringify(contact)).email}
                        </p>
                      )}
                      {JSON.parse(JSON.stringify(contact)).email && (
                        <Separator orientation="vertical" />
                      )}
                      {JSON.parse(JSON.stringify(contact)).phone && (
                        <p className="text-pretty text-sm text-gray-600">
                          {JSON.parse(JSON.stringify(contact)).phone}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
              {application.about && (
                <Section className="mt-1 w-full">
                  <div className="flex items-center justify-between  border-b border-gray-200">
                    <h2 className="text-lg md:text-xl font-bold text-gray-700">
                      About Summary
                    </h2>
                    <div className="flex items-center print:hidden">
                      {aboutLoading && (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin shrink-0 text-gray-600" />
                      )}
                      <p className="mr-1.5 text-sm text-gray-600 font-semibold">
                        Rate:
                      </p>
                      <div className="flex items-center gap-x-1 flex-row">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <svg
                            key={value}
                            viewBox="0 0 1920 1920"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4  cursor-pointer"
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
                  <div className="text-pretty -mt-0.5 text-sm text-gray-600">
                    <QuillPreview htmlContent={application.about as string} />
                  </div>
                </Section>
              )}
              {application.experience && (
                <Section className="mt-2 w-full">
                  <div className="flex items-center justify-between  border-b border-gray-200">
                    <h2 className="text-lg md:text-xl font-bold text-gray-700">
                      Work Experience
                    </h2>
                    <div className="flex items-center print:hidden">
                      {experienceLoading && (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin shrink-0 text-gray-600" />
                      )}
                      <p className="mr-1.5 text-sm text-gray-600 font-semibold">
                        Rate:
                      </p>
                      <div className="flex items-center gap-x-1 flex-row">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <svg
                            key={value}
                            viewBox="0 0 1920 1920"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4  cursor-pointer"
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
                      <Card key={index} className="-mt-0.5">
                        <CardHeader>
                          <div className="flex items-center justify-between gap-x-2 text-sm">
                            <h3 className="flex items-center h-4 gap-x-1 font-semibold">
                              <span className="hover:underline text-gray-600">
                                {JSON.parse(JSON.stringify(work)).position}
                              </span>
                              {JSON.parse(JSON.stringify(work))
                                .employmentType && (
                                <Separator orientation="vertical" />
                              )}
                              <span className="text-gray-600 line-clamp-1 text-xs font-normal">
                                {
                                  JSON.parse(JSON.stringify(work))
                                    .employmentType
                                }
                              </span>
                            </h3>
                            <div className="text-sm line-clamp-1 tabular-nums text-gray-600">
                              {
                                JSON.parse(JSON.stringify(work))
                                  .startMonth as string
                              }
                              /
                              {
                                JSON.parse(JSON.stringify(work))
                                  .startYear as string
                              }{" "}
                              -{" "}
                              {JSON.parse(JSON.stringify(work)).endMonth &&
                              JSON.parse(JSON.stringify(work)).endYear ? (
                                <span>
                                  {
                                    JSON.parse(JSON.stringify(work))
                                      .endMonth as string
                                  }
                                  /
                                  {
                                    JSON.parse(JSON.stringify(work))
                                      .endYear as string
                                  }
                                </span>
                              ) : (
                                <>Present</>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between w-full">
                            {JSON.parse(JSON.stringify(work)).position && (
                              <h4 className="text-sm font-semibold text-gray-600">
                                {JSON.parse(JSON.stringify(work)).nameCompany}
                              </h4>
                            )}
                            <div>
                              {JSON.parse(JSON.stringify(work)).location && (
                                <h3 className="text-sm font normal text-gray-600">
                                  {JSON.parse(JSON.stringify(work)).location}
                                </h3>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        {JSON.parse(JSON.stringify(work)).description && (
                          <CardContent className="text-sm text-gray-600">
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
              )}
              <Section className="mt-2 w-full">
                <div className="flex items-center justify-between  border-b border-gray-200">
                  <h2 className="text-lg md:text-xl font-bold text-gray-700">
                    Education
                  </h2>
                  <div className="flex items-center print:hidden">
                    {educationLoading && (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin shrink-0 text-gray-600" />
                    )}
                    <p className="mr-1.5 text-sm text-gray-600 font-semibold">
                      Rate:
                    </p>
                    <div className="flex items-center gap-x-1 flex-row">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <svg
                          key={value}
                          viewBox="0 0 1920 1920"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4  cursor-pointer"
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
                {application.tertiaryEducation &&
                  application.tertiaryEducation?.flatMap((education, index) => {
                    return (
                      <Card key={index} className="-mt-0.5">
                        <CardHeader>
                          <div className="flex items-center text-gray-600 justify-between gap-x-2 text-sm">
                            <h3 className="font-semibold text-gray-600">
                              {
                                JSON.parse(JSON.stringify(education))
                                  .institution
                              }
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
                        <CardContent className="mt-1 text-sm text-gray-600">
                          <p>
                            {JSON.parse(JSON.stringify(education)).programArea}
                          </p>
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
                {application.secondaryEducation &&
                  application.secondaryEducation.flatMap(
                    (secondaryEducation, index) => (
                      <Card className="-mt-0.5" key={index}>
                        <CardHeader>
                          <div className="flex items-center text-gray-600 justify-between gap-x-2 text-sm">
                            <h3 className="font-semibold text-gray-600">
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
                        <CardContent className="mt-1 text-sm">
                          <p>
                            {
                              JSON.parse(JSON.stringify(secondaryEducation))
                                .county
                            }
                          </p>
                        </CardContent>
                      </Card>
                    )
                  )}
              </Section>
              {application.userSkills &&
                application.userSkills.flatMap((skills) => (
                  <Section
                    className="mt-2 w-full"
                    key={JSON.parse(JSON.stringify(skills)).id}
                  >
                    <div className="flex items-center justify-between  border-b border-gray-200">
                      <h2 className="text-lg md:text-xl font-bold text-gray-700">
                        Skills Summary
                      </h2>
                      <div className="flex items-center print:hidden">
                        {skillsLoading && (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin shrink-0 text-gray-600" />
                        )}
                        <p className="mr-1.5 text-sm text-gray-600 font-semibold">
                          Rate:
                        </p>
                        <div className="flex items-center gap-x-1 flex-row">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <svg
                              key={value}
                              viewBox="0 0 1920 1920"
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4  cursor-pointer"
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
                    <ul
                      role="list"
                      className="grid grid-cols-1 -mt-.5 pl-4 list-disc sm:grid-cols-2 text-gray-600 text-sm"
                    >
                      {((skills as any)?.skills as string[] | undefined)?.map(
                        (skill: string) => {
                          return (
                            <li key={skill} className="">
                              {skill}
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </Section>
                ))}

              {application.award && (
                <Section className="mt-2 w-full">
                  <div className="flex items-center justify-between  border-b border-gray-200">
                    <h2 className="text-lg md:text-xl font-bold text-gray-700">
                      Awards & Honours
                    </h2>
                    <div className="flex items-center print:hidden">
                      {awardLoading && (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin shrink-0 text-gray-600" />
                      )}
                      <p className="mr-1.5 text-sm text-gray-600 font-semibold">
                        Rate:
                      </p>
                      <div className="flex items-center gap-x-1 flex-row">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <svg
                            key={value}
                            viewBox="0 0 1920 1920"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4  cursor-pointer"
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
                      <Card
                        key={JSON.parse(JSON.stringify(award)).id}
                        className="-mt-0.5"
                      >
                        <CardHeader>
                          <div className="flex items-center text-gray-600 justify-between gap-x-2 text-sm">
                            <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold">
                              <a
                                className="hover:underline text-gray-600"
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
                        <CardContent className="text-sm text-gray-600">
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
              )}

              {application.certificateLicense && (
                <Section className="mt-2 w-full">
                  <div className="flex items-center justify-between  border-b border-gray-200">
                    <h2 className="text-lg md:text-xl font-bold text-gray-700">
                      Certifications
                    </h2>
                    <div className="flex items-center print:hidden">
                      {certificationLoading && (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin shrink-0 text-gray-600" />
                      )}
                      <p className="mr-1.5 text-sm text-gray-600 font-semibold">
                        Rate:
                      </p>
                      <div className="flex items-center gap-x-1 flex-row">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <svg
                            key={value}
                            viewBox="0 0 1920 1920"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4  cursor-pointer"
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
                      <Card
                        key={JSON.parse(JSON.stringify(item)).id}
                        className="-mt-0.5"
                      >
                        <CardHeader>
                          <div className="flex text-gray-600 items-center justify-between gap-x-2 text-sm">
                            <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold">
                              <a
                                className="hover:underline text-gray-600"
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
                        <CardContent className="text-sm text-gray-600">
                          <QuillPreview
                            htmlContent={
                              JSON.parse(JSON.stringify(item))
                                .description as string
                            }
                          />
                        </CardContent>
                      </Card>
                    );
                  })}
                </Section>
              )}

              {application.language && (
                <Section className="mt-2 w-full">
                  <h2 className="text-lg md:text-xl font-bold text-gray-600 border-b border-gray-200">
                    Languages
                  </h2>
                  {application.language.flatMap((item) => {
                    return (
                      <Card
                        key={JSON.parse(JSON.stringify(item)).id}
                        className="-mt-0.5"
                      >
                        <CardContent className="text-sm">
                          <p className="inline-flex text-gray-600 items-center justify-center gap-x-1 font-normal">
                            <span className="font-medium">
                              {JSON.parse(JSON.stringify(item)).language}
                            </span>
                            : {JSON.parse(JSON.stringify(item)).proficiency}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Section>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}