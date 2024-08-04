"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowBigRight, ArrowRight, CheckSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Company } from "@prisma/client";

interface CompanyStatsAlertModelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;

  countEmployers: number;
  percentageEmployers: string;
  countEmployerSuccess: number;
  percentageEmployerSuccess: string;
  countEmployerWeek: number;
  percentageEmployerWeek: string;
  countEmployerPending: number;
  percentageEmployerPending: string;
  companies: Company[];
}

export const CompanyStatsAlertModal: React.FC<CompanyStatsAlertModelProps> = ({
  isOpen,
  onClose,
  onConfirm,

  countEmployers,
  percentageEmployers,
  countEmployerSuccess,
  percentageEmployerSuccess,
  countEmployerWeek,
  percentageEmployerWeek,
  countEmployerPending,
  percentageEmployerPending,
  companies,
}) => {
  return (
    <Modal
      title="Instant statistics"
      description="This is employer instant statistics details"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Card className="w-full -mt-1.5">
        <CardContent>
          <div className="text-sm">
            <div className="grid gap-1">
              <div className="font-semibold">Instant Employers Stats</div>
              <ul className="grid gap-0.5">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Employers</span>
                  <span>{companies.length}</span>
                </li>
                <Separator className="my-1" />
                <>
                  <h3 className="text-muted-foreground font-semibold">
                    Months Total
                  </h3>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Months Count</span>
                    <span className="flex items-center">{countEmployers}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Months Growth</span>
                    <span className="flex items-center">
                      {percentageEmployers}
                    </span>
                  </li>
                </>
                <Separator className="my-1" />
                <>
                  <h3 className="text-muted-foreground font-semibold">
                    Referred Total
                  </h3>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Referred Count
                    </span>
                    <span className="flex items-center">
                      {countEmployerSuccess}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Referred Growth
                    </span>
                    <span className="flex items-center">
                      {percentageEmployerSuccess}
                    </span>
                  </li>
                </>
                <Separator className="my-1" />
                <>
                  <h3 className="text-muted-foreground font-semibold">
                    Week Total
                  </h3>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Week Count</span>
                    <span className="flex items-center">
                      {countEmployerWeek}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Week Growth</span>
                    <span className="flex items-center">
                      {percentageEmployerWeek}
                    </span>
                  </li>
                </>
                <Separator className="my-1" />
                <>
                  <h3 className="text-muted-foreground font-semibold">
                    Day Total
                  </h3>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Day Count</span>
                    <span className="flex items-center">
                      {countEmployerPending}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Day Growth</span>
                    <span className="flex items-center">
                      {percentageEmployerPending}
                    </span>
                  </li>
                </>
              </ul>
            </div>
            <Separator className="my-1" />
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 space-x-2 flex items-center justify-end w-full">
        <Button
          variant="outline"
          className="rounded-sm hidden bg-slate-200 border-none outline-none ring-0"
          size="lg"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          size="lg"
          variant="default"
          className="hover:bg-primary text-base hover:opacity-90 border-none outline-none ring-0"
          onClick={onConfirm}
        >
          <CheckSquare className="h-4 w-4 shrink-0 mr-1.5" /> Done
        </Button>
      </div>
    </Modal>
  );
};
