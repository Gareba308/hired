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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { proficiencies } from "../../data/create-job/CreateJobData";
import { cn } from "@/lib/utils";
import { useState } from "react";

type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  language: z.string(),
  proficiency: z.string().optional(),
});

interface AddLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
const AddLanguageModal = ({
  isOpen,
  onClose,
  onConfirm,
}: AddLanguageModalProps) => {
  const { toast } = useToast();

  const router = useRouter();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: "",
      proficiency: "",
    },
  });

  const { isSubmitting } = form.formState;
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const { mutate: createLanguage, isLoading } =
    trpc.workerCreateLanguage.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Successfully added a new language details",
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
              "There was a problem submitting your language details. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const onSubmit = async (values: FormSchemaType) => {
    createLanguage({ ...values });
  };
  return (
    <Modal
      title="Add Language"
      description="Add details about languages all dependent on your proficiency"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="text-base">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="w-full">
              <FormField
                control={form.control}
                name="language"
                disabled={isLoading || isSubmitting}
                render={({ field }) => (
                  <FormItem className="text-gray-700 text-base">
                    <FormLabel>Language:</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="English"
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
                                  form.setValue(
                                    "proficiency",
                                    proficiency.value
                                  );
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
            </div>
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
                  <>Submit</>
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

export default AddLanguageModal;
