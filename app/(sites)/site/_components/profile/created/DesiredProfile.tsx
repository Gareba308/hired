import { WorkerDesires } from "@prisma/client";
import DesiredJobCategoryEdit from "../Edits/Desires/DesiredJobCategoryEdit";
import DesiredYearsExperienceEdit from "../Edits/Desires/DesiredYearsExperienceEdit";
import DesiredAvailability from "../Edits/Desires/DesiredAvailability";
import DesiredCurrentRemuneration from "../Edits/Desires/DesiredCurrentRemuneration";
import DesiredRemuneration from "../Edits/Desires/DesiredRemuneration";
import DesiredRelocate from "../Edits/Desires/DesiredRelocate";
import DesiredCurrentRemunerationTerms from "../Edits/Desires/DesiredCurrentRemunerationTerms";
import DesiredRemunerationTerms from "../Edits/Desires/DesiredRemunerationTerms";
import DesiredEmploymentType from "../Edits/Desires/DesiredEmploymentType";

interface DesiredProfileProps {
  profiles: WorkerDesires[];
}

const DesiredProfile = ({ profiles }: DesiredProfileProps) => {
  return (
    <>
      {profiles.map((profile) => (
        <div key={profile.id}>
          <div className="border-b border-gray-200 pb-2">
            <h2 className="font-bold text-2xl text-gray-600">Desirable</h2>
            <p className="text-gray-600 text-base">
              You can update your preferences at any time. These details help us
              and employers match you with suitable job opportunities.
            </p>
          </div>

          <>
            <dl className="divide-y divide-gray-100">
              <DesiredJobCategoryEdit profile={profile} />
              <DesiredYearsExperienceEdit profile={profile} />
              <DesiredAvailability profile={profile} />
              <DesiredCurrentRemuneration profile={profile} />
              <DesiredRemuneration profile={profile} />
              <DesiredRelocate profile={profile} />
              <DesiredCurrentRemunerationTerms profile={profile} />
              <DesiredRemunerationTerms profile={profile} />
              <DesiredEmploymentType profile={profile} />
            </dl>
          </>
        </div>
      ))}
    </>
  );
};

export default DesiredProfile;
