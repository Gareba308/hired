"use client";

import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserReferrals } from "@prisma/client";

interface EmailReferSignUpProps {
  referrer: UserReferrals;
}

const EmailReferSignUp = ({ referrer }: EmailReferSignUpProps) => {
  const [data, setData] = useState({
    name: "",
    password: "",
    confirm_password: "",
  });

  const router = useRouter();

  const { toast } = useToast();

  const onFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value: (typeof data)[keyof typeof data] = event.target.value;
    setData({ ...data, [event.target.name]: value });
  };

  const { mutate: registerUser, isLoading } =
    trpc.registerReferredUser.useMutation({
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
    registerUser({
      ...data,
      email: referrer.inviteeEmail,
      referrerUserId: referrer.userId,
      referrerEmail: referrer.email,
      referrerName: referrer.fullName as string,
      referrerRole: referrer.myRole as string,
      referrerUniqueCode: referrer.uniqueCode,
    });
  };

  return (
    <>
      <div className="relative z-10 overflow-hidden min-h-[calc(100vh-70px)] pb-5 pt-2 lg:pt-0">
        <section className="sm:mt-5 mt-4 mx-auto lg:justify-between max-w-screen-xl pb-4 px-4 items-center lg:flex md:px-8">
          <div className="space-y-4 flex-1 px-4 lg:px-0 lg:max-w-xl sm:text-center lg:text-left">
            <h1 className="text-gray-700 font-extrabold text-3xl sm:text-4xl xl:text-5xl">
              Hired <span className="text-sky-700">Referrals:</span> Unmatched
              Experience
            </h1>
            <p className="text-gray-700 text-base sm:text-[15px] max-w-xl leading-relaxed sm:mx-auto lg:ml-0">
              You are about to join and witness unmatched user experience, the
              platform where top employers meet highly talented candidates.
            </p>
          </div>
          <div className="flex items-end mt-4 lg:mt-0 lg:ml-3">
            <div className="mx-auto w-full px-4 sm:max-w-[540px] rounded-md py-4 sm:border sm:border-gray-200 sm:shadow-md sm:px-[60px]">
              <h3 className="sm:text-center text-2xl font-bold text-gray-700 sm:text-3xl">
                Sign up to create Hired account
              </h3>
              <p className="mb-4 sm:text-center text-base font-normal text-gray-700">
                <span className="text-[#005580]">{referrer.fullName}</span> you
              </p>
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
                    value={referrer.inviteeEmail}
                    autoComplete="username"
                    onChange={onFieldChange}
                    required
                    readOnly
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
                    <a href="#0" className="text-[#005580] hover:underline">
                      {" "}
                      Terms{" "}
                    </a>
                    and our
                    <a href="#0" className="text-[#005580] hover:underline">
                      {" "}
                      Privacy Policy
                    </a>
                    .
                  </div>
                </div>
                <div className="mb-2">
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="flex w-full h-12 items-center hover:opacity-90 justify-center rounded-sm bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
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
                  href={
                    referrer.myRole === "worker"
                      ? "/home/login"
                      : "/home/login/enterprises"
                  }
                  className="text-[#005580] hover:underline ml-2"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default EmailReferSignUp;
