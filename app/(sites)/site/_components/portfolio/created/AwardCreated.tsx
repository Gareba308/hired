import { Button } from "@/components/ui/button";
import { Award } from "@prisma/client";
import { Loader2, PenLine, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import AddAwardModal from "../modal/AddAward";
import EditAwardModal from "../modal/EditAward";
import { Preview } from "@/components/Preview";

interface AwardCreatedProps {
  awards: Award[];
}

const AwardCreated = ({ awards }: AwardCreatedProps) => {
  const { toast } = useToast();

  const router = useRouter();

  const [addAwardOpen, setAddAwardOpen] = useState<boolean>(false);

  const [currentlyDeletingID, setCurrentlyDeletingID] = useState<string | null>(
    null
  );

  const addAwardOnClose = () => setAddAwardOpen((current) => !current);
  const addAwardOnConfirm = () => setAddAwardOpen((current) => !current);

  const [editAwardOpen, setEditAwardOpen] = useState<boolean>(false);

  const editAwardOnClose = () => setEditAwardOpen((current) => !current);
  const editAwardOnConfirm = () => setEditAwardOpen((current) => !current);

  const [currentlyEditingID, setCurrentlyEditingID] = useState<string | null>(
    null
  );

  const modalEdit = (id: string) => {
    setCurrentlyEditingID(id);
  };

  const { mutate: deleteAward, isLoading } = trpc.workerDeleteAward.useMutation(
    {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You have successfully deleted award record",
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
              "There was a problem deleting your award record. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
      onMutate: ({ awardID }) => {
        setCurrentlyDeletingID(awardID);
      },
      onSettled: () => {
        setCurrentlyDeletingID(null);
      },
    }
  );
  return (
    <div>
      <dl className="border border-gray-200 rounded-lg mt-8">
        <div className="lg:py-4 pb-5 lg:px-3 lg:grid lg:grid-cols-3 lg:gap-4 text-gray-700">
          <dt className="font-medium text-lg leading-6 text-gray-600">
            <div className="flex items-center justify-between bg-secondary border-b border-gray-200 lg:border-none lg:bg-inherit py-0.5 lg:py-0 lg:px-0 pl-2">
              <div>
                <h2 className="text-gray-600 text-lg font-medium">
                  Award Details
                </h2>
              </div>
              <Button
                type="button"
                size="sm"
                className="lg:hidden hover:bg-primary hover:opacity-90 font-normal"
                onClick={() => setAddAwardOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </dt>

          <dd className="text-gray-600 sm:col-span-2 px-2">
            <AddAwardModal
              isOpen={addAwardOpen}
              onClose={addAwardOnClose}
              onConfirm={addAwardOnConfirm}
            />
            <div className="max-w-screen-xl mx-auto">
              <div className="lg:flex items-center justify-between hidden bg-secondary border-b border-gray-200 py-0.5 rounded-md pl-2">
                <div>
                  <h2 className="text-lg font-medium text-gray-600">
                    My Awards Details
                  </h2>
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="font-normal hover:bg-primary hover:opacity-90"
                  onClick={() => setAddAwardOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add New
                </Button>
              </div>
              <ul className="mt-4 grid gap-4">
                {awards.map((award) => (
                  <div key={award.id}>
                    {
                      <li className="border border-gray-200 rounded-md">
                        {currentlyEditingID === award.id && (
                          <EditAwardModal
                            isOpen={editAwardOpen}
                            onClose={editAwardOnClose}
                            onConfirm={editAwardOnConfirm}
                            award={award}
                          />
                        )}
                        <div>
                          <div className="pb-2">
                            <div className="flex flex-row w-full items-center justify-between bg-secondary border-b border-gray-200 px-2 py-1">
                              <div className="text-primary text-base font-medium">
                                <h4 className="flex flex-row shrink-0 items-center">
                                  {award.title}
                                </h4>
                              </div>
                              <div className="flex items-center justify-end h-5">
                                <Button
                                  size="sm"
                                  variant="link"
                                  onClick={() => {
                                    setEditAwardOpen(true);
                                    modalEdit(award.id);
                                  }}
                                  disabled={
                                    currentlyDeletingID === award.id &&
                                    isLoading
                                  }
                                >
                                  <PenLine className="h-4 w-4" />
                                </Button>
                                <Separator orientation="vertical" />
                                <Button
                                  size="sm"
                                  variant="link"
                                  disabled={
                                    currentlyDeletingID === award.id &&
                                    isLoading
                                  }
                                  onClick={() =>
                                    deleteAward({
                                      awardID: award.id,
                                    })
                                  }
                                  className="text-destructive-foreground"
                                >
                                  {currentlyDeletingID === award.id ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    </>
                                  ) : (
                                    <Trash className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-600 bg-white px-2 mt-1">
                              <div className="flex">
                                <span className="font-medium text-gray-600">Awarded:</span>{" "}
                                <span className="text-gray-500 px-1">
                                  {award.awardedMonth && award.awardedYear && (
                                    <p>
                                      {award.awardedMonth}-{award.awardedYear}
                                    </p>
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="text-gray-700 px-2">
                              {award.description && (
                                <div className="mt-2">
                                  <Preview value={award.description} />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    }
                  </div>
                ))}
              </ul>
            </div>
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default AwardCreated;
