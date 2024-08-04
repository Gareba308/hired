import { PropsWithChildren } from "react"
import Sidebar from "./_components/sidebar/Sidebar"
import DashNavbar from "./_components/dashboard/DashNavbar"

const DashboardLayout = ({children} : PropsWithChildren)=>{
    return (
        <div className="h-full text-slate-600">
            <div className="h-[70px] md:pl-56 fixed inset-y-0 w-full z-50 ">
                <DashNavbar />
            </div>
            <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
                <Sidebar />
            </div>
            <main className="md:pl-60 my-0 sm:my-4 pt-[70px] min-h-screen bg-slate-200 no-scrollbar px-0 w-full sm:px-4 mx-auto text-gray-600">
                {children}
            </main>
        </div>
    )
}

export default DashboardLayout