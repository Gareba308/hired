"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Card} from "@/components/ui/card";
import { ArrowRight, Loader2, ChevronDown, CheckIcon } from "lucide-react";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { AssessmentBanner } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

type FormSchemaType = z.infer<typeof formSchema>;
export const formSchema = z.object({
  demoID: z.string(),
  category: z.string(),
});
interface AcceptAssessmentAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  banners: AssessmentBanner[];
}

export const EmployerAcceptAssessmentAlertModal: React.FC<
  AcceptAssessmentAlertProps
> = ({ isOpen, onClose, onConfirm, banners }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [popoverOpen1, setPopoverOpen1] = useState<boolean>(false);
  const [popoverOpen2, setPopoverOpen2] = useState<boolean>(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });
  const { mutate: acceptAssessment, isLoading } =
    trpc.employerAcceptAssessment.useMutation({
      onSuccess: (results) => {
        const demoID = results.demoID;
        toast({
          title: "Proceeding to the demo",
          description: "We are redirecting you to the assessment demo",
          variant: "default",
          duration: 3000,
        });
        onConfirm();
        form.reset();
        router.push(`/manage/assessments/${demoID}`);
      },
      onError: (err) => {
        if (err) {
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
              "There was a problem setting up your assessment demo details. Try again later",
            variant: "destructive",
            duration: 3000,
          });
        }
        form.reset();
      },
    });

  const onSubmit = (values: FormSchemaType) => {
    acceptAssessment({ ...values });
  };

  const uniqueCategories = Array.from(
    new Set(banners.map((banner) => banner.category))
  );

  const selectedCategory = form.watch("category");
  const filteredBanners = banners.filter(
    (banner) => banner.category === selectedCategory
  );

  return (
    <Modal
      title="Pick category & demo"
      description="From the selection options, choose a category and demo to see how the assessment is conducted."
      isOpen={isOpen}
      onClose={onClose}
    >
      <Card className="w-full -mt-1.5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-3">
            <div className="text-sm text-gray-700">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-normal text-base text-gray-700">
                      Select a demo category
                      <span className="text-xs text-gray-600">
                        (e.g., Healthcare)
                      </span>
                    </FormLabel>
                    <Popover open={popoverOpen1} onOpenChange={setPopoverOpen1} >
                      <PopoverTrigger asChild className="-mt-1">
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
                            {field.value || "---Select a demo category---"}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 max-h-[400px] overflow-y-scroll">
                        <Command>
                          <CommandInput placeholder="Search for category..." />
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            {uniqueCategories
                              .sort((a, b) => a.localeCompare(b))
                              .map((category) => (
                                <CommandItem
                                  value={category}
                                  key={category}
                                  onSelect={() => {
                                    form.setValue("category", category);
                                    form.setValue("demoID", "");
                                    setPopoverOpen1(false);
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      category === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {category}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-red-500 font-normal text-sm" />
                  </FormItem>
                )}
              />
            </div>
            <div className="text-sm text-gray-700 mt-3">
              <FormField
                disabled={!selectedCategory || isLoading}
                control={form.control}
                name="demoID"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-normal text-base text-gray-700">
                      Select an assessment demo name
                    </FormLabel>
                    <Popover open={popoverOpen2} onOpenChange={setPopoverOpen2}>
                      <PopoverTrigger asChild className="-mt-1">
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            disabled={!selectedCategory || isLoading}
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? banners.find(
                                  (banner) => banner.id === field.value
                                )?.name
                              : "---Select an assessment demo---"}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 max-h-[400px] overflow-y-scroll">
                        <Command>
                          <CommandInput placeholder="Search for demo..." />
                          <CommandEmpty>No demo found.</CommandEmpty>
                          <CommandGroup>
                            {filteredBanners
                              .sort((a, b) => a.name!.localeCompare(b.name!))
                              .map((banner) => (
                                <CommandItem
                                  value={banner.id}
                                  key={banner.id}
                                  onSelect={() => {
                                    form.setValue("demoID", banner.id);
                                    setPopoverOpen2(false);
                                  }}
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      banner.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {banner.name}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {!selectedCategory && (
                      <FormDescription className="text-xs">
                        This has been disabled until you select category.
                      </FormDescription>
                    )}
                    <FormMessage className="text-red-500 font-normal text-sm" />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-6 space-x-2 flex items-center justify-end w-full">
              <Button
                variant="outline"
                className="rounded-sm bg-slate-200 border border-gray-200"
                size="lg"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                size="lg"
                variant="default"
                type="submit"
                className="hover:bg-primary text-base font-normal hover:opacity-90 border border-slate-200"
              >
                Proceed
                {isLoading ? (
                  <Loader2 className="h-4 w-4 shrink-0 ml-1.5 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4 shrink-0 ml-1.5" />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </Modal>
  );
};
