"use client";

import { trpc } from "@/app/_trpc/client";
import ProfileEditUpload from "@/components/ProfileEdit";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminProfile, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  photo: z.string().optional(),
});

interface PhotoProps {
  profile: AdminProfile;
  user: User;
}

const Photo = ({ profile, user }: PhotoProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photo: profile.photo || "",
    },
  });

  const { mutate: update, isLoading } = trpc.adminUpdateProfile.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Updated your profile's photo",
        variant: "default",
        duration: 3000,
      });
      toggleEdit();
      router.refresh();
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "There was a problem updating your profile's photo",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    update({ ...values, profileId: profile.id });
  };

  const handleImageChange = async (url: string) => {
    form.setValue("photo", url);
    await form.trigger("photo"); 
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="flex w-full justify-center flex-col rounded-b-sm relative h-36 shadow-md bg-gray-200 border-r border-b border-l border-gray-200 items-center">
      <div className="text-gray-600">
        <ul role="list">
          <li className="justify-between flex flex-1">
            <div className="w-full">
              {isEditing ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-3 mt-2 sm:flex-row sm:items-center sm:gap-2 w-full">
                      <FormField
                        disabled={isLoading}
                        control={form.control}
                        name="photo"
                        render={({ field }) => (
                          <FormItem className="flex flex-col w-full">
                            <FormControl>
                              <ProfileEditUpload
                                disabled={isLoading}
                                value={field.value || ""}
                                onChange={handleImageChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="px-2 lg:px-0">
                  <div className="flex flex-col items-center">
                    <ProfileEditUpload
                      disabled={isLoading}
                      value={profile.photo || ""}
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Photo;