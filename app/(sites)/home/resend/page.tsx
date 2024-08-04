"use client"

import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight,} from "lucide-react"
import { useRouter } from "next/navigation"

import { useState } from "react"

const Page = () => {
    const router = useRouter()
    const confirm= ()=>{
      router.push('/')
    }
  return (
    <MaxWidthWrapper className="mt-4">
        <div className="grid mx-auto max-w-2xl min-h-full place-items-center px-6 py-10 shadow-sm bg-white sm:py-32 lg:px-8">
          <div className="text-center">
            <p className="text-base font-semibold text-green-600">Almost there!!</p>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Check your email for verification</h1>
            <p className="mt-6 text-base leading-7 text-zinc-600">Check your email&apos;s inbox/spam for mail with a link to be able to verify your email. Incase you didn&apos;t get the email, you will need to contact support</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button variant='default' onClick={confirm}><ArrowLeft className="w-4 h-4 mr-1.5"/>Homepage</Button>
              <Button variant='secondary'>Support <ArrowRight className="w-4 h-4 ml-1.5"/></Button>
            </div>
          </div>
        </div>
    </MaxWidthWrapper>
  )
}

export default Page