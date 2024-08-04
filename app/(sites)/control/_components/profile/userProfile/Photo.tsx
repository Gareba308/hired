"use client";

import { trpc } from "@/app/_trpc/client";
import ImageUpload from "@/components/ImageUpload";
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
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminProfile, User } from "@prisma/client";
import { Camera, Edit, Loader2 } from "lucide-react";
import Image from "next/image";
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
      photo: profile.photo ? profile.photo : "",
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

  const { isSubmitting } = form.formState;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    update({ ...values, profileId: profile.id });
  };
  const src = profile.photo
    ? profile.photo
    : "https://res.cloudinary.com/dx0i37cyd/image/upload/v1708947730/avatar-159236_1280_1_r7od9k.png";
  return (
    <div className="pt-2 pb-0.5 flex w-full justify-center relative bg-slate-200 border-r border-b border-l border-gray-200 items-center">
      <div className=" text-gray-600">
        <ul role="list">
          <li className="justify-between flex flex-1 ">
            <div className="w-full">
              {isEditing ? (
                <span>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <div className="flex flex-col gap-3 mt-2 sm:flex-row sm:items-center sm:gap-2 w-full">
                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name="photo"
                          render={({ field }) => (
                            <FormItem className="flex flex-col w-full">
                              <FormLabel className="font-normal text-gray-700">
                                Update your profile photo?
                              </FormLabel>
                              <FormControl>
                                <ImageUpload
                                  disabled={isLoading}
                                  onChange={(url) => field.onChange(url)}
                                  value={field.value ? field.value : ""}
                                  onRemove={() => field.onChange("")}
                                />
                              </FormControl>
                              <FormDescription></FormDescription>
                              <FormMessage className="text-red-500 font-normal text-base" />
                            </FormItem>
                          )}
                        />
                      </div>
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
                  <div className="px-2 lg:px-0">
                    <div className="flex flex-col items-center">
                      <div
                        onClick={toggleEdit}
                        className="inline-flex w-24 cursor-pointer h-24 sm:w-28 sm:h-28 shrink-0 relative justify-center rounded-full bg-transparent border border-gray-400"
                      >
                        <Image
                          src={src}
                          alt="author"
                          fill
                          sizes="100%"
                          priority
                          style={{ objectFit: "cover" }}
                          className="rounded-full border border-gray-400"
                        />
                        <div className="absolute bottom-4 right-3 w-5 h-5 ">
                          <Button
                            size="sm"
                            variant="link"
                            type="button"
                            onClick={toggleEdit}
                          >
                            <Camera className="h-5 w-5 text-gray-800" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium">{user.name}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Photo;
