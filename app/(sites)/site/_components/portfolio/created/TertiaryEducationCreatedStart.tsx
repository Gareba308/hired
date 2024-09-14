import { Expand, Eye, Loader2, PenLine, Plus, Trash } from "lucide-react";
import { TertiaryEducation } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import NewCreateTertiary from "../NewCreateTertiary";
import TertiaryCreated from "./TertiaryCreated";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/Preview";

interface ExperienceCreatedStartProps {
  tertiaryEducation: TertiaryEducation[];
}

export default function TertiaryEducationCreatedStart({
  tertiaryEducation,
}: ExperienceCreatedStartProps) {
  const { toast } = useToast();
  const [currentlyDeleting, setCurrentlyDeleting] = useState<string | null>(
    null
  );

  const [selectedTertiaryId, setSelectedTertiaryId] = useState<string | null>(
    null
  );

  const toggleView = (tertiaryEducationID: string) => {
    setSelectedTertiaryId((prevId) =>
      prevId === tertiaryEducationID ? null : tertiaryEducationID
    );
  };

  const [isAdding, setIsAdding] = useState<boolean>(false);

  const toggleAdd = () => setIsAdding((current) => !current);

  const router = useRouter();

  const { mutate: deleteTertiary, isLoading } =
    trpc.workerDeleteTertiaryEducation.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Successfully deleted an tertiary education details",
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
              "There was a problem deleting your tertiary education details. Please try again later",
            variant: "default",
            duration: 3000,
          });
        }
      },
      onMutate({ tertiaryEducationID }) {
        setCurrentlyDeleting(tertiaryEducationID);
      },
      onSettled() {
        setCurrentlyDeleting(null);
      },
    });
  return (
    <>
      {!selectedTertiaryId ? (
        <>
          {!isAdding ? (
            <section className="min-h-[calc(100vh-250px)] mt-2">
                <div className="font-normal flex items-center justify-between pl-2.5 lg:pl-3 bg-secondary border-b border-gray-200">
                  <h2 className="font-medium text-gray-600 text-lg">
                    My Tertiary Education
                  </h2>
                  <Button
                    type="button"
                    onClick={toggleAdd}
                    variant="default"
                    size="sm"
                    className="hidden rounded-none sm:flex font-normal hover:bg-primary bg-primary hover:opacity-90"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Add Tertiary
                  </Button>
                  <Button
                    type="button"
                    onClick={toggleAdd}
                    variant="default"
                    size="sm"
                    className="sm:hidden rounded-none font-normal hover:bg-primary bg-primary hover:opacity-90"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Add
                  </Button>
                </div>

              <div className="max-w-screen-xl mx-auto">
                <ul className="mt-2 lg:mt-4 grid gap-4 lg:gap-6 lg:grid-cols-2">
                  {tertiaryEducation.map((tertiary) => (
                    <div key={tertiary.id}>
                      {
                        <li className="border rounded-none">
                          <div className="pb-2 sm:pb-3">
                            <div className="">
                              <div className="flex flex-row items-center pl-1.5 sm:pl-2 py-1.5 justify-between gap-3 border-b border-gray-200 rounded-none bg-secondary w-full">
                                <div
                                  onClick={() => toggleView(tertiary.id)}
                                  className="text-primary cursor-pointer text-base font-medium hover:underline hover:text-primary"
                                >
                                  {tertiary.institution && (
                                    <h2 className="line-clamp-1 w-full">{tertiary.institution}</h2>
                                  )}
                                </div>
                                <div className=" flex h-5 items-center gap-0">
                                  <Button
                                    size="sm"
                                    type="button"
                                    onClick={() => toggleView(tertiary.id)}
                                    variant="ghost"
                                    className="text-primary hover:text-primary hover:bg-primary/10 rounded-none"
                                  >
                                    <Expand className="h-4 w-4"/>
                                  </Button>
                                  <Separator orientation="vertical"/>
                                  <Button
                                    variant="ghost"
                                    className="text-destructive-foreground  hover:text-destructive-foreground rounded-none rounded-tr-lg hover:bg-primary/10"
                                    size="sm"
                                    type="button"
                                    onClick={() =>
                                      deleteTertiary({
                                        tertiaryEducationID: tertiary.id,
                                      })
                                    }
                                  >
                                    {currentlyDeleting === tertiary.id ? (
                                      <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      </>
                                    ) : (
                                      <>
                                        <Trash className="h-4 w-4 font-normal" />
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                              <div onClick={() => toggleView(tertiary.id)} className="cursor-pointer px-1.5 sm:px-2 pt-1">
                              {tertiary.field && (
                                <p className="text-gray-500 text-sm mt-1">
                                  {tertiary.field}
                                </p>
                              )}
                              {tertiary.county && (
                                <p className="text-gray-500 text-sm">
                                 {tertiary.county}
                                </p>
                              )}
                              {tertiary.activities && <div className="line-clamp-3 mt-1.5">
                              <Preview value={tertiary.activities}/>
                              </div>}
                                                                                             
                              </div>
                            </div>
                          </div>
                        </li>
                      }
                    </div>
                  ))}
                </ul>
              </div>
            </section>
          ) : (
            <>
              {isAdding && (
                <NewCreateTertiary
                  tertiaryEducation={tertiaryEducation}
                  toggleAdd={toggleAdd}
                />
              )}
            </>
          )}
        </>
      ) : (
        <>
          {selectedTertiaryId && (
            <TertiaryCreated
              tertiaryEducation={tertiaryEducation}
              selectedTertiaryId={selectedTertiaryId}
              toggleView={toggleView}
            />
          )}
        </>
      )}
    </>
  );
}
