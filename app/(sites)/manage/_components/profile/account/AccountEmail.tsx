"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripVertical, Loader2, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { User } from "@prisma/client";
import { z } from "zod";
import { signOut } from "next-auth/react";

type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  oldEmail: z.string(),
  email: z.string().optional(),
  newEmailConfirm: z.string().optional(),
});

interface SecurityEmailProps {
  user: User;
}
const AccountEmail = ({ user }: SecurityEmailProps) => {
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const router = useRouter();

  const handleSignOut = () => {
    signOut({ redirect: false });
    router.push("/");
  };

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldEmail: user.email,
      email: "",
      newEmailConfirm: "",
    },
    mode: "onChange",
  });

  const { mutate: update, isLoading } = trpc.updateUserEmail.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description:
          "Request to have your primary email changed has been received. Check your email address to verify the request",
        variant: "default",
        duration: 4000,
      });
      handleSignOut();
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
            "There was a problem changing your primary email address. Please try again later or talk to our team.",
          variant: "destructive",
          duration: 3000,
        });
      }
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = (values: FormSchemaType) => {
    update({ ...values });
  };

  return (
    <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
      <dt className="font-medium leading-6 text-gray-700">
        <div className="flex flex-1 justify-between">
          <div className="text-base flex items-center">
            <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
            Primary Email
          </div>
          {!isEditing && (
            <div className="ml-4 pl-4 lg:hidden lg:ml-8 flex-shrink-0">
              <Button
                variant="secondary"
                type="button"
                size="sm"
                className="font-normal flex items-center text-primary"
                onClick={toggleEdit}
              >
                <PenLine className="h-4 w-4 mr-1" /> Edit
              </Button>
            </div>
          )}
        </div>
      </dt>
      <dd className=" text-gray-600 lg:col-span-2">
        <ul role="list" className="">
          <li className="justify-between flex flex-1 ">
            <div className="w-full">
              {isEditing ? (
                <span>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <FormField
                        control={form.control}
                        name="oldEmail"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-base font-normal text-gray-700">
                              Current email address
                            </FormLabel>
                            <FormControl>
                              <Input
                                readOnly
                                className="bg-secondary text-gray-700"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Note: We auto-added the above CURRENT EMAIL
                              address. You don&apos;t need to enter it.
                            </FormDescription>
                            <FormMessage className="text-red-500 font-normal text-base" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="flex flex-col mt-4">
                            <FormLabel className="text-base font-normal text-gray-700">
                              New email address
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="e.g. example@example.com"
                                required
                                disabled={isLoading}
                                {...field}
                              />
                            </FormControl>
                            <FormDescription></FormDescription>
                            <FormMessage className="text-red-500 font-normal text-base" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="newEmailConfirm"
                        render={({ field }) => (
                          <FormItem className="flex flex-col mt-4">
                            <FormLabel className="text-base font-normal text-gray-700">
                              Re-enter new email address
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="e.g. example@example.com"
                                disabled={isLoading}
                                required
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              You will be LOGGED OUT and receive a confirmation
                              email in your NEW address to complete the request.
                            </FormDescription>
                            <FormMessage className="text-red-500 font-normal text-base" />
                          </FormItem>
                        )}
                      />
                      <div className="flex flex-col gap-4 sm:flex-row mt-4 justify-start items-center">
                        <button
                          type="submit"
                          disabled={isLoading || isSubmitting}
                          className="rounded-sm w-full font-medium lg:w-[120px] bg-primary border border-primary text-primary-foreground py-2.5 flex items-center justify-center"
                        >
                          {isLoading ? (
                            <span className="flex items-center justify-center">
                              <Loader2 className="h-5 w-5 animate-spin" />
                            </span>
                          ) : (
                            <span>Update</span>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={toggleEdit}
                          disabled={isLoading || isSubmitting}
                          className="rounded-sm font-medium w-full lg:w-[120px] bg-slate-200 border border-gray-300 text-secondary-foreground py-2.5 flex items-center justify-center"
                        >
                          <span>Close</span>
                        </button>
                      </div>
                    </form>
                  </Form>
                </span>
              ) : (
                <>
                  <div className="hidden lg:flex justify-between items-center">
                    <h2 className="font-medium text-gray-700 text-base">
                      User Email
                    </h2>
                    <Button
                      variant="secondary"
                      type="button"
                      size="sm"
                      className="font-normal flex items-center text-primary"
                      onClick={toggleEdit}
                    >
                      <PenLine className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </div>
                  {user.email ? (
                    <>
                      <span className="font-normal text-gray-500 text-base">
                        {user.email}
                      </span>
                    </>
                  ) : (
                    <span className="italic">No record found</span>
                  )}
                </>
              )}
            </div>
          </li>
        </ul>
      </dd>
    </div>
  );
};

export default AccountEmail;
