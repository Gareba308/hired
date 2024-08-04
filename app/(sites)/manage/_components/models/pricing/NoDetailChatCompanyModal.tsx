import { trpc } from "@/app/_trpc/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import { User } from "@prisma/client";
import { Input } from "@/components/ui/input";

type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  fullName: z.string(),
  priority: z.string(),
  subject: z.string(),
  message: z
    .string()
    .min(1, { message: "This section can not be left empty" })
    .max(600, { message: "The maximum characters can only be 600" }),
});
const maxCharacters = 600;
interface MessageAdminPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User;
}
const MessageAdminPricingModal = ({
  isOpen,
  onClose,
  onConfirm,
  user,
}: MessageAdminPricingModalProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      priority: "",
      subject: "",
      message: "",
    },
  });

  const { control } = form;
  const text = useWatch({ control, name: "message" }) || "";

  const remainingCharacters = maxCharacters - text.length;
  const { isSubmitting } = form.formState;

  const { mutate: createHelp, isLoading } = trpc.employerHelp.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description:
          "Your help message has been submitted. We will get back to you as soon as possible.",
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
            "There was a problem submitting your help message, please try again later",
          variant: "destructive",
          duration: 3000,
        });
      }
    },
  });

  const submitHelp = (values: FormSchemaType) => {
    createHelp({ ...values });
  };
  return (
    <Modal
      title="Start a new conversation?"
      description="Message that concerns the pricing or request custom pricing."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="-mt-4">
        <fieldset className="grid rounded-lg border border-slate-300 px-4 py-3">
          <legend className="-ml-1 px-1 text-lg text-gray-700 font-medium">
            Compose New Message
          </legend>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submitHelp)}>
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="text-gray-700 -mt-2 text-base space-y-0">
                    <FormLabel className="text-gray-600 text-base">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        required
                        disabled={isLoading || isSubmitting}
                        placeholder="E.g. John Doe"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 font-normal text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="text-gray-700 text-base flex flex-col mt-4 space-y-0">
                    <FormLabel className="text-gray-600 text-base">
                      Priority
                    </FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl className="w-full">
                        <SelectTrigger disabled={isLoading || isSubmitting}>
                          <SelectValue
                            className="text-gray-400"
                            placeholder="---Select priority---"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-full text-gray-600">
                        <SelectItem value="High">High Priority</SelectItem>
                        <SelectItem value="Medium">Medium Priority</SelectItem>
                        <SelectItem value="Normal">Normal Priority</SelectItem>
                        <SelectItem value="Low">Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500 font-normal text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem className="text-gray-700 text-base mt-4 space-y-0">
                    <FormLabel className="text-gray-600 text-base">
                      Subject
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        required
                        disabled={isLoading || isSubmitting}
                        placeholder="E.g. Job Application Error"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 font-normal text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="text-gray-700 text-base mt-4 space-y-0">
                    <div className="flex flex-col">
                      <FormLabel className="text-gray-700 text-base">
                        Message
                      </FormLabel>
                      <Label className="font-normal mt-0.5 mb-0.5">
                        Max Characters: {remainingCharacters}
                      </Label>
                    </div>
                    <FormControl>
                      <Textarea
                        {...field}
                        required
                        className="resize-none"
                        disabled={isLoading || isSubmitting}
                        placeholder="Write your message here..."
                        minRows={3}
                        maxRows={4}
                        maxLength={maxCharacters}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 font-normal text-sm">
                      {remainingCharacters <= 0 && (
                        <>You have reached maximum characters length.</>
                      )}
                    </FormMessage>
                  </FormItem>
                )}
              />

              <Button
                className="mt-6 rounded-sm w-full font-normal flex items-center shrink-0 hover:bg-primary hover:opacity-90"
                variant="default"
                type="submit"
                disabled={isLoading || isSubmitting || remainingCharacters <= 0}
                size="lg"
              >
                {isLoading || isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Send Message <Send className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </fieldset>
      </div>
    </Modal>
  );
};

export default MessageAdminPricingModal;
