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
import { SecondaryEducation } from "@prisma/client";
import { CheckIcon, ChevronDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { counties } from "../../../data/create-job/CreateJobData";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CloudUpload from "@/components/CloudUpload";
import { useState } from "react";
import AvailableSecondaryCreated from "../../created/AvailableSecondaryCreated";

type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  school: z.string().optional(),
  county: z.string().optional(),
  startMonth: z.string().optional(),
  startYear: z.string().optional(),
  endMonth: z.string().optional(),
  endYear: z.string().optional(),
  certificateUpload: z.string().optional(),
});

interface EditSecondaryEducationProps {
  secondaryEducation: SecondaryEducation;
}

const EditSecondaryEducation = ({
  secondaryEducation,
}: EditSecondaryEducationProps) => {
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      school: secondaryEducation.school ? secondaryEducation.school : "",
      county: secondaryEducation.county ? secondaryEducation.county : "",
      startMonth: secondaryEducation.startMonth
        ? secondaryEducation.startMonth
        : "",
      startYear: secondaryEducation.startYear
        ? secondaryEducation.startYear
        : "",
      endMonth: secondaryEducation.endMonth ? secondaryEducation.endMonth : "",
      endYear: secondaryEducation.endYear ? secondaryEducation.endYear : "",
      certificateUpload: secondaryEducation.certificateUpload
        ? secondaryEducation.certificateUpload
        : "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const { mutate: updateSecondaryEducation, isLoading } =
    trpc.workerUpdateSecondaryEducation.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Successfully updated your secondary education details.",
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
              "There was a problem updating your secondary education details. Please try again later",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const onSubmit = async (values: FormSchemaType) => {
    updateSecondaryEducation({
      ...values,
      secondaryEducationID: secondaryEducation.id,
    });
  };
  return (
    <>
      {isEditing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="font-normal border border-gray-200 rounded-lg pb-3">
              <div className="bg-secondary rounded-tl-lg rounded-tr-lg py-1.5 px-2.5 lg:px-3 border-b border-gray-200">
                <h2 className="font-medium text-gray-600 text-lg">
                  Edit Secondary Education
                </h2>
              </div>
              <dl className="divide-y divide-gray-100 px-2.5 lg:px-3">
                <div className="py-3 sm:py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                  <dt className="font-medium text-base leading-6 text-gray-700">
                    Name of school
                  </dt>

                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                    <FormField
                      control={form.control}
                      name="school"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-normal text-base">
                            What&apos;s the name of the secondary school?
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Nairobi School"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500 font-normal text-base" />
                        </FormItem>
                      )}
                    />
                  </dd>
                </div>

                <div className="py-3 sm:py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                  <dt className="font-medium text-base leading-6 text-gray-700">
                    County of location
                  </dt>

                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                    <FormField
                      control={form.control}
                      name="county"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-normal text-base">
                            In which county is the school located?
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
                                  className={cn(
                                    "w-full sm:w-[400px] justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? counties.find(
                                        (county) => county.value === field.value
                                      )?.label
                                    : "Select county of location"}
                                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 max-h-[400px] overflow-y-scroll">
                              <Command>
                                <CommandInput placeholder="Search county..." />
                                <CommandEmpty>No county found.</CommandEmpty>
                                <CommandGroup>
                                  {counties
                                    .sort((a, b) =>
                                      a.label.localeCompare(b.label)
                                    )
                                    .map((county) => (
                                      <CommandItem
                                        value={county.label}
                                        key={county.value}
                                        onSelect={() => {
                                          form.setValue("county", county.value);
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
                          <FormMessage className="text-red-500 font-normal text-base" />
                        </FormItem>
                      )}
                    />
                  </dd>
                </div>

                <div className="py-3 sm:py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                  <dt className="font-medium text-base leading-6 text-gray-700">
                    Start date
                  </dt>

                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                    <Label className="font-normal text-base">
                      Select the month and year when you joined this secondary
                      school
                    </Label>
                    <div className="flex flex-row gap-4 xl:gap-8 w-full mt-2">
                      <FormField
                        control={form.control}
                        name="startMonth"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <Select onValueChange={field.onChange}>
                              <FormControl className="w-[110px] lg:w-[185px]">
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={
                                      secondaryEducation.startMonth
                                        ? secondaryEducation.startMonth
                                        : "Month"
                                    }
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="w-full overflow-y-scroll">
                                <SelectItem value="1">January</SelectItem>
                                <SelectItem value="2">February</SelectItem>
                                <SelectItem value="3">March</SelectItem>
                                <SelectItem value="4">April</SelectItem>
                                <SelectItem value="5">May</SelectItem>
                                <SelectItem value="6">June</SelectItem>
                                <SelectItem value="7">July</SelectItem>
                                <SelectItem value="8">August</SelectItem>
                                <SelectItem value="9">September</SelectItem>
                                <SelectItem value="10">October</SelectItem>
                                <SelectItem value="11">November</SelectItem>
                                <SelectItem value="12">December</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-500 font-normal text-base" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="startYear"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <Select onValueChange={field.onChange}>
                              <FormControl className="w-[110px] lg:w-[185px]">
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={
                                      secondaryEducation.startYear
                                        ? secondaryEducation.startYear
                                        : "Year"
                                    }
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="w-full max-h-[400px] overflow-y-scroll">
                                {Array.from({ length: 60 }, (_, i) => (
                                  <SelectItem
                                    key={i}
                                    value={`${new Date().getFullYear() - i}`}
                                  >
                                    {new Date().getFullYear() - i}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-500 font-normal text-base" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </dd>
                </div>

                <div className="py-3 sm:py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                  <dt className="font-medium text-base leading-6 text-gray-700">
                    End date
                  </dt>

                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                    <Label className="font-normal text-base">
                      Select the month and year when you left this secondary
                      school
                    </Label>
                    <div className="flex flex-row gap-4 xl:gap-8 w-full mt-2">
                      <FormField
                        control={form.control}
                        name="endMonth"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <Select onValueChange={field.onChange}>
                              <FormControl className="w-[110px] lg:w-[185px]">
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={
                                      secondaryEducation.endMonth
                                        ? secondaryEducation.endMonth
                                        : "Month"
                                    }
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="w-full overflow-y-scroll">
                                <SelectItem value="1">January</SelectItem>
                                <SelectItem value="2">February</SelectItem>
                                <SelectItem value="3">March</SelectItem>
                                <SelectItem value="4">April</SelectItem>
                                <SelectItem value="5">May</SelectItem>
                                <SelectItem value="6">June</SelectItem>
                                <SelectItem value="7">July</SelectItem>
                                <SelectItem value="8">August</SelectItem>
                                <SelectItem value="9">September</SelectItem>
                                <SelectItem value="10">October</SelectItem>
                                <SelectItem value="11">November</SelectItem>
                                <SelectItem value="12">December</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-500 font-normal text-base" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="endYear"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <Select onValueChange={field.onChange}>
                              <FormControl className="w-[110px] lg:w-[185px]">
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={
                                      secondaryEducation.endYear
                                        ? secondaryEducation.endYear
                                        : "Year"
                                    }
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="w-full max-h-[400px] overflow-y-scroll">
                                {Array.from({ length: 60 }, (_, i) => (
                                  <SelectItem
                                    key={i}
                                    value={`${new Date().getFullYear() - i}`}
                                  >
                                    {new Date().getFullYear() - i}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-red-500 font-normal text-base" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </dd>
                </div>

                <div className="py-3 sm:py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                  <dt className="font-medium text-base leading-6 text-gray-700">
                    Upload certificate(optional)
                  </dt>
                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                    <FormField
                      control={form.control}
                      name="certificateUpload"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-normal text-base">
                            Upload your compressed secondary school certificate in PDF format only.
                          </FormLabel>
                          <FormControl>
                            <CloudUpload
                              disabled={isLoading}
                              onChange={(url) => field.onChange(url)}
                              value={field.value ? field.value : ""}
                              onRemove={() => field.onChange("")}
                              accept="application/pdf"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-col gap-4 sm:flex-row mt-4 justify-start items-center">
                      <button
                        type="submit"
                        disabled={isLoading || isSubmitting || !isValid}
                        className="rounded-sm bg-primary text-primary-foreground font-normal lg:w-[200px] w-full py-3 flex items-center justify-center"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <Loader2 className="h-5 w-5 animate-spin" />
                          </span>
                        ) : (
                          <span>Update</span>
                        )}
                      </button>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={toggleEdit}
                          className="w-full lg:w-[200px] rounded-sm text-gray-900 py-3 flex items-center text-base font-normal justify-center border border-gray-200 bg-slate-300"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </form>
        </Form>
      ) : (
        <>
          <AvailableSecondaryCreated
            secondaryEducation={secondaryEducation}
            toggleEdit={toggleEdit}
          />
        </>
      )}
    </>
  );
};

export default EditSecondaryEducation;
