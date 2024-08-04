"use client"

import { useState } from "react"
import Link from "next/link";
import { signIn} from "next-auth/react"
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const [data, setData]= useState({
    name: "", 
    email: "",  
    password: "", 
    confirm_password: "",
    role:""
})

const router= useRouter()

const {toast}= useToast()

const onFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  let value: typeof data[keyof typeof data] = event.target.value;
  setData({ ...data, [event.target.name]: value });
};

const {mutate:registerUser, isLoading}= trpc.registerUser.useMutation({
  onSuccess: ()=>{
    toast({
      title: "Successful registration",
      description: "Check your email for account confirmation email.",
      variant: "default",
      duration: 3000
    })
    router.push('/home/registered')
  },
  onError: (err)=>{
    if(err.message){
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

const onSubmit= (event: React.FormEvent<HTMLFormElement>)=>{
  event.preventDefault()
  registerUser({...data})
}

  return (
    <>
      <section className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[10px] lg:pb-28">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="mx-auto max-w-[500px] rounded-md bg-primary/20 bg-opacity-5 py-10 px-6 sm:p-[60px]">
                <h3 className="mb-3 text-center text-2xl font-bold text-black sm:text-3xl">
                  Create your account
                </h3>
                <p className="mb-11 text-center text-base font-medium text-body-color">
                  Is totally free and super easy
                </p>
                <button onClick={()=>signIn('google')} className="mb-6 flex w-full items-center justify-center rounded-md bg-white p-3 text-base font-medium text-body-color shadow-one hover:text-primary">
                  <span className="mr-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_95:967)">
                        <path
                          d="M20.0001 10.2216C20.0122 9.53416 19.9397 8.84776 19.7844 8.17725H10.2042V11.8883H15.8277C15.7211 12.539 15.4814 13.1618 15.1229 13.7194C14.7644 14.2769 14.2946 14.7577 13.7416 15.1327L13.722 15.257L16.7512 17.5567L16.961 17.5772C18.8883 15.8328 19.9997 13.266 19.9997 10.2216"
                          fill="#4285F4"
                        />
                        <path
                          d="M10.2042 20.0001C12.9592 20.0001 15.2721 19.1111 16.9616 17.5778L13.7416 15.1332C12.88 15.7223 11.7235 16.1334 10.2042 16.1334C8.91385 16.126 7.65863 15.7206 6.61663 14.9747C5.57464 14.2287 4.79879 13.1802 4.39915 11.9778L4.27957 11.9878L1.12973 14.3766L1.08856 14.4888C1.93689 16.1457 3.23879 17.5387 4.84869 18.512C6.45859 19.4852 8.31301 20.0005 10.2046 20.0001"
                          fill="#34A853"
                        />
                        <path
                          d="M4.39911 11.9777C4.17592 11.3411 4.06075 10.673 4.05819 9.99996C4.0623 9.32799 4.17322 8.66075 4.38696 8.02225L4.38127 7.88968L1.19282 5.4624L1.08852 5.51101C0.372885 6.90343 0.00012207 8.4408 0.00012207 9.99987C0.00012207 11.5589 0.372885 13.0963 1.08852 14.4887L4.39911 11.9777Z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M10.2042 3.86663C11.6663 3.84438 13.0804 4.37803 14.1498 5.35558L17.0296 2.59996C15.1826 0.901848 12.7366 -0.0298855 10.2042 -3.6784e-05C8.3126 -0.000477834 6.45819 0.514732 4.8483 1.48798C3.2384 2.46124 1.93649 3.85416 1.08813 5.51101L4.38775 8.02225C4.79132 6.82005 5.56974 5.77231 6.61327 5.02675C7.6568 4.28118 8.91279 3.87541 10.2042 3.86663Z"
                          fill="#EB4335"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_95:967">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  Sign up with Google
                </button>
                <div className="mb-8 flex items-center justify-center">
                  <span className="hidden h-[1px] w-full max-w-[60px] bg-body-color sm:block"></span>
                  <p className="w-full px-5 text-center text-base font-medium text-body-color">
                    Or, register with your email
                  </p>
                  <span className="hidden h-[1px] w-full max-w-[60px] bg-body-color sm:block"></span>
                </div>
                <form  onSubmit={onSubmit}>
                  <div className="mb-8">
                    <label
                      htmlFor="name"
                      className="mb-3 block text-sm font-medium text-dark "
                    >
                      {" "}
                      Full Name{" "}
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={data.name}
                      onChange={onFieldChange}
                      required
                      name="name"
                      placeholder="Enter your full name"
                      className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none"
                    />
                  </div>
                  <div className="mb-8">
                    <label
                      htmlFor="email"
                      className="mb-3 block text-sm font-medium text-dark"
                    >
                      {" "}
                      Email Address{" "}
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={data.email}
                      autoComplete="username"
                      onChange={onFieldChange}
                      required
                      name="email"
                      placeholder="Enter your Email"
                      className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none"
                    />
                  </div>
                  <div className="mb-8">
                    <label
                      htmlFor="role"
                      className="mb-3 block text-sm font-medium text-dark"
                    >
                      {" "}
                      Role{" "}
                    </label>
                    <input
                      type="text"
                      id="role"
                      value={data.role}
                      onChange={onFieldChange}
                      required
                      name="role"
                      placeholder="Enter your role"
                      className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none"
                    />
                  </div>
                  <div className="mb-8">
                    <label
                      htmlFor="password"
                      className="mb-3 block text-sm font-medium text-dark"
                    >
                      {" "}
                      Your Password{" "}
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={data.password}
                      autoComplete="new-password"
                      onChange={onFieldChange}
                      required
                      placeholder="Enter your Password"
                      className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none"
                    />
                  </div>
                  <div className="mb-8">
                    <label
                      htmlFor="confirm_password"
                      className="mb-3 block text-sm font-medium text-dark"
                    >
                      {" "}
                      Confirm  Password{" "}
                    </label>
                    <input
                      id="confirm_password"
                      type="password"
                      name="confirm_password"
                      value={data.confirm_password}
                      onChange={onFieldChange}
                      autoComplete="new-password"
                      required
                      placeholder="Enter your Password"
                      className="w-full rounded-md border border-transparent py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none"
                    />
                  </div>
                  <div className="mb-8 flex">
                    <label
                      htmlFor="checkboxLabel"
                      className="flex cursor-pointer select-none text-sm font-medium text-body-color"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="checkboxLabel"
                          className="sr-only"
                        />
                      </div>
                      <span>
                        By creating account means you agree to the
                        <a href="#0" className="text-primary hover:underline">
                          {" "}
                          Terms and Conditions{" "}
                        </a>
                        , and our
                        <a href="#0" className="text-primary hover:underline">
                          {" "}
                          Privacy Policy{" "}
                        </a>
                      </span>
                    </label>
                  </div>
                  <div className="mb-6">
                    <button disabled={isLoading} type="submit" className="flex w-full items-center justify-center rounded-md bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp">
                      {isLoading ? (<p className="flex items-center justify-center"><Loader2 className="h-4 w-4 animate-spin mr-1"/>Registering account...</p>) : (<p>Register</p>)}
                    </button>
                  </div>
                </form>
                <p className="text-center text-base font-medium text-body-color">
                  Already using Jobs Radar?
                  <Link href="/home/login" className="text-primary hover:underline ml-2">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUpPage;