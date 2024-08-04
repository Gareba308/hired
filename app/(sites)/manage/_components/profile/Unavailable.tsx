"use client"

import Link from 'next/link'
import React from 'react'
import { buttonVariants } from '@/components/ui/button'
import { Undo2, User2, UserPlus2 } from 'lucide-react'

const NoProfile= () => {

  return (
      <main>
          <div className="bg-white max-w-screen-xl mx-auto px-4 flex items-center justify-start min-h-[calc(100vh-80px)] md:px-8">
              <div className="max-w-lg mx-auto space-y-3 text-center">
                  <h3 className="text-gray-600 font-semibold text-2xl flex flex-col items-center mb-8">
                      <User2 className='h-16 w-16 sm:h-20 sm:w-20 border border-gray-600 rounded-full'/>
                      <p>User Profile</p>
                  </h3>
                  <p className="text-gray-600 text-4xl font-semibold sm:text-5xl">
                      No profile available
                  </p>
                  <p className="text-gray-600 md:text-lg">
                      You do not have a user profile. You are required to create a user profile to be able to post a job.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                      <Link href="/manage" className={buttonVariants({
                        size: 'lg',
                        className: "block  px-4 rounded-none text-base",
                        variant: "outline"
                      })}>
                         <Undo2 className='h-4 w-4 mr-1'/> To homepage
                      </Link>
                      <Link href='/manage/profile?origin=manage/create-job' className={buttonVariants({
                        size: 'lg',
                        className: "block  px-4 rounded-none text-base"
                      })}>
                         <UserPlus2 className='h-4 w-4 mr-1'/> Create profile
                      </Link>
                  </div>
              </div>
          </div>
      </main>
  )
}

export default NoProfile

