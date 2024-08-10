"use client";

import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { Reset } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ResetTokenProps {
  resetExists: Reset
}
const ResetPassword = ({ resetExists }: ResetTokenProps) => {

  const router = useRouter();
  const resetToken= resetExists.resetToken
  const role= resetExists.role as string

  const { toast } = useToast();

  const [data, setData] = useState({
    password: "",
    confirm_password: "",
  });

  const onFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value: (typeof data)[keyof typeof data] = event.target.value;
    setData({ ...data, [event.target.name]: value });
  };

  const { mutate: resetPassword, isLoading } = trpc.resetPassword.useMutation({
    onSuccess: () => {
      toast({
        title: "Successful registration",
        description:
          "Your password has been reset, login to continue using Jobs Radar",
        variant: "default",
        duration: 3000
      });

      const roleRedirectMap: { [key: string]: string } = {
        employer: "/home/login/enterprises",
        worker: "/home/login",
      };

      router.push(roleRedirectMap[role] || "/home/login");
    },
    onError: (err) => {
      if (err.message) {
        toast({
          title: "Something went wrong",
          description: err.message,
          variant: "destructive",
          duration: 3000
        });
      } else {
        toast({
          title: "Something went wrong",
          description: "Please try again later",
          variant: "destructive",
          duration: 3000
        });
      }
    },
  });

  const userReset = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetPassword({ ...data, resetToken });
  };
  return (
    <>
      <section className="relative z-10 overflow-hidden min-h-[calc(100vh-70px)] pt-2 lg:pt-[40px]">
        <div className="flex flex-wrap">
          <div className="w-full">
            <div className="mx-auto px-4 w-full sm:max-w-[540px] rounded-md py-4 sm:py-8 sm:border sm:border-gray-200 sm:shadow-md sm:px-[60px]">
              <h3 className="text-center text-2xl font-bold text-gray-700 sm:text-3xl">
                Reset your account&apos;s password
              </h3>
              <p className="mb-5 text-center text-base font-normal text-gray-700">
                Enter new password details to reset your account
              </p>
              <form onSubmit={userReset}>
                <div className="mb-5">
                  <label
                    htmlFor="password"
                    className="mb-1 block text-sm font-medium text-dark"
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
                    placeholder="Enter your new password"
                    className="w-full rounded-sm border h-11 border-gray-300 placeholder:text-gray-400 py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none"
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="confirm_password"
                    className="mb-1 block text-sm font-medium text-dark"
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
                    placeholder="Re-enter your password"
                    className="w-full rounded-sm border h-11 border-gray-300 placeholder:text-gray-400 py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none"
                  />
                </div>
                <div className="mb-2">
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="flex w-full h-12 items-center justify-center hover:opacity-90 rounded-sm bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
                  >
                    {isLoading ? (
                      <p className="flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        Please wait...
                      </p>
                    ) : (
                      <p>Reset Password</p>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResetPassword;
