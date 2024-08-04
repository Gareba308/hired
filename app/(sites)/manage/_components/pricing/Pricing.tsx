"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import TopUpAlertModal from "../models/pricing/TopUp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wallet } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import MessageAdminPricingModal from "../models/pricing/NoDetailChatCompanyModal";
import { AccountBalance, EmployerPlans, User } from "@prisma/client";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import NewTopUpAlertModal from "../models/pricing/NewTopUp";

interface PricingProps {
  user: User;
  account: AccountBalance;
  plans: EmployerPlans[];
}

const Pricing = ({ user, account, plans }: PricingProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const [topUpOpen, setTopUpOpen] = useState<boolean>(false);
  const topUpClose = () => {
    setTopUpOpen((prev) => !prev);
  };

  const topUpConfirm = () => {
    setTopUpOpen((prev) => !prev);
  };

  const toggleTopUp = () => {
    setTopUpOpen(true);
  };

  const [messageOpen, setMessageOpen] = useState<boolean>(false);
  const messageClose = () => {
    setMessageOpen((prev) => !prev);
  };

  const messageConfirm = () => {
    setMessageOpen((prev) => !prev);
  };

  const toggleMessage = () => {
    setMessageOpen(true);
  };

  const [currentlyPurchasingPlanID, setCurrentlyPurchasingPlanID] = useState<
    string | null
  >(null);

  const [purchaseOpen, setPurchaseOpen] = useState<boolean>(false);

  const purchaseClose = () => {
    setPurchaseOpen((prev) => !prev);
  };
  const togglePurchase = () => {
    setPurchaseOpen(true);
  };

  const confirmPurchase = () => {
    setPurchaseOpen((prev) => !prev);
  };

  const { mutate: purchasePlan, isLoading } =
    trpc.employerPurchasePlan.useMutation({
      onSuccess: (result) => {
        const units = result.planUnits;
        toast({
          title: "Success",
          description: `You successfully purchased a job posting plan. You have received ${units} units`,
          variant: "default",
          duration: 3000,
        });
        setCurrentlyPurchasingPlanID(null);
        router.refresh();
      },

      onError: (err) => {
        if (
          err.message ===
          "You do not have enough account balance. Top up and try again."
        ) {
          togglePurchase();
        } else {
          toast({
            title: "Something went wrong",
            description: "There was a problem trying to purchase this plan",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
      onMutate: ({ planID }) => {
        setCurrentlyPurchasingPlanID(planID);
      },
      onSettled: () => {
        setCurrentlyPurchasingPlanID(null);
      },
    });

  return (
    <section className="pb-4">
      <div className="mx-auto text-gray-600">
        <div className="relative mx-auto sm:text-center">
          <div className="flex items-center sm:items-start flex-col sm:flex-row justify-between w-full">
            <TopUpAlertModal
              isOpen={topUpOpen}
              onClose={topUpClose}
              onConfirm={topUpConfirm}
            />
            <NewTopUpAlertModal
              isOpen={purchaseOpen}
              onClose={purchaseClose}
              onConfirm={confirmPurchase}
            />
            <div className="flex flex-col sm:items-start items-center">
              <h3 className="text-slate-600 text-3xl font-bold sm:text-4xl">
                Pricing Details
              </h3>
              <div className="mt-0.5 leading-tight text-base">
                <p>Top up to purchase a plan</p>
                <p>
                  <span className="font-bold">1</span> unit is used to post{" "}
                  <span className="font-bold">1</span> job.
                </p>
              </div>
            </div>
            <div className="flex flex-col mt-3 sm:mt-0 w-full sm:w-fit gap-y-1.5">
              <Card className="border w-full sm:w-[200px] border-slate-300 rounded-md bg-slate-200 gap-y-1 flex flex-col items-center  justify-center  p-2 sm:px-3 sm:py-2">
                <CardHeader className="space-y-0">
                  <CardTitle className="text-base sm:text-sm flex items-center gap-x-0.5 font-medium text-gray-600">
                    <span>My Account Balance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center h-5 text-primary gap-x-2">
                  <div className="text-lg font-medium">
                    Ksh.{account.balance}
                  </div>
                  <Separator orientation="vertical" className="text-primary" />
                  <div className="text-lg font-medium">
                    Units.{account.units}
                  </div>
                </CardContent>
              </Card>
              <Button
                onClick={() => toggleTopUp()}
                className="hover:bg-primary rounded-md hover:opacity-90"
                variant="default"
                size="lg"
                type="button"
              >
                <Wallet className="h-4 w-4 mr-1.5 shrink-0" />
                MPesa Top Up
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-2 space-y-6 justify-center gap-6 sm:grid sm:grid-cols-2 sm:space-y-0 lg:grid-cols-3">
          {plans.map((item, idx) => (
            <div
              key={idx}
              className="relative flex-1 flex items-stretch flex-col p-8 rounded-xl border-2 border-gray-200"
            >
              <div>
                <span className="text-gray-700 font-medium">{item.name}</span>
                <div className="mt-4 text-gray-800 text-2xl font-semibold">
                  Ksh.{item.price}{" "}
                  <span className="text-lg text-gray-600 font-normal">
                    /{item.unit} unit
                  </span>
                </div>
              </div>
              <ul className="py-8 space-y-3">
                <li className="flex text-base shrink-0 items-center gap-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 flex-shrink-0 text-gray-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  {item.feature1}
                </li>
                <li className="flex text-base shrink-0 items-center gap-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 flex-shrink-0 text-gray-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  {item.feature2}
                </li>
                <li className="flex text-base shrink-0 items-center gap-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 flex-shrink-0 text-gray-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  {item.feature3}
                </li>
                <li className="flex text-base shrink-0 items-center gap-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 flex-shrink-0 text-gray-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  {item.feature4}
                </li>
                <li className="flex text-base shrink-0 items-center gap-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 flex-shrink-0 text-gray-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  {item.feature5}
                </li>
                <li className="flex text-base shrink-0 items-center gap-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 flex-shrink-0 text-gray-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  {item.feature6}
                </li>
              </ul>
              <div className="flex-1 flex items-end">
                <button
                  type="button"
                  disabled={isLoading && currentlyPurchasingPlanID === item.id}
                  onClick={() => purchasePlan({ planID: item.id })}
                  className="px-3 py-3 rounded-lg  flex items-center justify-center w-full font-semibold text-sm duration-150 text-white bg-slate-800 hover:opacity-90 active:bg-primary"
                >
                  {currentlyPurchasingPlanID === item.id && isLoading ? (
                    <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
                  ) : (
                    "Get Started"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <MessageAdminPricingModal
            isOpen={messageOpen}
            onClose={messageClose}
            onConfirm={messageConfirm}
            user={user}
          />
          <p className="text-sm">
            Note: For <span className="font-medium">help</span> and/or for{" "}
            <span className="font-medium">custom plan</span>, kindly send us a{" "}
            <span
              onClick={() => toggleMessage()}
              className="text-[#005580] cursor-pointer hover:underline font-medium"
            >
              message here?
            </span>{" "}
            We will give you a plan just tailored for your needs.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
