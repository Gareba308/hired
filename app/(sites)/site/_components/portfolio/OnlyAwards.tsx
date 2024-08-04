import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Award } from "@prisma/client";
import AwardCreated from "./created/AwardCreated";
import AwardOnlyCreatingModal from "./modal/AwardOnlyCreating";

interface OnlyAwardsProps {
  awards: Award[];
}

const OnlyAwards = ({ awards }: OnlyAwardsProps) => {
  const [awardOpen, setAwardOpen] = useState<boolean>(false);

  const awardOnClose = () => setAwardOpen((current) => !current);
  const awardOnConfirm = () => setAwardOpen((current) => !current);

  return (
    <>
      {awards.length === 0 ? (
        <div className="font-normal  space-y-4">
          <dl className="border lg:border-r-0 lg:border-l-0 rounded-none border-gray-200">
            <div className="lg:py-4 pb-5 lg:px-3 lg:grid lg:grid-cols-3 lg:gap-4 text-gray-700">
              <dt className="font-medium text-lg leading-6 text-gray-600 bg-secondary border-b border-gray-200 lg:border-none lg:bg-inherit py-2 lg:py-0 lg:px-0 px-2">
                Awards & Honors
              </dt>

              <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base bg-white px-2">
                <AwardOnlyCreatingModal
                  isOpen={awardOpen}
                  onClose={awardOnClose}
                  onConfirm={awardOnConfirm}
                />
                <div className="sm:py-4">
                  <div className="lg:border lg:border-gray-200 rounded-none">
                    <div className="hidden lg:flex bg-secondary border-b border-gray-200 py-1.5 pl-4">
                      <h2 className="text-lg font-medium text-gray-600">
                        My Award Details
                      </h2>
                    </div>
                    <div className="lg:pl-4 lg:pt-2 lg:pb-4">
                      <p className="text-start mb-1">
                        All your award details will appear here.
                      </p>
                      <div className="flex items-center justify-start ">
                        <Button
                          size="lg"
                          variant="outline"
                          type="button"
                          onClick={() => setAwardOpen(true)}
                          className="text-gray-600 text-[15px] hover:bg-inherit hover:text-primary hover:underline"
                        >
                          <Plus className="h-5 w-5 mr-1.5" />
                          Create Award Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        <>
          <AwardCreated awards={awards} />
        </>
      )}
    </>
  );
};

export default OnlyAwards;
