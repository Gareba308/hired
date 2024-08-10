"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const SigninPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  const { toast } = useToast();

  const onFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value: (typeof data)[keyof typeof data] = event.target.value;
    setData({ ...data, [event.target.name]: value });
  };

  const userLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const response = await signIn("credentials", { ...data, redirect: false });

    if (response?.error) {
      toast({
        title: "Something went wrong",
        description: response.error,
        variant: "destructive",
        duration: 3000,
      });
      setLoading(false);
    }
    if (response?.ok && !response?.error) {
      toast({
        title: "Logged in",
        description: "Hello there, welcome to Hired.",
        variant: "default",
        duration: 3000,
      });
      setLoading(false);
      router.refresh();
    }
  };

  return (
    <>
      <section className="relative z-10 overflow-hidden min-h-[calc(100vh-70px)] pt-2 lg:pt-[30px]">
        <div>
          <div className="flex flex-wrap">
            <div className="w-full">
              <div className="mx-auto w-full px-4 sm:max-w-[540px] rounded-md py-4 sm:border sm:border-gray-200 sm:shadow-md sm:px-[60px]">
                <h3 className="text-center text-2xl font-bold text-gray-700 sm:text-3xl">
                  Sign in to your Hired account
                </h3>
                <p className="mb-5 text-center text-base font-normal text-gray-700">
                  You&apos;re just a login away from an enhanced user
                  experience.
                </p>
                <button
                  onClick={() => signIn("google")}
                  className="mb-8 flex w-full h-11 items-center justify-center rounded-sm hover:bg-secondary bg-white p-3 text-base font-medium text-body-color border border-gray-300 shadow-one hover:text-primary"
                >
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
                  Sign in with Google
                </button>
                <div className="relative mb-8">
                  <span className="block w-full h-px bg-gray-300"></span>
                  <p className="inline-block w-fit text-sm bg-white px-2 text-gray-700 absolute -top-2 inset-x-0 mx-auto">
                    Or, sign in with your email
                  </p>
                </div>
                <form onSubmit={userLogin}>
                  <div className="mb-5">
                    <label
                      htmlFor="email"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Your Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      autoComplete="username"
                      value={data.email}
                      onChange={onFieldChange}
                      required
                      placeholder="Enter your Email"
                      className="w-full h-11 rounded-sm border placeholder:text-gray-400 border-gray-300 py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none"
                    />
                  </div>

                  <div className="mb-5">
                    <label
                      htmlFor="password"
                      className="mb-1 block text-sm font-medium text-gray-700 "
                    >
                      Your Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      autoComplete="new-password"
                      value={data.password}
                      onChange={onFieldChange}
                      required
                      placeholder="Enter your Password"
                      className="w-full h-11 rounded-sm border placeholder:text-gray-400 border-gray-300 py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none"
                    />
                  </div>
                  <div className="mb-1 flex justify-start flex-row items-start">
                    <div>
                      <Link
                        href="/home/forgot-password"
                        className="text-sm font-normal text-primary underline hover:text-[#005580]"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </div>
                  <div className="mb-2">
                    <button
                      disabled={loading}
                      type="submit"
                      className="flex w-full h-12 items-center hover:opacity-90 justify-center rounded-sm bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
                    >
                      {loading ? (
                        <p className="flex items-center justify-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          Please wait...
                        </p>
                      ) : (
                        <p>Login</p>
                      )}
                    </button>
                  </div>
                </form>
                <p className="text-center text-base font-medium text-gray-700">
                  You don&apos;t have an account?
                  <Link
                    href="/home/register"
                    className="text-[#005580] hover:underline ml-2"
                  >
                    Register here
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

export default SigninPage;
