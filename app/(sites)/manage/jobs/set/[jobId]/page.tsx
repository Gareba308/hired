import { db } from "@/db"
import { redirect } from "next/navigation"
import EditJob from "../../../_components/job/EditJob"

interface EditJobProps{
    params: {
        jobId: string
    }
}
const Page = async ({params}: EditJobProps) => {
    const {jobId}= params

    const job= await db.job.findFirst({
        where: {
          id: jobId
        },
      })
  
      if(!job) redirect('/manage/jobs')

  return (
    <div className="space-y-2 max-w-7xl mx-auto bg-white min-h-[calc(100vh-80px)] prose pt-4 pb-8 mb-4 px-4 md:px-6 text-gray-700 text-base rounded-lg">
        <EditJob job={job}/>
    </div>
  )
}

export default Page