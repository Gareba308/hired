import { db } from '@/db'
import React from 'react'
import NoAllBlogs from '../../_components/Blogs/NoBlogs'
import AllBlogs from '../../_components/Blogs/AllBlogs'

const Page = async () => {
  const allBlogs= await db.blogs.findMany({
    orderBy: {
      createdAt: "desc"
    }
  })
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-6 text-gray-700 sm:shadow-sm sm:rounded-lg">
      {
        allBlogs.length === 0 ?
        <NoAllBlogs /> : <AllBlogs blogs={allBlogs}/>
      }
    </div>
  )
}

export default Page