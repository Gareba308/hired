"use client";

import { Assessment } from "@prisma/client";
import { CornerUpLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import AttemptsEdit from "./AttemptsEdit";
import ScenarioExplanationEdit from "./ScenarioExplanationEdit";
import ScenarioEdit from "./ScenarioEdit";
import QuestionEdit from "./QuestionEdit";
import Answer1Edit from "./Answer1Edit";
import Answer2Edit from "./Answer2Edit";
import Answer3Edit from "./Answer3Edit";
import FinalAnswerEdit from "./FinalAnswerEdit";
interface EditQuestionProps {
  question: Assessment;
}
const EditQuestion = ({ question }: EditQuestionProps) => {
  return (
    <div>
      <div className="flex items-center flex-row mb-2">
        <Link
          href={`/control/assessments/${question.bannerID}`}
          className="hover:text-[#005580]"
        >
          <CornerUpLeft className="h-6 w-6 mr-2.5" />
        </Link>
        <h3 className="font-bold text-gray-600 tracking-tight text-2xl sm:text-3xl">
          Question Settings
        </h3>
      </div>

      <fieldset className=" border border-gray-200 rounded-lg px-2.5 lg:px-3">
        <legend className="text-lg sm:text-xl font-semibold text-gray-600">
          Edit Question
        </legend>
        <dl className="divide-y divide-gray-100">
          <ScenarioExplanationEdit question={question} />
          <ScenarioEdit question={question} />
          <QuestionEdit question={question} />
          <Answer1Edit question={question} />
          <Answer2Edit question={question} />
          <Answer3Edit question={question} />
          <AttemptsEdit question={question} />
          <FinalAnswerEdit question={question} />
        </dl>
      </fieldset>
    </div>
  );
};

export default EditQuestion;
