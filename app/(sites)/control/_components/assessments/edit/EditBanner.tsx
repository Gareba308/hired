"use client";

import { AssessmentBanner } from "@prisma/client";
import { CornerUpLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import BannerNameEdit from "./BannerNameEdit";
import BannerCategoryEdit from "./BannerCategoryEdit";
import BannerSummaryEdit from "./BannerSummaryEdit";
import BannerInstructionsEdit from "./BannerInstructionsEdit";
import BannerAttempts from "./BannerAttempts";
import BannerQuestionsEdit from "./BannerQuestionsEdit";
import BannerCompleteTime from "./BannerCompleteTime";
interface EditBannerProps {
  banner: AssessmentBanner;
}
const EditBanner = ({ banner }: EditBannerProps) => {
  const searchParams = useSearchParams();
  const origin = searchParams?.get("origin");
  return (
    <div>
      <div className="flex items-center flex-row mb-2">
        <Link
          href={origin ? `/${origin}` : "/control/assessments"}
          className="hover:text-[#005580]"
        >
          <CornerUpLeft className="h-6 w-6 mr-2.5" />
        </Link>
        <h3 className="font-bold text-gray-600 tracking-tight text-2xl sm:text-3xl">
          Banner Settings
        </h3>
      </div>

      <fieldset className=" border border-gray-200 rounded-lg px-2.5 lg:px-3">
        <legend className="text-lg sm:text-xl font-semibold text-gray-600">
          Edit Banner
        </legend>
        <dl className="divide-y divide-gray-100">
          <BannerNameEdit banner={banner} />
          <BannerCompleteTime banner={banner} />
          <BannerCategoryEdit banner={banner} />
          <BannerSummaryEdit banner={banner} />
          <BannerInstructionsEdit banner={banner} />
          <BannerQuestionsEdit banner={banner} />
          <BannerAttempts banner={banner} />
        </dl>
      </fieldset>
    </div>
  );
};

export default EditBanner;
