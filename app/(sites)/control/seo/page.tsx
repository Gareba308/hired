import React from 'react'
import SEOTrigger from '../_components/seo/SEOTrigger'
import { db } from '@/db'

const Page = async () => {
  const lastIndexJobsRequests= await db.lastRequestJobsIndex.findFirst()
  const lastIndexBlogsRequests= await db.lastRequestBlogsIndex.findFirst()
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-5 text-gray-700 sm:shadow-sm sm:rounded-lg">
        <SEOTrigger blogReq={lastIndexBlogsRequests} jobReq={lastIndexJobsRequests}/>
    </div>
  )
}

export default Page