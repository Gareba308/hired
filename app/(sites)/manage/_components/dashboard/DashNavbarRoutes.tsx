import UserAccountNav from "./UserAccountNav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect} from "next/navigation";
import { db } from "@/db";
import DashButton from "./DashButton";

const DashNavbarRoutes = async () => {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/home/login/enterprises");

  const userId = session.id;

  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (!user) redirect("/home/login/enterprises");

  const profile = await db.company.findFirst({
    where: {
      userId,
    },
    select: {
      logo: true,
      company_name: true,
    },
  });
  const email = user.email;
  const companyName = profile?.company_name;
  const name = user.name;
  return (
    <div className="flex gap-x-3 items-center shrink-0 ml-auto">
      <DashButton />

      <UserAccountNav
        email={email}
        companyName={companyName as string}
        name={name as string}
      />
    </div>
  );
};

export default DashNavbarRoutes;
