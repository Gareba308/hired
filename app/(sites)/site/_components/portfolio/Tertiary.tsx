import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { TertiaryEducation } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { counties, tertiaryResults } from "../data/create-job/CreateJobData";
import { CheckIcon, ChevronDown, Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Editor } from "@/components/Editor";
import CloudUpload from "@/components/CloudUpload";
import TertiaryEducationCreatedStart from "./created/TertiaryEducationCreatedStart";
import ReactQuill from "react-quill-new";
import { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

type FormSchemaType = z.infer<typeof formSchema>;

const maxCharacters = 300;
const nilCharacters = 0;

export const formSchema = z.object({
  institution: z.string().optional(),
  programArea: z.string().optional(),
  field: z.string().optional(),
  grade: z.string().optional(),
  county: z.string().optional(),
  startMonth: z.string().optional(),
  stillStudying: z.boolean().default(false).optional(),
  contactPersonName: z.string().optional(),
  contactPersonPosition: z.string().optional(),
  contactPersonEmail: z.string().optional(),
  startYear: z.string().optional(),
  endMonth: z.string().optional(),
  endYear: z.string().optional(),
  activities: z.string(),
  uploadCertificate: z.string().optional(),
});

interface TertiaryEducationProps {
  tertiaryEducation: TertiaryEducation[];
}

const Tertiary = ({ tertiaryEducation }: TertiaryEducationProps) => {
  const { toast } = useToast();
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [popoverOpen2, setPopoverOpen2] = useState<boolean>(false);
  const router = useRouter();
  const editorRef = useRef<ReactQuill | null>(null);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      institution: "",
      programArea: "",
      county: "",
      field: "",
      startMonth: "",
      stillStudying: false,
      startYear: "",
      endMonth: "",
      endYear: "",
      contactPersonEmail: "",
      contactPersonName: "",
      contactPersonPosition: "",
      activities: "",
      uploadCertificate: "",
      grade: "",
    },
  });

  const { control } = form;

  const text = useWatch({ control, name: "activities" }) || "";

  const cleanText = text.replace(/<[^>]*>/g, "");

  const remainingCharacters = maxCharacters - cleanText.length;

  const excessCharacters = nilCharacters - remainingCharacters;

  const { isSubmitting } = form.formState;

  const { mutate: createTertiaryEducation, isLoading } =
    trpc.workerCreateTertiaryEducation.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description:
            "Successfully submitted your tertiary education records.",
          variant: "default",
          duration: 3000,
        });
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
              "There was a problem submitting your tertiary education records",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const onSubmit = async (values: FormSchemaType) => {
    createTertiaryEducation({ ...values });
  };
  return (
    <>
      {tertiaryEducation.length !== 0 ? (
        <>
          <TertiaryEducationCreatedStart
            tertiaryEducation={tertiaryEducation}
          />
        </>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="font-normal pb-3">
              <div className="bg-slate-200 py-1.5 px-2.5 lg:px-3 border-b border-gray-200">
                <h2 className="font-semibold text-gray-600 text-lg text-center sm:text-start">
                  Create Tertiary Education Details
                </h2>
              </div>
              <dl className="divide-y divide-gray-100 lg:px-2.5 px-0.5">
                <div className="py-3 sm:py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                  <dt className="font-medium text-base leading-6 text-gray-700">
                    Name of school
                  </dt>

                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                    <FormField
                      control={form.control}
                      name="institution"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-normal text-base">
                            What&apos;s the name of the institution?
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Kenyatta University"
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
                    Programme of study
                  </dt>

                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                    <FormField
                      control={form.control}
                      name="programArea"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-normal text-base">
                            What&apos;s the programme of study?
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Bachelor of Science"
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
                    Field of study
                  </dt>

                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                    <FormField
                      control={form.control}
                      name="field"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-normal text-base">
                            What&apos;s the field of study?
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Computer Science"
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
                    Grade attained
                  </dt>

                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                    <FormField
                      control={form.control}
                      name="grade"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-normal text-base">
                            What grade did you attain in this level of study?
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
                                    "w-full sm:w-[400px] justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? tertiaryResults.find(
                                        (grade) => grade.value === field.value
                                      )?.label
                                    : "Select grade attained"}
                                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 max-h-[400px] overflow-y-scroll">
                              <Command>
                                <CommandInput placeholder="Search grade..." />
                                <CommandEmpty>No result found.</CommandEmpty>
                                <CommandGroup>
                                  {tertiaryResults.map((grade) => (
                                    <CommandItem
                                      value={grade.label}
                                      key={grade.value}
                                      onSelect={() => {
                                        form.setValue("grade", grade.value);
                                        setPopoverOpen2(false);
                                      }}
                                    >
                                      <CheckIcon
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          grade.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {grade.label}
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
                    Still studying
                  </dt>

                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                    <FormField
                      control={form.control}
                      name="stillStudying"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-normal text-base">
                            Are you still studying?
                          </FormLabel>
                          <div className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <Label className="font-normal">
                              I am still studying for this qualification
                            </Label>
                          </div>
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
                      Select the month and year when you joined this institution
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
                                  <SelectValue placeholder="Month" />
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
                                  <SelectValue placeholder="Year" />
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
                      Select the month and year when you left this institution
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
                                  <SelectValue placeholder="Month" />
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
                                  <SelectValue placeholder="Year" />
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
                    Contact person details
                  </dt>

                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                    <div className="mb-2 mt-3">
                      <Label className="text-base">
                        Details of contact person from the institution
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
                              placeholder="e.g. Prof. John Doe Smith"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
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
                              placeholder="e.g. Dean School of Public Health"
                              {...field}
                              disabled={isLoading}
                            />
                          </FormControl>
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
                            Official email
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. example@example.com"
                              type="email"
                              {...field}
                              disabled={isLoading}
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
                    Activities and involvements
                  </dt>

                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                    <FormField
                      control={form.control}
                      name="activities"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-normal text-base">
                            Write a summary of relevant(community or leadership)
                            activities you were(are) involved in, in this
                            institution.
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
                          <FormMessage className="text-red-500 font-normal text-base" />
                        </FormItem>
                      )}
                    />
                  </dd>
                </div>

                <div className="py-3 sm:py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
                  <dt className="font-medium text-base leading-6 text-gray-700">
                    Upload certificate
                  </dt>
                  <dd className="mt-1 leading-6 text-gray-700 sm:col-span-2 sm:mt-0 text-base">
                    <FormField
                      control={form.control}
                      name="uploadCertificate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-normal text-base">
                            Upload your compressed certificate(can merge with
                            transcripts)-PDF only
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
                        disabled={
                          isLoading || isSubmitting || remainingCharacters < 0
                        }
                        className={cn(
                          "rounded-sm sm:w-[200px] w-full bg-primary text-primary-foreground py-3 flex items-center justify-center",
                          isLoading || isSubmitting || remainingCharacters < 0
                            ? "opacity-50"
                            : ""
                        )}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <Loader2 className="h-5 w-5 animate-spin" />
                          </span>
                        ) : (
                          <span>Submit</span>
                        )}
                      </button>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

export default Tertiary;
