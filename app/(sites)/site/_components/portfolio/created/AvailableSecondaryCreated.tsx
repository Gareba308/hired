import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { SecondaryEducation } from "@prisma/client";
import { File, Loader2, PenLine, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

interface AvailableSecondaryCreatedProps {
  secondaryEducation: SecondaryEducation;
  toggleEdit: () => void;
}

const AvailableSecondaryCreated = ({
  secondaryEducation,
  toggleEdit,
}: AvailableSecondaryCreatedProps) => {
  const { toast } = useToast();

  const router = useRouter();

  const { mutate: deleteSecondaryEducation, isLoading } =
    trpc.workerDeleteSecondaryEducation.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Successfully deleted you secondary education details",
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
              "There was a problem deleting your secondary education details. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const submitDelete = () => {
    deleteSecondaryEducation({ secondaryEducationID: secondaryEducation.id });
  };
  return (
    <div className="font-normal border border-gray-200 rounded-lg pb-3">
      <div className="bg-secondary rounded-tl-lg rounded-tr-lg border-b border-gray-200">
        <div className=" flex items-center justify-between py-1.5 lg:px-3 px-2.5">
          <h2 className="font-medium text-gray-600 text-lg">
            Secondary Education
          </h2>
          <div className="flex h-5 items-center">
            <Button
              onClick={toggleEdit}
              variant="link"
              disabled={isLoading}
              size="sm"
              type="button"
              className="flex items-center"
            >
              <PenLine className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" />
            <Button
              onClick={submitDelete}
              disabled={isLoading}
              variant="link"
              className="text-destructive-foreground"
            >
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin"/></> : <Trash className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
      <dl className="divide-y divide-gray-100 px-2.5 sm:px-3">
        <div className="py-3 sm:py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
          <dt className="font-medium text-base leading-6 text-gray-600">
            Name of school
          </dt>

          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
            {secondaryEducation.school ? (
              secondaryEducation.school
            ) : (
              <span className="italic text-sm">No details found</span>
            )}
          </dd>
        </div>

        <div className="py-3 sm:py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
          <dt className="font-medium text-base leading-6 text-gray-600">
            County of location
          </dt>

          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
            {secondaryEducation.county ? (
              secondaryEducation.county
            ) : (
              <span className="italic text-sm">No details found</span>
            )}
          </dd>
        </div>

        <div className="py-3 sm:py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
          <dt className="font-medium text-base leading-6 text-gray-600">
            Start date
          </dt>

          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
            <div className="flex flex-row w-full">
              {secondaryEducation.startMonth && secondaryEducation.startYear ? (
                <>
                  {secondaryEducation.startMonth}-{secondaryEducation.startYear}
                </>
              ) : (
                <span className="italic">No full details provided</span>
              )}
            </div>
          </dd>
        </div>

        <div className="py-3 sm:py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
          <dt className="font-medium text-base leading-6 text-gray-600">
            End date
          </dt>

          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
            <div className="flex flex-row  w-full">
              {secondaryEducation.endMonth && secondaryEducation.endYear ? (
                <>
                  {secondaryEducation.endMonth}-{secondaryEducation.endYear}
                </>
              ) : (
                <>
                  <span className="italic text-sm">No details provided</span>
                </>
              )}
            </div>
          </dd>
        </div>

        <div className="py-3 sm:py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
          <dt className="font-medium text-base leading-6 text-gray-600">
            Certificate uploaded
          </dt>

          <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
            {secondaryEducation.certificateUpload ? (
              <div className="flex items-center text-primary">
                <a href={secondaryEducation.certificateUpload} target="_blank" className="flex items-center gap-2 hover:underline">
                  <File className="h-5 w-5"/>
                  View my uploaded certificate
                </a>
              </div>
            ) : (
              <span className="text-sm italic">No certificate uploaded</span>
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default AvailableSecondaryCreated;
