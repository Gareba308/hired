import { db } from '@/db'
import { redirect } from 'next/navigation'
import React from 'react'
import MyJobsDetails from '../../_components/job/MyJobsDetails'
interface MyJobDetailsProps{
    params: {
        jobId: string
    } 
}
const Page = async ({params}: MyJobDetailsProps) => {
    const {jobId}= params

    const job= await db.job.findFirst({
        where: {
            id: jobId
        }
    })

    if(!job) redirect('/manage/my-jobs')
  return (
    <div className="space-y-6  pb-5 max-w-7xl min-h-[calc(100vh-80px)] mx-auto bg-white px-4 md:px-6 text-gray-700 rounded-lg">
        <MyJobsDetails job={job}/>
    </div>
  )
}

export default Page