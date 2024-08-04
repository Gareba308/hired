"use client";

import React from "react";
import { Loader2, User2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormLabel,
  FormControl,
  FormItem,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  role: z.string(),
});

const NoRole = () => {
  const { toast } = useToast();

  const router= useRouter()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const { mutate: update, isLoading } = trpc.updateUserRole.useMutation({
    onSuccess: (data) => {
      const userRole = data.role;

      toast({
        title: "Success",
        description: `You have successfully been assigned ${userRole} role`,
        variant: "default",
        duration: 3000,
      });
      if(userRole === 'employer'){
        router.push('/manage')
      }else if(userRole === 'worker'){
        router.push('/site')
      }
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
          description:
            "There was a problem assigning you a role. Please try again later.",
          variant: "destructive",
          duration: 3000,
        });
      }
    },
  });

  const onSubmit =  (value: z.infer<typeof formSchema>) => {
    update({ ...value });
  };

  return (
    <main>
      <div className="bg-white max-w-screen-xl mx-auto px-4 flex items-center justify-start min-h-[calc(100vh-80px)] md:px-8">
        <div className="max-w-lg mx-auto space-y-3 text-center">
          <h3 className="text-gray-600 font-semibold text-2xl flex flex-col items-center mb-8">
            <User2 className="h-16 w-16 sm:h-20 sm:w-20 border border-gray-600 rounded-full" />
            <p>User Profile</p>
          </h3>
          <p className="text-gray-600 text-4xl font-semibold sm:text-5xl">
            No role assigned
          </p>
          <p className="text-gray-600 md:text-lg">
            Your google account has not been assigned a role. Choose your role
            from the list below.
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="text-center flex justify-center mb-4">
                <FormField
                  disabled={isSubmitting || isLoading}
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">
                        What role would you like to have on this platform?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col justify-center items-center space-y-1 text-lg"
                        >
                          <FormItem className="flex items-center text-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                disabled={isSubmitting || isLoading}
                                value="worker"
                              />
                            </FormControl>
                            <FormLabel className="font-normal text-base md:text-lg">
                              Job Seeker
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                disabled={isSubmitting || isLoading}
                                value="employer"
                              />
                            </FormControl>
                            <FormLabel className="font-normal text-base md:text-lg">
                              Employer
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting || !isValid}
                  className="w-full bg-primary p-3 text-primary-foreground md:text-lg rounded-md"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                      Just a moment...
                    </span>
                  ) : (
                    <span>Create User Role</span>
                  )}
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default NoRole;
