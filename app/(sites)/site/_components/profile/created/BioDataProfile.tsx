import { WorkerBio } from "@prisma/client";
import BioName from "../Edits/BioData/BioName";
import BioCounty from "../Edits/BioData/BioCounty";
import BioCitizen from "../Edits/BioData/BioCitizen";
import BioHighestEducation from "../Edits/BioData/BioHighestEducation";
import BioGender from "../Edits/BioData/BioGender";
import BioYearOfBirth from "../Edits/BioData/BioYearOfBirth";
import BioCurrentJob from "../Edits/BioData/BioCurrentJob";
import BioIdentityNumber from "../Edits/BioData/BioIdentityNumber";
import BioEmploymentType from "../Edits/BioData/BioEmploymentType";
import BioProfilePic from "../Edits/BioData/BioProfilePic";

interface BioDataProfileProps {
  profiles: WorkerBio[];
}
const BioDataProfile = ({ profiles }: BioDataProfileProps) => {
  return (
    <>
      {profiles.map((profile) => (
        <div key={profile.id}>
          <div className="border-b border-gray-200 pb-2">
            <h2 className="font-bold text-2xl text-gray-600">My Bio Data</h2>
            <p className="text-gray-600 text-base">
              You can edit your bio information at any time. These details help
              employers understand you better.
            </p>
          </div>

          <>
            <dl className="divide-y divide-gray-200">
              <BioName profile={profile} />
              <BioCounty profile={profile} />
              <BioCurrentJob profile={profile} />
              <BioCitizen profile={profile} />
              <BioHighestEducation profile={profile} />
              <BioGender profile={profile} />
              <BioYearOfBirth profile={profile} />
              <BioIdentityNumber profile={profile} />
              <BioEmploymentType profile={profile} />
              <BioProfilePic profile={profile} />
            </dl>
          </>
        </div>
      ))}
    </>
  );
};

export default BioDataProfile;
