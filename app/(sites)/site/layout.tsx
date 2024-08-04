import { PropsWithChildren } from "react";
import Sidebar from "./_components/sidebar/Sidebar";
import DashNavbar from "./_components/dashboard/DashNavbar";

const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <div className="h-[70px] md:pl-56 fixed inset-y-0 w-full z-50 ">
        <DashNavbar />
      </div>

      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-60 my-0 sm:my-2.5 pt-[70px] min-h-[calc(100vh-120px)] no-scrollbar px-0 w-full sm:px-4 mx-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
