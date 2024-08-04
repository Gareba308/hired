import {TertiaryEducation } from "@prisma/client";
import TertiaryEdit from "../edits/TertiaryEdit";

interface ExperiencesCreatedProps {
  tertiaryEducation: TertiaryEducation[];
  selectedTertiaryId: string | null;
  toggleView: (selectedTertiaryId: string) => void;
}

const TertiaryCreated = ({
  tertiaryEducation,
  selectedTertiaryId,
  toggleView,
}: ExperiencesCreatedProps) => {
  const selectedTertiary = tertiaryEducation.find(
    (tertiary) => tertiary.id === selectedTertiaryId
  );
  return (
    <>
      {selectedTertiary && (
        <div>
          <dl className="divide-y divide-gray-100">
            <TertiaryEdit
              tertiaryDetails={selectedTertiary}
              toggleView={toggleView}
            />
          </dl>
        </div>
      )}
    </>
  );
};

export default TertiaryCreated;
