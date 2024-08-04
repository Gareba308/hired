import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CoverLetterSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f9fafb">
      <div>
        <div className="flex flex-col">
          <div className="mt-6 sm:px-4">
            <div className="float-right">
              <Skeleton height={18} width={200} count={4} />
            </div>
          </div>
          <div className=" mt-3 sm:px-4">
            <div className="items-start">
              <Skeleton height={18} width={200} count={4} />
            </div>
          </div>
        </div>
        <div className="w-full mt-2 sm:px-4">
          <div>
            <Skeleton height={30} count={6} />
          </div>
        </div>
        <div className=" mt-3 sm:px-4">
            <div className="items-start">
              <Skeleton height={18} width={200} count={3} />
            </div>
          </div>
      </div>
    </SkeletonTheme>
  );
};

export default CoverLetterSkeleton;
