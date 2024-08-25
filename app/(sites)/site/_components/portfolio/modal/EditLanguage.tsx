import { trpc } from "@/app/_trpc/client";
import { Editor } from "@/components/Editor";
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
import { CheckIcon, ChevronDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Language } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { proficiencies } from "../../data/create-job/CreateJobData";
import { cn } from "@/lib/utils";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { useState } from "react";

type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  language: z.string().optional(),
  proficiency: z.string().optional(),
});

interface EditLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  language: Language;
}
const EditLanguageModal = ({
  isOpen,
  onClose,
  onConfirm,
  language,
}: EditLanguageModalProps) => {
  const { toast } = useToast();

  const router = useRouter();
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: language.language ? language.language : "",
      proficiency: language.proficiency ? language.proficiency : "",
    },
  });

  const { isSubmitting } = form.formState;

  const { mutate: updateLanguage, isLoading } =
    trpc.workerUpdateLanguage.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Successfully updated language detail",
          variant: "default",
          duration: 3000,
        });
        router.refresh();
        onConfirm();
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
              "There was a problem updating language details. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const onSubmit = async (values: FormSchemaType) => {
    updateLanguage({ ...values, languageID: language.id });
  };
  return (
    <Modal
      title="Update Language"
      description="Update details about the language"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="text-base">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="text-gray-700 text-base">
                  <FormLabel>Language:</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="English"
                      type="text"
                      required
                      disabled={isLoading || isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 font-normal text-base" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="proficiency"
              disabled={isLoading || isSubmitting}
              render={({ field }) => (
                <FormItem className="flex flex-col text-base mt-2.5">
                  <FormLabel>Proficiency</FormLabel>
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? proficiencies.find(
                                (proficiency) =>
                                  proficiency.value === field.value
                              )?.label
                            : "Select proficiency"}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 max-h-[500px] overflow-y-scroll">
                      <Command>
                        <CommandGroup>
                          {proficiencies.map((proficiency) => (
                            <CommandItem
                              value={proficiency.label}
                              key={proficiency.value}
                              onSelect={() => {
                                form.setValue("proficiency", proficiency.value);
                                setPopoverOpen(false);
                              }}
                            >
                              <CheckIcon
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  proficiency.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {proficiency.label}
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

            <div className="pt-4 space-x-4 flex items-center justify-start w-full">
              <Button
                disabled={isLoading || isSubmitting}
                size="lg"
                type="submit"
                className="rounded-sm bg-primary hover:bg-primary"
              >
                {isLoading ? (
                  <span className="items-center flex">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </span>
                ) : (
                  <>Update</>
                )}
              </Button>
              <Button
                disabled={isLoading || isSubmitting}
                onClick={onClose}
                type="button"
                size="lg"
                variant="secondary"
                className="border-gray-300 border bg-slate-200 rounded-sm"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};

export default EditLanguageModal;
