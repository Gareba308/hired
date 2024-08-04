import { trpc } from "@/app/_trpc/client";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const JobsSide = ({
  image,
  slug,
  title,
  date,
  company,
  jobID,
  detailJobID
}: {
  image: string;
  slug: string;
  title: string;
  date: string;
  company: string;
  jobID: string;
  detailJobID: string;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isJobViewed, setIsJobViewed] = useState<boolean>(false);
  const [currentlyOpeningID, setCurrentlyOpeningID] = useState<string | null>(
    null
  );

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

  const { mutate: createJobView } = trpc.createView.useMutation({
    onMutate: ({ jobID }) => {
      setCurrentlyOpeningID(jobID);
      setIsLoading(true);
    },
    onSettled: () => {
      if (currentlyOpeningID) {
        setIsLoading(true);
        const navigatePromise = new Promise<void>((resolve, reject) => {
          router.push(`${slug}`);
          router.refresh();
        });
        navigatePromise
          .then(() => {
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error navigating:", error);
          });
      }
    },
  });

  const clickView = () => {
    if (isLoading) {
      return;
    }
    setIsJobViewed((prev) => !prev);
    createJobView({ jobID, viewed: !isJobViewed });
  };
  return (
    <div className="flex items-center lg:flex lg:flex-row lg:items-center">
      <div className="mr-4">
        {image ? (
          <div
            onClick={clickView}
            className="relative cursor-pointer h-[56px] w-[56px] overflow-hidden rounded-sm sm:h-[60px] sm:w-[60px]"
          >
            <Image src={image} alt={title} fill sizes="100%" priority />
          </div>
        ) : (
          <div
            onClick={clickView}
            className="sm:w-[60px] h-[56px] w-[56px] cursor-pointer py-1 px-0.5 sm:h-[60px] shrink-0 text-gray-600 border border-gray-200  bg-gray-100 hover:bg-secondary rounded-sm sm:flex items-center justify-center"
          >
            <div className="flex items-center justify-center shrink-0 w-full h-full">
              <div className="text-2xl sm:text-2xl font-medium shrink-0">
                {getInitials(company as string)}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="w-full">
        <h5>
          <span
            onClick={clickView}
            className="mb-[6px] block text-base cursor-pointer font-medium leading-snug text-primary hover:text-[#005580]"
          >
            {detailJobID !== jobID && currentlyOpeningID === jobID && isLoading ? (
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 mr-1 shrink-0 animate-spin" />
                <span className="line-clamp-1">{title}</span>
              </span>
            ) : (
              <span className="line-clamp-1">{title}</span>
            )}
          </span>
        </h5>
        <p className="text-xs font-medium text-body-color line-clamp-1">
          {company}
        </p>
        <p className="text-xs font-normal text-body-color line-clamp-1">
          {date}
        </p>
      </div>
    </div>
  );
};

export default JobsSide;
