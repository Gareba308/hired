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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Experience } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { counties, job_types } from "../../data/create-job/CreateJobData";
import { CheckIcon, ChevronDown, Loader2, PenLine } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Editor } from "@/components/Editor";
import { useRef, useState } from "react";
import NewExperienceCreated from "../created/NewExperienceCreated";
import ReactQuill from "react-quill-new";

type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  position: z.string().optional(),
  employmentType: z.string().optional(),
  nameCompany: z.string().optional(),
  location: z.string().optional(),
  stillWorking: z.boolean().default(false).optional(),
  startMonth: z.string().optional(),
  startYear: z.string().optional(),
  endMonth: z.string().optional(),
  endYear: z.string().optional(),
  description: z.string(),
  contactPersonName: z.string().optional(),
  contactPersonPosition: z.string().optional(),
  contactPersonEmail: z.string().optional(),
});

interface ExperienceProps {
  experienceDetails: Experience;
  toggleView: (selectedExperienceId: string) => void;
}
const maxCharacters = 400;
const nilCharacters = 0;

const ExperienceEdit = ({ experienceDetails, toggleView }: ExperienceProps) => {
  const { toast } = useToast();
  const editorRef = useRef<ReactQuill | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [popoverOpen2, setPopoverOpen2] = useState<boolean>(false);
  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      position: experienceDetails.position ? experienceDetails.position : "",
      employmentType: experienceDetails.employmentType
        ? experienceDetails.employmentType
        : "",
      nameCompany: experienceDetails.nameCompany
        ? experienceDetails.nameCompany
        : "",
      location: experienceDetails.location ? experienceDetails.location : "",
      stillWorking: experienceDetails.stillWorking
        ? experienceDetails.stillWorking
        : false,
      description: experienceDetails.description
        ? experienceDetails.description
        : "",
      contactPersonEmail: experienceDetails.contactPersonEmail
        ? experienceDetails.contactPersonEmail
        : "",
      contactPersonName: experienceDetails.contactPersonName
        ? experienceDetails.contactPersonName
        : "",
      contactPersonPosition: experienceDetails.contactPersonPosition
        ? experienceDetails.contactPersonPosition
        : "",
    },
  });
  const { control } = form;

  const text = useWatch({ control, name: "description" }) || "";
  const stillWorkingValue = useWatch({control, name: "stillWorking"})
  const notStillWorking= stillWorkingValue === false

  const cleanText = text.replace(/<[^>]*>/g, "");

  const remainingCharacters = maxCharacters - cleanText.length;

  const excessCharacters = nilCharacters - remainingCharacters;
  const { isSubmitting, isValid } = form.formState;

  const { mutate: updateExperience, isLoading } =
    trpc.workerUpdateExperience.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Successfully updated your experience details",
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
            duration: 3000,
          });
        } else {
          toast({
            title: "Something went wrong",
            description:
              "There was a problem submitting your experience details. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const onSubmit = async (values: FormSchemaType) => {
    updateExperience({ ...values, experienceID: experienceDetails.id });
  };
  return (
    <>
      {isEditing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="font-normal">
              <div className=" flex items-center justify-between">
                <h2 className="font-bold text-gray-600 text-xl sm:text-2xl">
                  Edit Experience
                </h2>
              </div>
              <p className="text-gray-600">
                Fill in required details to create this section of your
                portfolio, to help recruiters know you better. We will keep all
                sensitive information private. User profile helps employer know
                who you are.
              </p>
              <dl className="border divide-y divide-gray-100 border-gray-200 px-2.5 sm:px-4 rounded-lg mt-4">
                <div className="py-2 lg:py-4 pb-5 lg:px-3 lg:gap-4  lg:grid lg:grid-cols-3 text-gray-700">
                  <dt className="font-medium text-lg leading-6 text-gray-700">
                    Job position
                  </dt>

                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-normal text-base">
                            What&apos;s title of job position you have held or
                            you are currently holding?
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Data Analyst"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage className="text-red-500 font-normal text-base" />
                        </FormItem>
                      )}
                    />
                  </dd>
                </div>

                <div className="py-2 lg:py-4 pb-5 lg:px-3 lg:gap-4  lg:grid lg:grid-cols-3 text-gray-700">
                  <dt className="font-medium text-lg leading-6 text-gray-700">
                    Employment type
                  </dt>

                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                    <FormField
                      control={form.control}
                      name="employmentType"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-normal text-base">
                            What&apos;s the employment type of the job position?
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
                                    "w-full xl:w-[400px] justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? job_types.find(
                                        (job_type) =>
                                          job_type.value === field.value
                                      )?.label
                                    : "Select job type"}
                                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 max-h-[500px] overflow-y-scroll">
                              <Command>
                                <CommandGroup>
                                  {job_types
                                    .sort((a, b) =>
                                      a.label.localeCompare(b.label)
                                    )
                                    .map((job_type) => (
                                      <CommandItem
                                        value={job_type.label}
                                        key={job_type.value}
                                        onSelect={() => {
                                          form.setValue(
                                            "employmentType",
                                            job_type.value
                                          );
                                          setPopoverOpen(false);
                                        }}
                                      >
                                        <CheckIcon
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            job_type.value === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {job_type.label}
                                      </CommandItem>
                                    ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormDescription></FormDescription>
                          <FormMessage className="text-red-500 font-normal text-base" />
                        </FormItem>
                      )}
                    />
                  </dd>
                </div>

                <div className="py-2 lg:py-4 pb-5 lg:px-3 lg:gap-4  lg:grid lg:grid-cols-3 text-gray-700">
                  <dt className="font-medium text-lg leading-6 text-gray-700">
                    Name of company
                  </dt>

                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                    <FormField
                      control={form.control}
                      name="nameCompany"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-normal text-base">
                            What&apos;s the name of the company/organization?
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Jobs Radar Kenya"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage className="text-red-500 font-normal text-base" />
                        </FormItem>
                      )}
                    />
                  </dd>
                </div>

                <div className="py-2 lg:py-4 pb-5 lg:px-3 lg:gap-4  lg:grid lg:grid-cols-3 text-gray-700">
                  <dt className="font-medium text-lg leading-6 text-gray-700">
                    County of location
                  </dt>

                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-normal text-base">
                            In which county is the company located?
                          </FormLabel>
                          <Popover
                            open={popoverOpen2}
                            onOpenChange={setPopoverOpen2}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full xl:w-[400px] justify-between",
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
                                          form.setValue(
                                            "location",
                                            county.value
                                          );
                                          setPopoverOpen2(false);
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
                          <FormMessage className="text-red-500 font-normal text-base" />
                        </FormItem>
                      )}
                    />
                  </dd>
                </div>

                <div className="py-2 lg:py-4 pb-5 lg:px-3 lg:gap-4  lg:grid lg:grid-cols-3 text-gray-700">
                  <dt className="font-medium text-lg leading-6 text-gray-700">
                    Currently working
                  </dt>

                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                    <FormField
                      control={form.control}
                      name="stillWorking"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-normal text-base">
                            Are you still working in this job position and in
                            this company?
                          </FormLabel>
                          <div className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <Label className="font-normal">
                              I am currently working in this role
                            </Label>
                          </div>
                          <FormDescription></FormDescription>
                          <FormMessage className="text-red-500 font-normal text-base" />
                        </FormItem>
                      )}
                    />
                  </dd>
                </div>

                <div className="py-2 lg:py-4 pb-5 lg:px-3 lg:gap-4  lg:grid lg:grid-cols-3 text-gray-700">
                  <dt className="font-medium text-lg leading-6 text-gray-700">
                    Start date
                  </dt>

                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                    <Label className="font-normal text-base">
                      Select the month and year when you started working in this
                      role
                    </Label>
                    <div className="flex flex-row gap-4 xl:gap-8 w-full mt-3">
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
                                      experienceDetails.startMonth
                                        ? experienceDetails.startMonth
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
                            <FormDescription></FormDescription>
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
                                      experienceDetails.startYear
                                        ? experienceDetails.startYear
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
                            <FormDescription></FormDescription>
                            <FormMessage className="text-red-500 font-normal text-base" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </dd>
                </div>

                {notStillWorking && <div className="py-2 lg:py-4 pb-5 lg:px-3 lg:gap-4  lg:grid lg:grid-cols-3 text-gray-700">
                  <dt className="font-medium text-lg leading-6 text-gray-700">
                    End date
                  </dt>

                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                    <Label className="font-normal text-base">
                      Select the month and year when you stopped working in this
                      role
                    </Label>
                    <div className="flex flex-row gap-4 xl:gap-8 w-full mt-3">
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
                                      experienceDetails.endMonth ? (
                                        experienceDetails.endMonth
                                      ) : (
                                        <>Month</>
                                      )
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
                            <FormDescription></FormDescription>
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
                                      experienceDetails.endYear ? (
                                        experienceDetails.endYear
                                      ) : (
                                        <>Year</>
                                      )
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
                            <FormDescription></FormDescription>
                            <FormMessage className="text-red-500 font-normal text-base" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </dd>
                </div>}

                <div className="py-2 lg:py-4 pb-5 lg:px-3 lg:gap-4  lg:grid lg:grid-cols-3 text-gray-700">
                  <dt className="font-medium text-lg leading-6 text-gray-700">
                    Contact person details
                  </dt>

                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                    <div className="mb-2 mt-3">
                      <Label className="text-base">
                        Details of contact person from the company
                      </Label>
                    </div>
                    <FormField
                      control={form.control}
                      name="contactPersonName"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-normal text-base">
                            Full name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. John Doe Smith"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage className="text-red-500 font-normal text-base" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactPersonPosition"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-normal text-base mt-3">
                            Position
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Human Resource Representative"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage className="text-red-500 font-normal text-base" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactPersonEmail"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-normal text-base mt-3">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. example@example.com"
                              type="email"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage className="text-red-500 font-normal text-base" />
                        </FormItem>
                      )}
                    />
                  </dd>
                </div>

                <div className="py-2 lg:py-4 pb-5 lg:px-3 lg:gap-4  lg:grid lg:grid-cols-3 text-gray-700">
                  <dt className="font-medium text-lg leading-6 text-gray-700">
                    Role description
                  </dt>

                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-normal text-base">
                            Briefly describe what your role involves(involved)
                            and possible achievements.
                          </FormLabel>
                          <Label className="text-base font-normal flex">
                            {remainingCharacters >= 0 ? (
                              <p className="-mt-1.5">
                                Max Characters Left:{" "}
                                <b className="text-gray-700">
                                  {remainingCharacters}/{maxCharacters}
                                </b>
                              </p>
                            ) : (
                              <div className="-mt-1.5">
                                <p className="text-red-600">
                                  You have reached maximum characters
                                </p>
                                <p className="-mt-0.5">
                                  Excess Characters:{" "}
                                  <b className="text-red-600">
                                    {excessCharacters}
                                  </b>
                                </p>
                              </div>
                            )}
                          </Label>
                          <FormControl>
                            <Editor
                              {...field}
                              ref={(editor) => (editorRef.current = editor)}
                            />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage className="text-red-500 font-normal text-base" />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-col gap-4 sm:flex-row mt-4 justify-start items-center">
                      <button
                        type="submit"
                        disabled={
                          isLoading || isSubmitting || remainingCharacters < 0
                        }
                        className={cn(
                          "rounded-sm w-full lg:w-[200px] bg-primary text-primary-foreground py-3 flex items-center justify-center",
                          isLoading || isSubmitting || remainingCharacters < 0
                            ? "rounded-sm w-full lg:w-[200px] bg-primary opacity-50 text-primary-foreground py-3 flex items-center justify-center"
                            : ""
                        )}
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
                          disabled={isLoading || isSubmitting}
                          className="w-full rounded-sm lg:w-[200px] text-gray-900 py-3 flex items-center text-base font-normal justify-center border border-gray-200 bg-slate-300"
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
        <NewExperienceCreated
          experienceDetails={experienceDetails}
          toggleView={toggleView}
          toggleEdit={toggleEdit}
        />
      )}
    </>
  );
};

export default ExperienceEdit;
