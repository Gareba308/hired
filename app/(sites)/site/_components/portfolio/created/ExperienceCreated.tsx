import { Experience } from "@prisma/client";
import ExperienceEdit from "../edits/ExperienceEdit";

interface ExperiencesCreatedProps {
  experiences: Experience[];
  selectedExperienceId: string | null;
  toggleView: (selectedExperienceId: string) => void;
}

const ExperienceCreated = ({
  experiences,
  selectedExperienceId,
  toggleView,
}: ExperiencesCreatedProps) => {
  const selectedExperience = experiences.find(
    (experience) => experience.id === selectedExperienceId
  );
  return (
    <>
      {selectedExperience && (
        <div>
            <ExperienceEdit
              experienceDetails={selectedExperience}
              toggleView={toggleView}
            />
        </div>
      )}
    </>
  );
};

export default ExperienceCreated;
