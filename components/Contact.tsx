"use client";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import * as z from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import Footer from "./Footer";

type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  fullName: z.string(),
  email: z.string(),
  subject: z.string(),
  message: z
    .string()
    .min(1, { message: "This section can not be left empty" })
    .max(600, { message: "The maximum characters can only be 600" }),
});

const maxCharacters = 600;

export default function Contact() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const { control } = form;
  const text = useWatch({ control, name: "message" }) || "";

  const remainingCharacters = maxCharacters - text.length;
  const { isSubmitting } = form.formState;

  const { mutate: createHelp, isLoading } = trpc.homepageContact.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description:
          "Your contact message has been submitted. We will get back to you as soon as possible.",
        variant: "default",
        duration: 3000,
      });
      form.reset();
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
            "There was a problem submitting your contact message, please try again later",
          variant: "destructive",
          duration: 3000,
        });
      }
    },
  });

  const submitHelp = (values: FormSchemaType) => {
    createHelp({ ...values });
  };
  const contactMethods = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          />
        </svg>
      ),
      contact: "help@hired.co.ke",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
          />
        </svg>
      ),
      contact: "+254 738 169 151",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
      ),
      contact: "Parklands, Nairobi, Kenya.",
    },
  ];

  return (
    <>
      <div className="px-4 md:px-8 pb-10 pt-4 sm:pt-6 max-w-screen-xl min-h-[calc(100vh-70px)] mx-auto text-sm sm:text-[15px] text-gray-700">
        <div className="flex w-full items-center justify-between">
          <h3 className="font-bold text-gray-700 hover:cursor-pointer text-3xl sm:text-4xl">
            Contact Us
          </h3>
        </div>
        <div className="w-full mx-auto gap-4 sm:gap-6 lg:gap-8 pt-4 justify-between grid lg:grid-cols-2">
          <div className="max-w-2xl space-y-3 w-full">
            <p className="text-gray-600 text-xl font-medium sm:text-xl">
              Let us know how we can help
            </p>
            <p className="text-base font-normal text-gray-600">
              We&apos;re here to help and answer any question you might have, We
              look forward to hearing from you! Please fill out the form, or use
              the contact information below.
            </p>
            <p className="text-base font-normal text-gray-600">
              For more information, you may also visit our{" "}
              <span className="text-gray-600 font-medium">FAQs</span> section to
              explore answers to commonly asked questions.
            </p>
            <div>
              <ul className="mt-6 flex flex-wrap text-gray-600 gap-x-6 gap-y-4 items-center">
                {contactMethods.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-x-1.5">
                    <div className="flex-none text-gray-400">{item.icon}</div>
                    <p className="text-base sm:text-lg">{item.contact}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-base font-normal text-gray-600">
                We are committed to providing you with timely feedback.
                Typically, you can expect a response within 4 hours.
              </p>
            </div>
          </div>
          <div className="flex-1 w-full">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submitHelp)}>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="text-gray-700 text-base space-y-0">
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
                  name="email"
                  render={({ field }) => (
                    <FormItem className="text-gray-700 text-base flex flex-col mt-4 space-y-0">
                      <FormLabel className="text-gray-600 text-base">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          required
                          disabled={isLoading || isSubmitting}
                          placeholder="E.g. example@example.com"
                        />
                      </FormControl>
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
                          placeholder="E.g. Sign Up Error"
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
                          minRows={5}
                          rows={5}
                          disabled={isLoading || isSubmitting}
                          placeholder="Write your message here..."
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
                  disabled={
                    isLoading || isSubmitting || remainingCharacters <= 0
                  }
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
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
