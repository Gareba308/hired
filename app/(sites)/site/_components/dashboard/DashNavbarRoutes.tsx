import Link from "next/link";
import { Button } from "@/components/ui/button";
import UserAccountNav from "./UserAccountNav";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { ShieldQuestion } from "lucide-react";

const DashNavbarRoutes = async () => {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/home/login");

  const userId = session.id;

  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) redirect("/home/login");

  const email = user.email;
  const name = user.name;

  return (
    <div className="flex gap-x-3 items-center shrink-0 ml-auto">
      <Link href="/site/faqs">
        <Button
          size="sm"
          variant="ghost"
          className="text-gray-700 rounded-sm hover:opacity-80 hover:text-gray-800"
        >
          <ShieldQuestion className="h-5 w-5 mr-1 text-gray-700 font-normal" />{" "}
          FAQs
        </Button>
      </Link>

      <UserAccountNav
        email={email}
        name={name as string}
      />
    </div>
  );
};

export default DashNavbarRoutes;
