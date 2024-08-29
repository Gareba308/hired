import { Company } from "@prisma/client";
import CompanyCreateProfile from "./CompanyCreateProfile";
import CompanyName from "./company/CompanyName";
import EmployerAlternativeEmail from "./company/EmployerAlternativeEmail";
import CompanyPhone from "./company/CompanyPhone";
import CompanyCategory from "./company/CompanyCategory";
import CompanyWebsite from "./company/CompanyWebsite";
import CompanyDescription from "./company/CompanyDescription";
import CompanyPostalAddress from "./company/CompanyPostalAddress";
import CompanyLogo from "./company/CompanyLogo";
import CompanyEstablished from "./company/CompanyEstablished";

interface CompanyProfileProps {
  profile: Company | null;
}

const CompanyProfile = ({ profile }: CompanyProfileProps) => {
  if (!profile) {
    return (
      <>
        <CompanyCreateProfile />
      </>
    );
  }
  return (
    <>
      <div className="border-b border-gray-200 pb-2">
        <h2 className="font-bold text-2xl text-gray-600">
          Company&apos;s Profile
        </h2>
        <p className="text-gray-600">
          You can edit your company details at any time. These details help
          candidates understand your organization.
        </p>
      </div>

      <>
        <dl className="divide-y divide-gray-100">
          <CompanyName profile={profile} />
          <CompanyLogo profile={profile} />
          <CompanyEstablished profile={profile} />
          <EmployerAlternativeEmail profile={profile} />
          <CompanyPhone profile={profile} />
          <CompanyCategory profile={profile} />
          <CompanyWebsite profile={profile} />
          <CompanyDescription profile={profile} />
          <CompanyPostalAddress profile={profile} />
        </dl>
      </>
    </>
  );
};

export default CompanyProfile;
