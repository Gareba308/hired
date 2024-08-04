import { Expand, Loader2, Plus, Trash } from "lucide-react";
import { Experience } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import NewCreateExperience from "../NewCreateExperience";
import ExperienceCreated from "./ExperienceCreated";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import QuillPreview from "@/components/QuillPreview";

interface ExperienceCreatedStartProps {
  experiences: Experience[];
}

export default function ExperienceCreatedStart({
  experiences,
}: ExperienceCreatedStartProps) {
  const { toast } = useToast();
  const [currentlyDeleting, setCurrentlyDeleting] = useState<string | null>(
    null
  );

  const [selectedExperienceId, setSelectedExperienceId] = useState<
    string | null
  >(null);

  const toggleView = (experienceId: string) => {
    setSelectedExperienceId((prevId) =>
      prevId === experienceId ? null : experienceId
    );
  };

  const [isAdding, setIsAdding] = useState<boolean>(false);

  const toggleAdd = () => setIsAdding((current) => !current);

  const router = useRouter();

  const { mutate: deleteExperience, isLoading } =
    trpc.workerDeleteExperience.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Successfully deleted an experience record",
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
              "There was a problem deleting your experience details. Please try again later",
            variant: "default",
            duration: 3000,
          });
        }
      },
      onMutate({ experienceID }) {
        setCurrentlyDeleting(experienceID);
      },
      onSettled() {
        setCurrentlyDeleting(null);
      },
    });
  return (
    <>
      {!selectedExperienceId ? (
        <>
          {!isAdding ? (
            <>
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-gray-600 text-xl sm:text-2xl">
                    My Experiences
                  </h2>
                  <Button
                    type="button"
                    onClick={toggleAdd}
                    variant="default"
                    size="sm"
                    className="hidden sm:flex font-normal bg-primary hover:bg-primary hover:opacity-90"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Add Experience
                  </Button>
                  <Button
                    type="button"
                    onClick={toggleAdd}
                    variant="default"
                    size="sm"
                    className="sm:hidden font-normal bg-primary hover:bg-primary hover:opacity-90"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Add
                  </Button>
                </div>
                <p className="text-gray-600 my-1">
                  View, edit or delete you experience details. Click the{" "}
                  <span className="font-medium">Add </span> button to to add as
                  many relevant job experience as possible. Click{" "}
                  <span className="font-medium">View to Edit</span> to edit a
                  select job experience.
                </p>
              </div>
              <section className="mt-2 min-h-[calc(100vh-250px)] rounded-none">
                <div className="max-w-screen-xl mx-auto">
                  <ul className="mt-2 lg:mt-4 grid gap-4 lg:gap-6 lg:grid-cols-2">
                    {experiences.map((experience) => (
                      <div key={experience.id}>
                        {
                          <li className="border rounded-md">
                            <div className="pb-2 sm:pb-3">
                              <div className="">
                                <div className="flex flex-row items-center pl-1.5 py-1.5 sm:pl-2 justify-between gap-x-3 border-b border-gray-200 bg-secondary w-full">
                                  <div
                                    onClick={() => toggleView(experience.id)}
                                    className="text-primary cursor-pointer text-lg font-medium hover:underline hover:text-primary"
                                  >
                                    {experience.position && (
                                      <h2 className="line-clamp-1 w-full">
                                        {experience.position}
                                      </h2>
                                    )}
                                  </div>
                                  <div className=" flex h-5 items-center gap-0">
                                    <Button
                                      size="sm"
                                      type="button"
                                      onClick={() => toggleView(experience.id)}
                                      variant="ghost"
                                      className="text-primary hover:text-primary hover:bg-primary/10 rounded-none"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4 shrink-0"
                                      >
                                        <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
                                        <path d="m21 3-9 9" />
                                        <path d="M15 3h6v6" />
                                      </svg>
                                    </Button>
                                    <Separator orientation="vertical" />
                                    <Button
                                      variant="ghost"
                                      className="text-destructive-foreground  hover:text-destructive-foreground rounded-none rounded-tr-lg hover:bg-primary/10"
                                      size="sm"
                                      type="button"
                                      onClick={() =>
                                        deleteExperience({
                                          experienceID: experience.id,
                                        })
                                      }
                                    >
                                      {currentlyDeleting === experience.id ? (
                                        <>
                                          <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                                        </>
                                      ) : (
                                        <>
                                          <Trash className="h-4 w-4 shrink-0 font-normal" />
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                </div>
                                <div
                                  onClick={() => toggleView(experience.id)}
                                  className="cursor-pointer px-1.5 sm:px-2 pt-1"
                                >
                                  <div className="mt-1">
                                    {experience.nameCompany && (
                                      <p className="text-gray-500 text-sm line-clamp-1">
                                        {experience.nameCompany}
                                      </p>
                                    )}
                                    {experience.location && (
                                      <p className="text-gray-500 text-sm line-clamp-1">
                                        {experience.location}
                                      </p>
                                    )}
                                  </div>
                                  {experience.description && (
                                    <div className="line-clamp-3 -mt-1 text-gray-700 text-sm">
                                      <QuillPreview
                                        htmlContent={experience.description}
                                      />
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
              </section>
            </>
          ) : (
            <>
              {isAdding && (
                <NewCreateExperience
                  experiences={experiences}
                  toggleAdd={toggleAdd}
                />
              )}
            </>
          )}
        </>
      ) : (
        <>
          {selectedExperienceId && (
            <ExperienceCreated
              experiences={experiences}
              selectedExperienceId={selectedExperienceId}
              toggleView={toggleView}
            />
          )}
        </>
      )}
    </>
  );
}
