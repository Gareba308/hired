"use client";

import { AdminProfile, User } from "@prisma/client";
import AccountName from "./accountSecurity/AccountName";
import AccountEmail from "./accountSecurity/AccountEmail";
import AccountPassword from "./accountSecurity/AccountPassword";
import { Ban, Loader2, Trash } from "lucide-react";
import { useState } from "react";
import { DeleteProfileAlertModal } from "../models/profile/DeleteAlertModal";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signOut } from "next-auth/react";
interface AccountSecurityProps {
  user: User;
  profile: AdminProfile | null;
}
export type FormSchemaTypes = z.infer<typeof formSchema>;

export const formSchema = z.object({
  confirmEmail: z.string(),
});
const AccountSecurity = ({ user, profile }: AccountSecurityProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { toast } = useToast();

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const toggleDelete = () => setIsDeleting((current) => !current);

  const router = useRouter();

  const handleSignOut = () => {
    signOut({ redirect: false });
    router.push("/");
  };

  const form = useForm<FormSchemaTypes>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirmEmail: "",
    },
  });
  const { mutate: deleteAccount, isLoading } =
    trpc.deleteUserAccount.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Successfully deleted your account",
          variant: "default",
          duration: 3000,
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
            description: "There was an error while deleting your account",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const onSubmit = (value: FormSchemaTypes) => {
    deleteAccount({ ...value, id: user.id });
  };

  const onConfirmDelete = () => {
    setDeleteOpen(false);
    toggleDelete();
  };

  const mainAdmin =
  user.name?.includes("Areba") ||
  (profile?.role.includes("Founder") ||
    profile?.role.includes("CEO") ||
    profile?.role === "Main Admin" ||
    profile?.role === "Anonymous" ||
    profile?.role === "Chairman");
  return (
    <>
      <dl className="divide-y divide-gray-100">
        <AccountName user={user} />
        <AccountEmail user={user} />
        <AccountPassword user={user} />

        <div className="pt-4">
          <dl className={cn("border border-red-200 rounded-lg px-2.5 lg:px-3",
          mainAdmin && "border-gray-200")}>
            <div className="pt-2 pb-4 pl-0.5 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-800">
              <DeleteProfileAlertModal
                isOpen={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={onConfirmDelete}
                loading={isLoading}
                user={user}
              />
              {!mainAdmin ? (
                <dt className="text-xl font-bold text-destructive-foreground">
                  Delete Account
                </dt>
              ) : (
                <dt className="text-xl font-bold text-emerald-700">
                  Delete Account
                </dt>
              )}
              <dd className="mt-1 leading-6 text-gray-600 sm:col-span-2 sm:mt-0">
                {!mainAdmin ? (
                  <p className="mt-1 max-w-full leading-6 text-base text-gray-500">
                    We encourage you to observe{" "}
                    <span className="font-medium text-primary">CAUTION</span>{" "}
                    before deleting your account. Deleting will erase all your
                    data from database. This action is IRREVERSIBLE.
                  </p>
                ) : (
                  <p className="mt-1 max-w-full leading-6 text-base text-gray-500">
                    As the{" "}
                    <span className="font-medium text-primary">
                      {" "}
                      Main Admin
                    </span>{" "}
                    or a user with specific role, you cannot delete your
                    profile. Deleting will erase all your data from database.
                    This action is IRREVERSIBLE.
                  </p>
                )}

                {!isDeleting && (
                  <>
                    {!mainAdmin ? (
                      <p className="mt-1 text-gray-500 italic text-sm">
                        <span className="not-italic font-medium">Note: </span>By
                        clicking{" "}
                        <span className="font-medium text-destructive-foreground not-italic">
                          Delete
                        </span>{" "}
                        button below, you will be asked to input your{" "}
                        <span className="font-medium not-italic">
                          email address
                        </span>
                        .
                      </p>
                    ) : (
                      <p className="mt-1 text-gray-500 italic text-sm">
                        <span className="not-italic font-medium">Note: </span>By
                        clicking{" "}
                        <span className="font-medium text-emerald-700 not-italic">
                          Delete
                        </span>{" "}
                        button below, nothing will happen to your account as you
                        are a user with a role.
                      </p>
                    )}
                  </>
                )}
                {!isDeleting && (
                  <div className="flex flex-col sm:flex-row items-center justify-start gap-2">
                    <button
                      type="button"
                      disabled={isLoading || mainAdmin}
                      onClick={() => setDeleteOpen(true)}
                      className={cn(
                        "flex mt-4 w-full sm:w-[200px] rounded-sm items-center justify-center border border-destructive-foreground/20 bg-red-100 px-8 py-3 text-base font-medium text-destructive-foreground",
                        isLoading
                          ? "opacity-60"
                          : mainAdmin
                          ? "bg-[#63cc79] border-green-100 text-slate-900"
                          : ""
                      )}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                        </>
                      ) : (
                        <span className="flex items-center">
                          {!mainAdmin ? (
                            <Trash className="h-4 w-4 mr-1 shrink-0" />
                          ) : (
                            <Ban className="h-4 w-4 mr-1 shrink-0" />
                          )}
                          <>{mainAdmin ? "Disabled" : "Delete"}</>
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => router.push(`/manage`)}
                      className="flex mt-4 w-full sm:w-[200px] rounded-sm items-center justify-center border border-gray-200 bg-slate-200 px-8 py-3 text-base font-medium text-gray-800"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                {isDeleting && (
                  <>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                          control={form.control}
                          name="confirmEmail"
                          disabled={isLoading}
                          render={({ field }) => (
                            <FormItem className="text-base text-gray-700 mt-4">
                              <FormLabel>
                                Enter Email Address
                                <span className="text-red-500 ml-0.5">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="Your account's email"
                                  {...field}
                                  required
                                  className="placeholder:text-base placeholder:text-gray-500 placeholder:italic"
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage className="text-red-500 text-sm" />
                            </FormItem>
                          )}
                        />
                        <div className="flex flex-col sm:flex-row items-center justify-start gap-2 lg:gap-4">
                          <button
                            disabled={mainAdmin}
                            type="submit"
                            className="flex mt-4 w-full sm:w-[200px] border border-destructive-foreground/20 rounded-sm items-center justify-center bg-red-100 px-8 py-3 sm:py-3.5 text-base font-medium text-destructive-foreground"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                              </>
                            ) : (
                              <span className="flex items-center">
                                <Trash className="h-4 w-4 mr-1" />
                                Delete
                              </span>
                            )}
                          </button>
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={toggleDelete}
                            className="flex mt-4 w-full sm:w-[200px] rounded-sm items-center justify-center border border-gray-300 bg-slate-200 px-8 py-3 sm:py-3.5 text-base font-medium text-gray-800"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </Form>
                  </>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </dl>
    </>
  );
};

export default AccountSecurity;
