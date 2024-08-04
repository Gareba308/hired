import { Button } from "@/components/ui/button";
import { Application} from "@prisma/client";
import { format } from "date-fns";
import {
  Briefcase,
  Download,
  Loader2,
  Mail,
  MoveRight,
} from "lucide-react";
import { saveAs } from "file-saver";
import Link from "next/link";
import { useEffect, useState } from "react";
import cryptoRandomString from "crypto-random-string";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import MessageWorkerModal from "./MessageWorkerModal";
import { trpc } from "@/app/_trpc/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface UploadedResumeProps {
  application: Application;
}

const UploadedResume = ({ application}: UploadedResumeProps) => {
  const [finalUrl, setFinalUrl] = useState<string>("");
  const fileUrl = application.uploadedResumeUrl as string;
  const { toast } = useToast();
  const router = useRouter();
  const [rating, setRating] = useState<number>(application.ratingOverall || 0);
  const [messageOpen, setMessageOpen] = useState<boolean>(false);
  const messageOnClose = () => setMessageOpen((current) => !current);
  const messageOnConfirm = () => setMessageOpen((current) => !current);

  const [isUploadedResume, setIsUploadedResume] = useState<boolean>(
    application.rateWithUploadResume || false
  );

  useEffect(() => {
    const secureToken = cryptoRandomString({
      length: 30,
      type: "alphanumeric",
    });
    const urlWithToken = `${fileUrl}?token=${secureToken}`;
    setFinalUrl(urlWithToken);
  }, [fileUrl]);

  const handleDownload = async () => {
    try {
      const response = await fetch(application.uploadedResumeUrl as string);
      const blob = await response.blob();
      saveAs(blob, "resume.pdf");
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };
  const { mutate: rateUploadedResume, isLoading } =
    trpc.employerRateOverall.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "The rating has been recorded.",
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
            duration: 3000,
          });
        } else {
          toast({
            title: "Something went wrong",
            description: "There was a problem submitting your rating.",
            variant: "destructive",
            duration: 3000,
          });
        }
        window.location.reload();
      },
    });

  const handleRatingClick = (value: number) => {
    let newRating: number;
    if (value === rating) {
      newRating = rating - 1;
    } else {
      newRating = rating < value ? value : value - 1;
    }
    setRating(newRating);
    rateUploadedResume({
      applicationID: application.id,
      ratingOverall: newRating,
    });
  };

  const { mutate: rateWithUploadedResume } =
    trpc.employerRateWithUploadedResume.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "The changes have successfully been captured",
          variant: "default",
          duration: 3000,
        });
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
              "There was a problem submitting your update. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
        window.location.reload();
      },
    });

  const handleSwitchClick = async () => {
    setIsUploadedResume((prevState) => !prevState);
    rateWithUploadedResume({
      rateWithUploadResume: !isUploadedResume,
      applicationID: application.id,
    });
  };
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="w-full">
        <div className="flex flex-col items-start justify-between gap-x-4 sm:gap-6 lg:flex-row gap-y-6">
          <div className="lg:max-w-xl w-full py-2 sm:py-3">
            <div className="flex flex-row gap-x-3 sm:gap-x-8 lg:gap-x-10 items-center">
              <Link
                href={finalUrl as string}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="PDF"
                  role="img"
                  viewBox="0 0 512 512"
                  className="h-24 w-24 sm:h-32 sm:w-32 text-white rounded-sm"
                  fill="#005580"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <rect
                      width="512"
                      height="512"
                      rx="15%"
                      fill="#005580"
                    ></rect>
                    <path
                      fill="#ffffff"
                      d="M413 302c-9-10-29-15-56-15-16 0-33 2-53 5a252 252 0 0 1-52-69c10-30 17-59 17-81 0-17-6-44-30-44-7 0-13 4-17 10-10 18-6 58 13 100a898 898 0 0 1-50 117c-53 22-88 46-91 65-2 9 4 24 25 24 31 0 65-45 91-91a626 626 0 0 1 92-24c38 33 71 38 87 38 32 0 35-23 24-35zM227 111c8-12 26-8 26 16 0 16-5 42-15 72-18-42-18-75-11-88zM100 391c3-16 33-38 80-57-26 44-52 72-68 72-10 0-13-9-12-15zm197-98a574 574 0 0 0-83 22 453 453 0 0 0 36-84 327 327 0 0 0 47 62zm13 4c32-5 59-4 71-2 29 6 19 41-13 33-23-5-42-18-58-31z"
                    ></path>
                  </g>
                </svg>
              </Link>
              <div className=" flex flex-col items-start">
                <p className="text-base">
                  <span className="font-medium">Applicant:</span>{" "}
                  {application.applicantName}
                </p>
                <p className="text-base">
                  <span className="font-medium">Applied on:</span>{" "}
                    <>{format(application.createdAt, "PPP")}</>
                </p>
                <Button
                  variant="default"
                  onClick={handleDownload}
                  size="lg"
                  className="rounded-sm py-4 bg-slate-800 hover:bg-slate-800 mt-1.5 sm:mt-4 text-white hover:opacity-90"
                >
                  <Download className="h-5 w-5 mr-2.5" />
                  Download
                </Button>
              </div>
            </div>
            <div className="mt-2 text-base">
              <p>
                The above uploaded PDF can as well be used in evaluating
                candidate&apos;s application.
              </p>
              <p>
                Use the <span className="font-medium">Download</span> button at
                the top to download the PDF.
              </p>
            </div>
          </div>
          <div className="lg:max-w-lg w-full">
            <div className="block rounded-md max-w px-2 sm:px-3.5 space-y-2 bg-white border-gray-200 border py-2.5 sm:pt-3.5">
              <h2 className="text-[19px] text-start text-gray-700 font-semibold">
                Actions & Final Rating
              </h2>
              <div className="flex w-full mb-2 justify-between flex-row gap-x-10 sm:gap-12">
                <MessageWorkerModal
                  isOpen={messageOpen}
                  onClose={messageOnClose}
                  onConfirm={messageOnConfirm}
                  applicationID={application.id}
                />
                <div className="w-full">
                  <Button
                    variant="default"
                    size="lg"
                    onClick={() => setMessageOpen(true)}
                    className="rounded-sm w-full hover:bg-primary hover:opacity-90 font-normal"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
                <div className="w-full">
                  <Button
                    variant="default"
                    size="lg"
                    className="rounded-sm w-full bg-slate-800 hover:bg-slate-800 hover:opacity-90 font-normal"
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Invite
                  </Button>
                </div>
              </div>
              <div className="flex flex-col h-full justify-center">
                <div className="block rounded-md px-2 sm:px-3 -mt-1.5 space-y-2 bg-white py-2 sm:py-2.5">
                  <div>
                    <div className="flex items-center gap-x-1 flex-row">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <svg
                          key={value}
                          viewBox="0 0 1920 1920"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 cursor-pointer"
                          stroke="#005580"
                          onClick={() => handleRatingClick(value)}
                        >
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {value <= rating ? (
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
                  <div>
                    <p className="font-medium text-base -mt-1 flex items-center text-gray-600">
                      {isLoading && (
                        <Loader2 className="h-4 w-4 mr-0.5 animate-spin" />
                      )}{" "}
                      <span className="mr-1">Rating:</span>
                      {application.ratingOverall}/5
                      <MoveRight className="h-4 w-4 text-gray-600 ml-2 shrink-0" />
                      <span className="ml-1">
                        ({(application.ratingOverall! / 5) * 80}%)
                      </span>
                    </p>
                    <p className="flex font-normal justify-between items-center space-x-2">
                      <Label
                        htmlFor="rateWithUploadResume"
                        className="font-normal text-sm text-gray-700"
                      >
                        Use uploaded resume to rate instead of generated?
                      </Label>
                      <Switch
                        id="rateWithUploadResume"
                        checked={isUploadedResume}
                        onClick={handleSwitchClick}
                      />
                    </p>
                    <p className="text-xs font-normal mt-1 text-gray-600">
                      <span className="font-medium mr-0.5">Note:</span>The
                      rating can only take upto 80% of the final total score.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadedResume;
