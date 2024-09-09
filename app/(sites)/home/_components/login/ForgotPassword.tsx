"use client";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import Footer from "@/components/Footer";

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: "",
  });
  const router = useRouter();

  const { toast } = useToast();

  const onFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value: (typeof data)[keyof typeof data] = event.target.value;
    setData({ ...data, [event.target.name]: value });
  };

  const { mutate: forgotPassword, isLoading } = trpc.forgotPassword.useMutation(
    {
      onSuccess: () => {
        toast({
          title: "Successful registration",
          description:
            "Check your email for latest email from us to reset your password.",
          variant: "default",
          duration: 3000,
        });

        router.push('/')
      },
      onError: (err) => {
        if (err?.message) {
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
    }
  );

  const userForgot = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    forgotPassword({ ...data });
  };

  return (
    <>
      <section className="relative z-10 overflow-hidden min-h-[calc(100vh-70px)] px-4 pt-2 lg:pt-[40px]">
        <div className="flex flex-wrap">
          <div className="w-full">
            <div className="mx-auto px-4 w-full sm:max-w-[540px] rounded-md py-4 sm:py-8 border border-gray-200 shadow-md sm:px-[60px]">
              <h3 className="text-center text-2xl font-bold text-gray-700 sm:text-3xl">
                Recover your password
              </h3>
              <p className="mb-5 text-center text-base font-normal text-gray-700">
                Enter your registered email to recover password.
              </p>
              <form onSubmit={userForgot}>
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
                    autoComplete="email"
                    value={data.email}
                    onChange={onFieldChange}
                    required
                    placeholder="Enter your Email"
                    className="w-full h-11 rounded-sm border placeholder:text-gray-400 border-gray-300 py-3 px-6 text-base text-body-color placeholder-body-color shadow-one outline-none focus:border-primary focus-visible:shadow-none"
                  />
                </div>
                <div className="mb-2">
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="flex w-full h-12 items-center justify-center hover:opacity-90 hover:bg-primary rounded-sm bg-primary py-4 px-9 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-opacity-80 hover:shadow-signUp"
                  >
                    {isLoading ? (
                      <p className="flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        Please wait...
                      </p>
                    ) : (
                      <p>Recover Password</p>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ForgotPassword;
