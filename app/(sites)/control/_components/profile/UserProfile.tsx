import { AdminProfile, User } from "@prisma/client";
import CreateProfile from "./CreateProfile";
import PhoneNumber from "./userProfile/PhoneNumber";
import WorkEmail from "./userProfile/WorkEmail";
import Summary from "./userProfile/Summary";
import Role from "./userProfile/Role";
import Photo from "./userProfile/Photo";
import PostalAddress from "./userProfile/PostalAddress";

interface UserProfileProps {
  profile: AdminProfile | null;
  user: User
}

const UserProfile = ({ profile, user }: UserProfileProps) => {
  if (!profile) {
    return (
      <>
        <CreateProfile />
      </>
    );
  }
  return (
    <>
      <dl className="divide-y divide-gray-200">
        <Photo profile={profile} user={user}/>
        <Summary profile={profile} />
        <PhoneNumber profile={profile} />
        <WorkEmail profile={profile} />
        <Role profile={profile} />
        <PostalAddress profile={profile} />
      </dl>
    </>
  );
};

export default UserProfile;
