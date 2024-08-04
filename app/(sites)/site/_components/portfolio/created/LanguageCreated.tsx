import { Button } from "@/components/ui/button";
import { Language } from "@prisma/client";
import { Loader2, PenLine, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import EditLanguageModal from "../modal/EditLanguage";
import AddLanguageModal from "../modal/AddLanguage";

interface LanguageCreatedProps {
  languages: Language[];
}

const LanguageCreated = ({ languages }: LanguageCreatedProps) => {
  const { toast } = useToast();

  const router = useRouter();

  const [addLanguageOpen, setAddLanguageOpen] = useState<boolean>(false);

  const [currentlyDeletingID, setCurrentlyDeletingID] = useState<string | null>(
    null
  );

  const addLanguageOnClose = () => setAddLanguageOpen((current) => !current);
  const addLanguageOnConfirm = () => setAddLanguageOpen((current) => !current);

  const [editLanguageOpen, setEditLanguageOpen] = useState<boolean>(false);

  const editLanguageOnClose = () => setEditLanguageOpen((current) => !current);
  const editLanguageOnConfirm = () =>
    setEditLanguageOpen((current) => !current);

  const [currentlyEditingID, setCurrentlyEditingID] = useState<string | null>(
    null
  );

  const modalEdit = (id: string) => {
    setCurrentlyEditingID(id);
  };
  const { mutate: deleteLanguage, isLoading } =
    trpc.workerDeleteLanguage.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You have successfully deleted language record",
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
              "There was a problem deleting a language record. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
      onMutate: ({ languageID }) => {
        setCurrentlyDeletingID(languageID);
      },
      onSettled: () => {
        setCurrentlyDeletingID(null);
      },
    });
  return (
    <div>
      <dl className="border border-gray-200 rounded-lg mt-8">
        <div className="lg:py-4 pb-5 lg:px-3 lg:grid lg:grid-cols-3 lg:gap-4 text-gray-700">
          <dt className="font-medium text-lg leading-6 text-gray-600">
            <div className="flex items-center justify-between bg-secondary border-b border-gray-200 lg:border-none lg:bg-inherit py-0.5 lg:py-0 lg:px-0 pl-2">
              <div>
                <h2 className="text-gray-600 text-lg font-medium">Language</h2>
              </div>
              <Button
                type="button"
                size="sm"
                className="lg:hidden hover:bg-primary hover:opacity-90 font-normal"
                onClick={() => setAddLanguageOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </dt>

          <dd className="text-gray-600 sm:col-span-2 px-2">
            <AddLanguageModal
              isOpen={addLanguageOpen}
              onClose={addLanguageOnClose}
              onConfirm={addLanguageOnConfirm}
            />
            <div className="max-w-screen-xl mx-auto">
              <div className="lg:flex items-center justify-between hidden bg-secondary border-b border-gray-200 py-0.5 rounded-md pl-2">
                <div>
                  <h2 className="text-lg font-medium text-gray-600">
                    My Languages
                  </h2>
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="font-normal hover:bg-primary hover:opacity-90"
                  onClick={() => setAddLanguageOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add New
                </Button>
              </div>
              <ul className="mt-4 grid sm:grid-cols-2 gap-4 lg:gap-2">
                {languages.map((language) => (
                  <div key={language.id}>
                    {
                      <li className="border w-full rounded-lg">
                        {currentlyEditingID === language.id && (
                          <EditLanguageModal
                            isOpen={editLanguageOpen}
                            onClose={editLanguageOnClose}
                            onConfirm={editLanguageOnConfirm}
                            language={language}
                          />
                        )}
                        <div>
                          <div className="pb-2">
                            <div className="flex flex-row text-base w-full items-center justify-between bg-secondary border-b border-gray-200 pl-2 py-1">
                              <div className="text-primary text-base font-medium">
                                <h4 className="flex flex-row shrink-0 items-center">
                                  {language.language}
                                </h4>
                              </div>
                              <div className="flex items-center h-5">
                                <Button
                                  size="sm"
                                  variant="link"
                                  onClick={() => {
                                    setEditLanguageOpen(true);
                                    modalEdit(language.id);
                                  }}
                                  disabled={
                                    currentlyDeletingID === language.id &&
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
                                    currentlyDeletingID === language.id &&
                                    isLoading
                                  }
                                  onClick={() =>
                                    deleteLanguage({
                                      languageID: language.id,
                                    })
                                  }
                                  className="text-destructive-foreground"
                                >
                                  {currentlyDeletingID === language.id ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    </>
                                  ) : (
                                    <Trash className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            <div className="flex flex-col lg:flex-row text-base text-gray-600 bg-white px-2 mt-1">
                              <div className="flex">
                                <span className="font-medium">
                                  Proficiency:
                                </span>{" "}
                                <span className="text-gray-600 px-1">
                                  {language.proficiency && (
                                    <p>{language.proficiency}</p>
                                  )}
                                </span>
                              </div>
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

export default LanguageCreated;
