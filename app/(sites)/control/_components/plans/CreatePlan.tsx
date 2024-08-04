"use client";

import { trpc } from "@/app/_trpc/client";
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
import { GripVertical, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  name: z.string(),
  price: z.number(),
  unit: z.number(),
  feature1: z.string(),
  feature2: z.string(),
  feature3: z.string(),
  feature4: z.string(),
  feature5: z.string(),
  feature6: z.string(),
  forJobs: z.boolean().default(true),
});

const CreatePlan = () => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      unit: 0,
      feature1: "",
      feature2: "",
      feature3: "",
      feature4: "",
      feature5: "",
      feature6: "",
      forJobs: true,
    },
  });

  const { mutate: createPlan, isLoading } =
    trpc.adminCreateEmployerPlans.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You have successfully created a pricing plan",
          variant: "default",
          duration: 3000,
        });
        router.refresh();
        form.reset();
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
            description: "There was a problem creating a pricing plan",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const onSubmit = (values: FormSchemaType) => {
    createPlan({ ...values });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <dl className="divide-y divide-gray-100">
          <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
            <dt className="font-medium text-base text-gray-700">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Plan Name
                  <span className="text-lg font-normal pl-0.5 text-red-600">
                    *
                  </span>
                </span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <FormField
                control={form.control}
                disabled={isLoading}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      What is the name for the plan you are creating?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex. Basic Plan"
                        disabled={isLoading}
                        {...field}
                        type="text"
                        maxLength={16}
                        required
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage className="text-red-500 font-normal text-sm" />
                  </FormItem>
                )}
              />
            </dd>
          </div>

          <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
            <dt className="font-medium text-base text-gray-700">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Plan Price{" "}
                  <span className="text-lg font-normal pl-0.5 text-red-600">
                    *
                  </span>
                </span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <FormField
                control={form.control}
                disabled={isLoading}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      Give this plan an estimated cost that employers have to
                      pay?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex. 1500"
                        disabled={isLoading}
                        {...field}
                        type="number"
                        required
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage className="text-red-500 font-normal text-sm" />
                  </FormItem>
                )}
              />
            </dd>
          </div>

          <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
            <dt className="font-medium text-base text-gray-700">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Plan Units{" "}
                  <span className="text-lg font-normal pl-0.5 text-red-600">
                    *
                  </span>
                </span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <FormField
                control={form.control}
                disabled={isLoading}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      How many units does this plan give per the stated price?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex. 2"
                        disabled={isLoading}
                        {...field}
                        type="number"
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                        required
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage className="text-red-500 font-normal text-sm" />
                  </FormItem>
                )}
              />
            </dd>
          </div>

          <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
            <dt className="font-medium text-base text-gray-700">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Plan Feature 1{" "}
                  <span className="text-lg font-normal pl-0.5 text-red-600">
                    *
                  </span>
                </span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <FormField
                control={form.control}
                disabled={isLoading}
                name="feature1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      What is the first feature of this plan?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex. 30 days publication"
                        disabled={isLoading}
                        {...field}
                        type="text"
                        maxLength={30}
                        required
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage className="text-red-500 font-normal text-sm" />
                  </FormItem>
                )}
              />
            </dd>
          </div>
          <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
            <dt className="font-medium text-base text-gray-700">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Plan Feature 2{" "}
                  <span className="text-lg font-normal pl-0.5 text-red-600">
                    *
                  </span>
                </span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <FormField
                control={form.control}
                disabled={isLoading}
                name="feature2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      What is the second feature of this plan?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex. 30 days publication"
                        disabled={isLoading}
                        {...field}
                        type="text"
                        maxLength={30}
                        required
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage className="text-red-500 font-normal text-sm" />
                  </FormItem>
                )}
              />
            </dd>
          </div>
          <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
            <dt className="font-medium text-base text-gray-700">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Plan Feature 3{" "}
                  <span className="text-lg font-normal pl-0.5 text-red-600">
                    *
                  </span>
                </span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <FormField
                control={form.control}
                disabled={isLoading}
                name="feature3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      What is the third feature of this plan?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex. 30 days publication"
                        disabled={isLoading}
                        {...field}
                        type="text"
                        maxLength={30}
                        required
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage className="text-red-500 font-normal text-sm" />
                  </FormItem>
                )}
              />
            </dd>
          </div>
          <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
            <dt className="font-medium text-base text-gray-700">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Plan Feature 4{" "}
                  <span className="text-lg font-normal pl-0.5 text-red-600">
                    *
                  </span>
                </span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <FormField
                control={form.control}
                disabled={isLoading}
                name="feature4"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      What is the fourth feature of this plan?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex. 30 days publication"
                        disabled={isLoading}
                        {...field}
                        type="text"
                        maxLength={30}
                        required
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage className="text-red-500 font-normal text-sm" />
                  </FormItem>
                )}
              />
            </dd>
          </div>
          <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
            <dt className="font-medium text-base text-gray-700">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Plan Feature 5{" "}
                  <span className="text-lg font-normal pl-0.5 text-red-600">
                    *
                  </span>
                </span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <FormField
                control={form.control}
                disabled={isLoading}
                name="feature5"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      What is the fifth feature of this plan?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex. 30 days publication"
                        disabled={isLoading}
                        {...field}
                        type="text"
                        maxLength={30}
                        required
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage className="text-red-500 font-normal text-sm" />
                  </FormItem>
                )}
              />
            </dd>
          </div>
          <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
            <dt className="font-medium text-base text-gray-700">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Plan Feature 6
                  <span className="text-lg font-normal pl-0.5 text-red-600">
                    *
                  </span>
                </span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <FormField
                control={form.control}
                disabled={isLoading}
                name="feature6"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal text-base text-gray-700">
                      What is the sixth feature of this plan?
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex. 30 days publication"
                        disabled={isLoading}
                        {...field}
                        type="text"
                        maxLength={30}
                        required
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage className="text-red-500 font-normal text-sm" />
                  </FormItem>
                )}
              />
            </dd>
          </div>

          <div className="py-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0">
            <dt className="font-medium text-base text-gray-700">
              <div className="flex items-center flex-row">
                <GripVertical className="h-4 w-4 mr-0.5 text-gray-500" />
                <span className="flex items-center">
                  Display Section
                  <span className="text-lg font-normal pl-0.5 text-red-600">
                    *
                  </span>
                </span>
              </div>
            </dt>
            <dd className="mt-1 leading-6 text-gray-700 lg:col-span-2 lg:mt-0 text-base">
              <FormField
                control={form.control}
                name="forJobs"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between w-full gap-x-4">
                    <div>
                      <FormLabel className="text-base">
                        Keep this plan in the job pricing section?
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-4 sm:flex-row mt-6 justify-start items-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "rounded-sm w-full text-base sm:w-[250px] hover:opacity-90 bg-primary text-primary-foreground py-4 flex items-center justify-center",
                    isLoading
                      ? "rounded-sm w-full sm:w-[250px] bg-primary opacity-50 text-primary-foreground py-4 flex items-center justify-center"
                      : ""
                  )}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </span>
                  ) : (
                    <span>Submit Plan</span>
                  )}
                </button>
              </div>
            </dd>
          </div>
        </dl>
      </form>
    </Form>
  );
};

export default CreatePlan;
