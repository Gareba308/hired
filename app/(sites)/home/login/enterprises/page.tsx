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
        duration: 3000
      });
      setLoading(false);
    }
    if (response?.ok && !response?.error) {
      toast({
        title: "Logged in",
        description: "Hello there, welcome to Hired.",
        variant: "default",
        duration: 3000
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
                    href="/home/register/enterprises"
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