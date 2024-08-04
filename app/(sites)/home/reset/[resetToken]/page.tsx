"use client"

import { trpc } from "@/app/_trpc/client"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface ResetTokenProps{
  params: {
    resetToken: string
  }
}
const Page = ({params}: ResetTokenProps) => {
  const {resetToken}= params

  const router= useRouter()

  const {toast}= useToast()

  const [data, setData]= useState({
    password: "",
    confirm_password: ""
  })

  const onFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value: typeof data[keyof typeof data] = event.target.value;
    setData({ ...data, [event.target.name]: value });
  };

  const {mutate:resetPassword, isLoading }= trpc.resetPassword.useMutation({
    onSuccess: ()=>{
      toast({
        title: "Successful registration",
        description: "Your password has been reset, login to continue using Jobs Radar",
        variant: "default"
      })
      router.push('/home/login')
    },
    onError: (err)=>{
      if(err.message){
        toast({
          title: "Something went wrong",
          description: err.message,
          variant: "destructive"
        })
      }else{
        toast({
          title: "Something went wrong",
          description: "Please try again later",
          variant: "destructive"
        })
      }
    }
  })

  const userReset = (event: React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault()
    resetPassword({...data, resetToken})
  }
  return (
    <>
    <section className="relative z-10 overflow-hidden pt-2 pb-16 md:pb-20 lg:pt-[10px] lg:pb-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[500px] rounded-md bg-primary/20 bg-opacity-5 py-10 px-6  sm:p-[60px]">
              <h3 className="mb-3 text-center text-2xl font-bold text-black  sm:text-3xl">
                Recover your password
              </h3>
              <p className="mb-11 text-center text-base font-medium text-body-color">
                Enter your registered email to recover password.
              </p>
              <form  onSubmit={userReset}>
                <div className="mb-8">
                  <label
                    htmlFor="password"
                    className="mb-3 block text-sm font-medium text-dark"
                  >
                    Your New Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    value={data.password}
                    onChange={onFieldChange}
                    required
                    placeholder="Enter your New Password"
                    className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none"
                  />
                </div>
                <div className="mb-8">
                  <label
                    htmlFor="confirm_password"
                    className="mb-3 block text-sm font-medium text-dark"
                  >
                    Your Confirm Password
                  </label>
                  <input
                    id="confirm_password"
                    type="password"
                    name="confirm_password"
                    autoComplete="new-password"
                    value={data.confirm_password}
                    onChange={onFieldChange}
                    required
                    placeholder="Re-enter your Password"
                    className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none"
                  />
                </div>
                <div className="mb-6">
                  <button disabled={isLoading} type="submit" className="flex w-full items-center justify-center rounded-md bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp">
                    {isLoading ? (<p className="flex items-center justify-center"><Loader2 className="h-4 w-4 animate-spin mr-1"/>Please wait...</p>) : (<p>Recover Password</p>)}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
  )
}

export default Page