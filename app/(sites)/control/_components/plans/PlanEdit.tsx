"use client";

import { EmployerPlans } from "@prisma/client";
import { CornerUpLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
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

interface PlanEditProps {
  plan: EmployerPlans;
}
type FormSchemaType = z.infer<typeof formSchema>;

export const formSchema = z.object({
  name: z.string().optional(),
  price: z.number().optional(),
  unit: z.number().optional(),
  feature1: z.string().optional(),
  feature2: z.string().optional(),
  feature3: z.string().optional(),
  feature4: z.string().optional(),
  feature5: z.string().optional(),
  feature6: z.string().optional(),
  forJobs: z.boolean().optional(),
});
const PlanEdit = ({ plan }: PlanEditProps) => {
  const searchParams = useSearchParams();
  const origin = searchParams?.get("origin");

  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: plan.name ? plan.name : "",
      price: plan.price ? plan.price : 0,
      unit: plan.unit ? plan.unit : 0,
      feature1: plan.feature1 ? plan.feature1 : "",
      feature2: plan.feature2 ? plan.feature2 : "",
      feature3: plan.feature3 ? plan.feature3 : "",
      feature4: plan.feature4 ? plan.feature4 : "",
      feature5: plan.feature5 ? plan.feature5 : "",
      feature6: plan.feature6 ? plan.feature6 : "",
      forJobs: plan.forJobs,
    },
  });

  const { mutate: updatePlan, isLoading } =
    trpc.adminEditEmployerPlans.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You have successfully updated this pricing plan",
          variant: "default",
          duration: 3000,
        });
        router.push("/control/plans");
        router.refresh();
      },
      onError: (err) => {
        toast({
          title: "Something went wrong",
          description: err.message
            ? err.message
            : "There was a problem updating this plan",
          variant: "destructive",
          duration: 3000,
        });
      },
    });

  const onSubmit = (values: FormSchemaType) => {
    updatePlan({ ...values, planID: plan.id });
  };
  return (
    <div>
      <div className="flex items-center flex-row mb-2">
        <Link
          href={origin ? `/${origin}` : "/control/plans"}
          className="hover:text-[#005580]"
        >
          <CornerUpLeft className="h-6 w-6 mr-2.5" />
        </Link>
        <h3 className="font-bold text-gray-600 tracking-tight text-2xl sm:text-3xl">
          Plan Settings
        </h3>
      </div>

      <fieldset className=" border border-gray-200 rounded-lg px-2.5 lg:px-3">
        <legend className="text-lg sm:text-xl font-semibold text-gray-600">
          Edit Plan
        </legend>

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
                          Give this plan an estimated cost that employers have
                          to pay?
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
                          How many units does this plan give per the stated
                          price?
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
                        <span>Update Plan</span>
                      )}
                    </button>
                  </div>
                </dd>
              </div>
            </dl>
          </form>
        </Form>
      </fieldset>
    </div>
  );
};

export default PlanEdit;
