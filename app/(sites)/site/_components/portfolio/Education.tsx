import { SecondaryEducation, TertiaryEducation } from "@prisma/client";
import { useState } from "react";
import Tertiary from "./Tertiary";
import Secondary from "./Secondary";
import { Button } from "@/components/ui/button";
interface EducationProps {
  secondaryEducation: SecondaryEducation | null;
  tertiaryEducation: TertiaryEducation[];
}

const Education = ({
  secondaryEducation,
  tertiaryEducation,
}: EducationProps) => {
  const [currentForm, setCurrentForm] = useState("secondary");

  const renderedForm = () => {
    switch (currentForm) {
      case "tertiary":
        return <Tertiary tertiaryEducation={tertiaryEducation} />;

      default:
        return <Secondary secondaryEducation={secondaryEducation} />;
    }
  };
  return (
    <>
      <div className="pb-1">
        <div>
          <h2 className="font-bold text-gray-600 text-xl sm:text-2xl">
            Education Section
          </h2>
          <p className="text-gray-600 my-1">
            Fill in required details to create this section of your portfolio,
            to help recruiters know you better. We will keep all sensitive
            information private. User profile helps employer know who you are.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row  sm:justify-start gap-4 my-2">
          <Button
            className={
              currentForm === "secondary" ? "rounded-sm text-primary border border-gray-200" : "rounded-sm"
            }
            onClick={() => setCurrentForm("secondary")}
            variant={currentForm === 'secondary' ? "secondary" : "outline"}
            type="button"
            size='sm'
          >
            Secondary Education
          </Button>
          <Button
            className={
              currentForm === "tertiary" ? "rounded-sm text-primary border border-gray-200" : "rounded-sm"
            }
            onClick={() => setCurrentForm("tertiary")}
            variant={currentForm === 'tertiary' ? "secondary" : "outline"}
            type="button"
            size='sm'
          >
            Tertiary Education
          </Button>
        </div>
      </div>
      {renderedForm()}
    </>
  );
};

export default Education;
