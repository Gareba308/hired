"use client";

import { AssessmentBanner } from "@prisma/client";
import React from "react";
import BannerNameEdit from "./BannerNameEdit";
import BannerCategoryEdit from "./BannerCategoryEdit";
import BannerSummaryEdit from "./BannerSummaryEdit";
import BannerInstructionsEdit from "./BannerInstructionsEdit";
import BannerAttempts from "./BannerAttempts";
import BannerQuestionsEdit from "./BannerQuestionsEdit";
import BannerCompleteTime from "./BannerCompleteTime";
import BannerDemoEdit from "./BannerDemoEdit";
interface EditBannerProps {
  banner: AssessmentBanner;
}
const EditBanner = ({ banner }: EditBannerProps) => {
  return (
    <div>
      <div className="flex items-center flex-row mb-2">
        <h3 className="font-bold text-gray-600 tracking-tight text-2xl sm:text-3xl">
          Banner Settings
        </h3>
      </div>

      <fieldset className=" border border-gray-200 rounded-lg px-2.5 lg:px-3">
        <legend className="text-lg sm:text-xl font-semibold text-gray-600">
          Edit Banner
        </legend>
        <dl className="divide-y divide-gray-100">
          <BannerDemoEdit banner={banner} />
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
