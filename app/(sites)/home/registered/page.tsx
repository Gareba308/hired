"use client"

import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mail } from "lucide-react"
import { useRouter } from "next/navigation"

import { useState } from "react"
import { ResendAlertModal } from "../_components/models/ResendModel"

const Page = () => {
    const [open, setOpen]= useState(false)
    const [loading, setLoading]= useState(false)
    const router = useRouter()
    const confirm= ()=>{
      setLoading(true)
      router.push('/home/verify')
      setLoading(false)
    }
  return (
    <MaxWidthWrapper className="mt-4">
       <ResendAlertModal 
            isOpen={open}
            onClose={()=>setOpen(false)}
            onConfirm={confirm}
            loading={loading}
        />
        <div className="grid mx-auto max-w-2xl min-h-full place-items-center px-6 py-10 shadow-sm bg-white sm:py-32 lg:px-8">
          <div className="text-center">
            <p className="text-base font-semibold text-green-600">Almost there!!</p>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Check your email for verification</h1>
            <p className="mt-6 text-base leading-7 text-zinc-600">If you didn&apos;t get verification email and you would like to try again you can choose <span className="text-primary font-semibold text-lg">Resend</span> button</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button variant='default' onClick={()=>setOpen(true)}><Mail className="w-4 h-4 mr-1.5"/>Resend</Button>
              <Button variant='secondary'>Support <ArrowRight className="w-4 h-4 ml-1.5"/></Button>
            </div>
          </div>
        </div>
    </MaxWidthWrapper>
  )
}

export default Page