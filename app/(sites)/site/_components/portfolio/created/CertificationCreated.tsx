import { Button } from "@/components/ui/button";
import { CertificationLicense } from "@prisma/client";
import { Loader2, PenLine, Plus, Trash } from "lucide-react";
import { useState } from "react";
import AddCertificationModal from "../modal/AddCertification";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import EditCertificationModal from "../modal/EditCertification";
import { Preview } from "@/components/Preview";

interface CertificationCreatedProps {
  certification: CertificationLicense[];
}

const CertificationCreated = ({ certification }: CertificationCreatedProps) => {
  const { toast } = useToast();

  const router = useRouter();

  const [addCertificationOpen, setAddCertificationOpen] =
    useState<boolean>(false);

  const [currentlyDeletingID, setCurrentlyDeletingID] = useState<string | null>(
    null
  );

  const addCertificationOnClose = () =>
    setAddCertificationOpen((current) => !current);
  const addCertificationOnConfirm = () =>
    setAddCertificationOpen((current) => !current);

  const [editCertificationOpen, setEditCertificationOpen] =
    useState<boolean>(false);

  const [currentlyEditingID, setCurrentlyEditingID] = useState<string | null>(
    null
  );

  const modalEdit = (id: string) => {
    setCurrentlyEditingID(id);
  };

  const editCertificationOnClose = () =>
    setEditCertificationOpen((current) => !current);

  const editCertificationOnConfirm = () => {
    setEditCertificationOpen((current) => !current);
  };

  const { mutate: deleteCertification, isLoading } =
    trpc.workerDeleteCertification.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description:
            "You have successfully deleted a certification/license record",
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
              "There was a problem deleting your certification/license record. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
      onMutate: ({ certificationID }) => {
        setCurrentlyDeletingID(certificationID);
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
                <h2 className="text-gray-600 font-medium text-lg">
                  Certification/License
                </h2>
              </div>
              <Button
                type="button"
                size="sm"
                className="lg:hidden hover:bg-primary hover:opacity-90 font-normal"
                onClick={() => setAddCertificationOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </dt>

          <dd className="text-gray-600 sm:col-span-2 px-2">
            <AddCertificationModal
              isOpen={addCertificationOpen}
              onClose={addCertificationOnClose}
              onConfirm={addCertificationOnConfirm}
            />
            <div className="max-w-screen-xl mx-auto ">
              <div className="lg:flex items-center justify-between hidden bg-secondary border-b border-gray-200 py-0.5 rounded-md pl-2">
                <div>
                  <h2 className="text-lg font-medium text-gray-600">
                    My Certification/License Details
                  </h2>
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="font-normal hover:bg-primary hover:opacity-90"
                  onClick={() => setAddCertificationOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add New
                </Button>
              </div>
              <ul className="mt-4 grid gap-4">
                {certification.map((certificate) => (
                  <div key={certificate.id}>
                    {
                      <li className="border border-gray-200 rounded-md">
                        {currentlyEditingID === certificate.id && (
                          <EditCertificationModal
                            isOpen={editCertificationOpen}
                            onClose={editCertificationOnClose}
                            onConfirm={editCertificationOnConfirm}
                            certificate={certificate}
                            certificateID={currentlyEditingID as string}
                          />
                        )}
                        <div>
                          <div className="pb-2">
                            <div className="flex flex-row w-full items-center justify-between bg-secondary border-b border-gray-200 px-2 py-1">
                              <div className="text-gray-600 text-base font-medium">
                                <h4 className="flex flex-row shrink-0 text-primary items-center">
                                  {certificate.certificateLicenseName}
                                </h4>
                              </div>
                              <div className="flex items-center justify-end h-5">
                                <Button
                                  size="sm"
                                  variant="link"
                                  onClick={() => {
                                    setEditCertificationOpen(true);
                                    modalEdit(certificate.id);
                                  }}
                                  disabled={
                                    currentlyDeletingID === certificate.id &&
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
                                    currentlyDeletingID === certificate.id &&
                                    isLoading
                                  }
                                  onClick={() =>
                                    deleteCertification({
                                      certificationID: certificate.id,
                                    })
                                  }
                                  className="text-destructive-foreground"
                                >
                                  {currentlyDeletingID === certificate.id ? (
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
                                <span className="font-medium text-gray-600">Issued:</span>{" "}
                                <span className="text-gray-500 px-1">
                                  {certificate.validStartMonth &&
                                    certificate.validStartYear && (
                                      <p>
                                        {certificate.validStartMonth}-
                                        {certificate.validStartYear}
                                      </p>
                                    )}
                                </span>
                              </div>
                              <div className="flex">
                                <span className="font-medium text-gray-600">Expiry:</span>
                                <span className="text-gray-500 pl-1">
                                  {certificate.validEndMonth &&
                                  certificate.validEndYear ? (
                                    <p>
                                      {certificate.validEndMonth}-
                                      {certificate.validEndYear}
                                    </p>
                                  ) : (
                                    <>
                                      {certificate.validForever === true ? (
                                        <>No expiry</>
                                      ) : (
                                        <>--</>
                                      )}
                                    </>
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="text-gray-700 px-2">
                              {certificate.description && (
                                <div className="mt-2">
                                  <Preview value={certificate.description}/>
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

export default CertificationCreated;
