import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
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
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { WorkerContact } from "@prisma/client";
import { CheckIcon, ChevronDown, Loader2, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { counties } from "../../../data/create-job/CreateJobData";
import { cn } from "@/lib/utils";

type FormSchemaType = z.infer<typeof formSchema>;
const MAX_CREDIT_CHARACTERS= 20
export const formSchema = z.object({
  postal: z.string().optional(),
  zip: z.string().optional(),
  town: z.string().optional(),
  county: z.string().optional(),
});
interface BioNameProps {
  profile: WorkerContact;
}
const ContactPostalAddress = ({ profile }: BioNameProps) => {
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postal: profile.postal ? profile.postal : "",
      zip: profile.zip ? profile.zip : "",
      town: profile.town ? profile.town : "",
      county: profile.county ? profile.county : "",
    },
  });
  const { control } = form;
  const townWatch = useWatch({ control, name: "town" }) || "";
  const townLength = townWatch.length;
  const { mutate: update, isLoading } = trpc.workerUpdateContact.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description:
          "Your profile's postal address details successfully updated",
        variant: "default",
        duration: 3000,
      });
      toggleEdit();
      router.refresh();
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
            "There was a problem updating your secondary phone details",
          variant: "destructive",
          duration: 3000,
        });
      }
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: FormSchemaType) => {
    update({ ...values, workerContactId: profile.id });
  };

  return (
    <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
      <dt className="font-medium leading-6 text-gray-700">
        <div className="flex flex-1 justify-between">
          <div className="text-lg">Postal Address</div>
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
                      <Label className="font-normal text-base text-gray-800">
                        Update your postal address details?
                      </Label>
                      <div className="flex flex-col gap-3 mt-2 sm:flex-row sm:items-center sm:gap-2 w-full">
                        <FormField
                          control={form.control}
                          name="postal"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel className="font-normal text-base text-gray-800">
                                Box
                              </FormLabel>
                              <FormControl>
                                <Input
                                  disabled={isLoading}
                                  type="text"
                                  className="w-full"
                                  maxLength={10}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription></FormDescription>
                              <FormMessage className="font-normal text-red-500 text-sm" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="zip"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel className="font-normal text-base  text-gray-800">
                                ZIP Code
                              </FormLabel>
                              <FormControl>
                                <Input
                                  disabled={isLoading}
                                  type="text"
                                  className="w-full"
                                  maxLength={10}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription></FormDescription>
                              <FormMessage className="font-normal text-red-500 text-sm" />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex flex-col gap-3 mt-2 sm:flex-row sm:items-center sm:gap-2 w-full">
                        <FormField
                          control={form.control}
                          name="town"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel className="font-normal text-base text-gray-800">
                                Town
                              </FormLabel>
                              <FormControl>
                                <Input
                                  disabled={isLoading}
                                  type="text"
                                  className="w-full"
                                  maxLength={MAX_CREDIT_CHARACTERS}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription></FormDescription>
                              <FormMessage className="text-red-500 font-normal text-sm">
                                {townWatch &&
                                  townLength === MAX_CREDIT_CHARACTERS && (
                                    <>
                                      Maximum character limit of{" "}
                                      {MAX_CREDIT_CHARACTERS} reached.
                                    </>
                                  )}
                              </FormMessage>
                            </FormItem>
                          )}
                        />
                        <FormField
                          disabled={isLoading}
                          control={form.control}
                          name="county"
                          render={({ field }) => (
                            <FormItem className="flex flex-col w-full">
                              <FormLabel className="font-normal text-base  text-gray-800">
                                County
                              </FormLabel>
                              <Popover
                                open={popoverOpen}
                                onOpenChange={setPopoverOpen}
                              >
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      disabled={isLoading}
                                      className={cn(
                                        "w-full justify-between",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value
                                        ? counties.find(
                                            (county) =>
                                              county.value === field.value
                                          )?.label
                                        : "County"}
                                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 max-h-[400px] overflow-y-scroll">
                                  <Command>
                                    <CommandInput placeholder="Search county..." />
                                    <CommandEmpty>
                                      No county found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {counties
                                        .sort((a, b) =>
                                          a.label.localeCompare(b.label)
                                        )
                                        .map((county) => (
                                          <CommandItem
                                            value={county.label}
                                            key={county.value}
                                            disabled={isLoading}
                                            onSelect={() => {
                                              form.setValue(
                                                "county",
                                                county.value
                                              );
                                              setPopoverOpen(false);
                                            }}
                                          >
                                            <CheckIcon
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                county.value === field.value
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            {county.label}
                                          </CommandItem>
                                        ))}
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                              <FormDescription></FormDescription>
                              <FormMessage className="text-red-500 font-normal text-sm" />
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
                  <div className="hidden lg:flex justify-between items-center">
                    <h2 className="font-medium text-gray-700 text-base">
                      My postal address
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
                  {profile.postal && profile.town ? (
                    <>
                      <p className="font-normal text-gray-500 text-base">
                        P.O Box {profile.postal}
                        {profile.zip ? <span>-{profile.zip}</span> : null}{" "}
                        {profile.town}
                        {profile.county && <>,{profile.county}</>}
                      </p>
                    </>
                  ) : (
                    <span className="italic text-gray-500 text-sm">
                      No record found
                    </span>
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

export default ContactPostalAddress;
