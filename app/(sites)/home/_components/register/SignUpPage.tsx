"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";

const SignUpPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const router = useRouter();
  const { toast } = useToast();

  const onFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value: (typeof data)[keyof typeof data] = event.target.value;
    setData({ ...data, [event.target.name]: value });
  };

  const { mutate: registerUser, isLoading } = trpc.registerUser.useMutation({
    onSuccess: () => {
      toast({
        title: "Successful registration",
        description: "Check your email for account confirmation email.",
        variant: "default",
        duration: 3000,
      });
      router.push("/home/registered");
    },
    onError: (err) => {
      if (err.message) {
        toast({
          title: "Something went wrong",
          description: err.message,
          variant: "destructive",
          duration: 3000,
        });
      } else {
        toast({
          title: "Something went wrong",
          description: "Please try again later",
          variant: "destructive",
          duration: 3000,
        });
      }
    },
  });

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    registerUser({ ...data, role: "worker" });
  };

  return (
    <>
      <div className="relative z-10 overflow-hidden min-h-[calc(100vh-70px)] pb-5 pt-2 lg:pt-0">
        <section className="sm:mt-5 mt-4 mx-auto lg:justify-between max-w-screen-xl pb-4 px-4 items-center lg:flex md:px-8">
          <div className="space-y-4 flex-1 lg:px-0 lg:max-w-xl sm:text-center lg:text-left">
            <h1 className="text-gray-700 font-extrabold text-3xl sm:text-4xl xl:text-5xl">
              <span className="text-sky-700">Job Seekers:</span> Connect with
              Top Recruiters
            </h1>
            <p className="text-gray-700 text-base sm:text-[15px] max-w-xl leading-relaxed sm:mx-auto lg:ml-0">
              The Job Seekers&apos; section is exclusively designed for talented
              individuals to connect with leading recruiters across the nation.
              Let your skills speak for you.
            </p>
          </div>
          <div className="flex items-end mt-4 lg:mt-0 lg:ml-3">
            <div className="mx-auto w-full sm:max-w-[540px] rounded-md px-4 py-4 border border-gray-200 shadow-md sm:px-[60px]">
              <h3 className="sm:text-center text-2xl font-bold text-gray-700 sm:text-3xl">
                Sign up to create Hired account
              </h3>
              <p className="mb-4 sm:text-center text-base font-normal text-gray-700">
                It&apos;s completely free to create an account.
              </p>
              <button
                onClick={() => signIn("google")}
                className="mb-8 flex w-full h-11 items-center justify-center rounded-sm bg-white p-3 text-base font-medium text-body-color border border-gray-300 shadow-one hover:text-primary hover:bg-secondary"
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
                Sign up with Google
              </button>
              <div className="relative mb-8">
                <span className="block w-full h-px bg-gray-300"></span>
                <p className="inline-block w-fit text-sm bg-white px-2 text-gray-700 absolute -top-2 inset-x-0 mx-auto">
                  Or, sign up with your email
                </p>
              </div>
              <form onSubmit={onSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={data.name}
                    autoComplete="name"
                    onChange={onFieldChange}
                    required
                    name="name"
                    placeholder="Enter your full name"
                    className="w-full h-11 rounded-sm border border-gray-300 placeholder:text-gray-400 py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Your Email
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
                    className="w-full h-11 rounded-sm border border-gray-300 placeholder:text-gray-400 py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none"
                  />
                </div>
                <div className="mb-4">
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
                    value={data.password}
                    autoComplete="new-password"
                    onChange={onFieldChange}
                    required
                    placeholder="Enter your Password"
                    className="w-full h-11 rounded-sm border border-gray-300 placeholder:text-gray-400 py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="confirm_password"
                    className="mb-1 block text-sm font-medium text-gray-700 "
                  >
                    Confirm Password
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
                    className="w-full h-11 rounded-sm border placeholder:text-gray-400 border-gray-300 py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none"
                  />
                </div>
                <div className="mb-1 flex flex-col justify-between sm:flex-row sm:items-center">
                  <div className="text-xs">
                    By clicking register means you agree to the
                    <Link
                      href="/home/terms"
                      title="Terms"
                      className="text-[#005580] hover:underline"
                    >
                      {" "}
                      Terms{" "}
                    </Link>
                    and our
                    <Link
                      href="/home/privacy"
                      title="Privacy Policy"
                      className="text-[#005580] hover:underline"
                    >
                      {" "}
                      Privacy Policy
                    </Link>
                    .
                  </div>
                </div>
                <div className="mb-2">
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="flex w-full h-12 items-center hover:opacity-90 justify-center rounded-sm bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-primary hover:shadow-signUp"
                  >
                    {isLoading ? (
                      <p className="flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        Please wait...
                      </p>
                    ) : (
                      <p>Register</p>
                    )}
                  </button>
                </div>
              </form>
              <p className="text-center text-base font-medium text-gray-700">
                You already have an account?
                <Link
                  href="/home/login"
                  title="To login page"
                  className="text-[#005580] hover:underline ml-2"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default SignUpPage;
