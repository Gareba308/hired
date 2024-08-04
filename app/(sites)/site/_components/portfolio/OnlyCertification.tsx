import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CertificationLicense } from "@prisma/client";
import CertificationCreated from "./created/CertificationCreated";
import CertificationOnlyCreatingModal from "./modal/CertificationOnlyCreating";

interface OnlyCertificationProps {
  certification: CertificationLicense[];
}

const OnlyCertification = ({ certification }: OnlyCertificationProps) => {
  const [certificationOpen, setCertificationOpen] = useState<boolean>(false);

  const certificationOnClose = () =>
    setCertificationOpen((current) => !current);
  const certificationOnConfirm = () =>
    setCertificationOpen((current) => !current);

  return (
    <>
      {certification.length !== 0 ? (
        <>
          <CertificationCreated certification={certification} />
        </>
      ) : (
        <>
          <div className="font-normal mt-5 sm:mt-8 lg:mt-0 space-y-4">
            <dl className="border lg:border-t-0 lg:border-l-0 lg:border-r-0 rounded-none border-gray-200">
              <div className="lg:py-4 pb-5 lg:px-3 lg:grid lg:grid-cols-3 lg:gap-4 text-gray-700">
                <dt className="font-medium text-lg leading-6 text-gray-600 bg-secondary border-b border-gray-200 lg:border-none lg:bg-inherit py-2 lg:py-0 lg:px-0 px-2">
                  Certification/Licenses
                </dt>

                <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base bg-white px-2">
                  <CertificationOnlyCreatingModal
                    isOpen={certificationOpen}
                    onClose={certificationOnClose}
                    onConfirm={certificationOnConfirm}
                  />
                  <div className="sm:py-4">
                    <div className="lg:border lg:border-gray-200 rounded-none">
                      <div className="hidden lg:flex bg-secondary border-b border-gray-200 py-1.5 pl-4">
                        <h2 className="text-lg font-medium text-gray-600">
                          My Certification/Licenses
                        </h2>
                      </div>
                      <div className="lg:pl-4 lg:pt-2 lg:pb-4">
                        <p className="text-start mb-1">
                          All your certification or licenses details will appear
                          here.
                        </p>
                        <div className="flex items-center justify-start ">
                          <Button
                            size="lg"
                            variant="outline"
                            type="button"
                            onClick={() => setCertificationOpen(true)}
                            className="text-gray-600 text-[15px] hover:bg-inherit hover:text-primary hover:underline"
                          >
                            <Plus className="h-5 w-5 mr-1.5" />
                            Certification/Licenses
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </>
      )}
    </>
  );
};

export default OnlyCertification;
