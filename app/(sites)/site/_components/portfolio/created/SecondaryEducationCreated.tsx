import { SecondaryEducation } from "@prisma/client";
import EditSecondaryEducation from "../edits/education/EditSecondaryEducation";

interface SecondaryEducationCreatedProps {
  secondaryEducation: SecondaryEducation;
}

const SecondaryEducationCreated = ({
  secondaryEducation,
}: SecondaryEducationCreatedProps) => {
  return (
    <>
      {secondaryEducation && (
        <div className="mt-2">
          <dl className="divide-y divide-gray-100">
            <EditSecondaryEducation secondaryEducation={secondaryEducation}/>
          </dl>
        </div>
      )}
    </>
  );
};

export default SecondaryEducationCreated;
