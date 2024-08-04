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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { WorkerDesires } from "@prisma/client";
import { CheckIcon, ChevronDown, Loader2, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { categories, counties } from "../../../data/create-job/CreateJobData";

type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  category: z.string().optional(),
});
interface BioNameProps {
  profile: WorkerDesires;
}
const DesiredJobCategoryEdit = ({ profile }: BioNameProps) => {
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: profile.category ? profile.category : "",
    },
  });

  const { mutate: update, isLoading } = trpc.workerUpdateDesires.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description:
          "Your profile job category details has successfully been updated",
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
            "There was a problem updating your profile job category details",
          variant: "destructive",
          duration: 3000,
        });
      }
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: FormSchemaType) => {
    update({ ...values, workerDesiredId: profile.id });
  };

  return (
    <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
      <dt className="font-medium leading-6 text-gray-700">
        <div className="flex flex-1 justify-between">
          <div className="text-lg">Desired Job Category</div>
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
                        disabled={isLoading}
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="font-normal">
                              Update the your desired job category?
                            </FormLabel>
                            <Popover
                              open={popoverOpen}
                              onOpenChange={setPopoverOpen}
                            >
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    disabled={isLoading}
                                    role="combobox"
                                    className={cn(
                                      "w-full justify-between font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value
                                      ? categories.find(
                                          (category) =>
                                            category.value === field.value
                                        )?.label
                                      : "Select a category"}
                                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="p-0 max-h-[500px] overflow-y-scroll">
                                <Command>
                                  <CommandInput placeholder="Search a category..." />
                                  <CommandEmpty>
                                    No category found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {categories
                                      .sort((a, b) =>
                                        a.label.localeCompare(b.label)
                                      )
                                      .map((category) => (
                                        <CommandItem
                                          value={category.label}
                                          key={category.value}
                                          disabled={isLoading}
                                          onSelect={() => {
                                            form.setValue(
                                              "category",
                                              category.value
                                            );
                                            setPopoverOpen(false);
                                          }}
                                        >
                                          <CheckIcon
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              category.value === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {category.label}
                                        </CommandItem>
                                      ))}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormDescription></FormDescription>
                            <FormMessage className="text-red-500 text-sm font-normal" />
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
                      Category:
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
                  {profile.category ? (
                    <>
                      <div className="font-normal text-gray-500 text-base">
                        {profile.category}
                      </div>
                    </>
                  ) : (
                    <span className="italic text-sm text-gray-500">
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

export default DesiredJobCategoryEdit;
