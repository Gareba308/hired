"use client"

import { useState} from "react"
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/client";

const ForgotPassword = () => {
  const [data, setData]= useState({ 
      email: "",
  })
  const router= useRouter()
  
  const { toast }= useToast()

const onFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value: typeof data[keyof typeof data] = event.target.value;
    setData({ ...data, [event.target.name]: value });
};  

const {mutate: reVerify, isLoading}= trpc.reVerify.useMutation({
  onSuccess: ()=>{
    toast({
      title: "Successful registration",
      description: "Check your email for account confirmation email.",
      variant: "default",
      duration: 3000
    })
    router.push("/home/resend")
  },
  onError: (err)=>{
    if(err?.message){
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
        duration: 3000
      })
    }else{
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
        duration: 3000
      })
    }
  }
})

const userVerify = (event: React.FormEvent<HTMLFormElement>)=>{
  event.preventDefault()
  reVerify({...data})
}

  return (
    <>
      <section className="relative z-10 overflow-hidden pt-2 pb-16 md:pb-20 lg:pt-[10px] lg:pb-28">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[500px] rounded-md bg-primary/20 bg-opacity-5 py-10 px-6 sm:p-[60px]">
                <h3 className="mb-3 text-center text-2xl font-bold text-black sm:text-3xl">
                  Resend verification email
                </h3>
                <p className="mb-11 text-center text-base font-medium text-body-color">
                  Enter your registered email to verify.
                </p>
                <form  onSubmit={userVerify}>
                  <div className="mb-8">
                    <label
                      htmlFor="email"
                      className="mb-3 block text-sm font-medium text-dark"
                    >
                      Your Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      autoComplete="username"
                      disabled={isLoading}
                      value={data.email}
                      onChange={onFieldChange}
                      required
                      placeholder="Enter your Email"
                      className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none"
                    />
                  </div>
                  <div className="mb-6">
                    {isLoading ? (<button disabled={isLoading} type="submit" className="flex w-full items-center justify-center rounded-md bg-primary/70 py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp">
                      {isLoading && (<p className="flex items-center justify-center"><Loader2 className="h-4 w-4 animate-spin mr-1"/>Please wait...</p>)}
                    </button>) 
                      : 
                    (<button type="submit" className="flex w-full items-center justify-center rounded-md bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp">
                      <p className="flex items-center justify-center">Resend email</p>
                    </button>)}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;