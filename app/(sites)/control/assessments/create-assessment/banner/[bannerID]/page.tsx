import EditBanner from "@/app/(sites)/control/_components/assessments/edit/EditBanner";
import { db } from "@/db";
import { redirect } from "next/navigation";

interface SettingsProps {
  params: {
    bannerID: string;
  };
}

const Page = async ({ params }: SettingsProps) => {
  const { bannerID } = params;
  const banner= await db.assessmentBanner.findFirst({
    where: {
      id:bannerID
    }
  })

  if(!banner) redirect(`/control/assessments?origin=control/assessments/create-assessment/banner/${bannerID}`)
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-6 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <EditBanner banner={banner}/>
    </div>
  );
};

export default Page;