import { Metadata } from "next";
import { format, startOfWeek, endOfWeek } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarCharts } from "./BarChart";
import { TheLineCharts } from "./LineChart";
import {
  Activity,
  BarChartBig,
  CheckSquare,
  Info,
  ListTodo,
  MoveRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Application, ApplicationStatus } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ApplicationDataItem {
  createdAt: Date;
  id: string;
  status: ApplicationStatus;
}
interface DashboardPageProps {
  thisMonthApplications: number;
  totalApplications: number;
  thisMonthImprovement: string;
  thisMonthCount: number;
  percentageSuccess: string;
  countSuccess: number;
  countWeek: number;
  percentageWeek: string;
  percentagePending: string;
  countPending: number;
  currentActive: number;
  currentSuccessful: number;
  pendingLength: number;
  currentUnsuccessful: number;
  applications: ApplicationDataItem[];
}
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default function DashboardPage({
  thisMonthApplications,
  totalApplications,
  thisMonthCount,
  thisMonthImprovement,
  countSuccess,
  percentageSuccess,
  percentageWeek,
  countWeek,
  currentActive,
  currentSuccessful,
  currentUnsuccessful,
  applications,
  countPending,
  percentagePending,
  pendingLength,
}: DashboardPageProps) {
  const date = new Date();
  const fullMonthName = format(date, "MMMM");
  const startWeek = startOfWeek(date);
  const endWeek = endOfWeek(date);
  const day = format(date, "dd/MMMM");
  const formattedStartDate = format(startWeek, "dd/MMM");
  const formattedEndDate = format(endWeek, "dd/MMM");

  return (
    <>
      <div className="flex-col flex">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-gray-600">
              Dashboard
            </h2>
          </div>
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="grid gap-2 sm:gap-4 grid-cols-2 xl:grid-cols-4">
                <Card className="border border-gray-200 rounded-md p-2 sm:p-6">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base sm:text-sm flex items-center font-medium text-gray-600">
                      <span className="hidden sm:flex">Total Applications</span>
                      <span className="flex sm:hidden">Total Applications</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 ml-1 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent className="text-gray-500 tracking-normal">
                            <p className="text-gray-500 leading-tight text-xs font-normal">
                              Total of{" "}
                              <span className="font-semibold">
                                {totalApplications}
                              </span>{" "}
                              application(s), the month of{" "}
                              <span className="font-semibold">
                                {fullMonthName}
                              </span>{" "}
                              accounts for{" "}
                              <span className="font-semibold">
                                {thisMonthCount}
                              </span>{" "}
                              application(s) received leading to{" "}
                              <span className="font-semibold">
                                {thisMonthImprovement}
                              </span>{" "}
                              change comparing to last month!
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <span className="hidden sm:inline-flex items-center rounded-sm bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      <BarChartBig className="h-6 w-6 font-normal" />
                    </span>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                      +{totalApplications}
                    </div>
                    <p className="text-xs tracking-tight flex items-center gap-x-1 text-muted-foreground">
                      <span>
                        {parseInt(thisMonthImprovement) > 0 ||
                        thisMonthImprovement === "∞" ? (
                          <span className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            <TrendingUp className="h-4 w-4 mr-0.5" />
                            {thisMonthImprovement}
                          </span>
                        ) : thisMonthImprovement === "0%" ? (
                          <span className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            <MoveRight className="h-4 w-4 mr-0.5" />
                            {thisMonthImprovement}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                            <TrendingDown className="h-4 w-4 mr-0.5" />
                            {thisMonthImprovement}
                          </span>
                        )}
                      </span>
                      <span className="tracking-tighter leading-tight">
                        vs. last month
                      </span>
                    </p>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200 rounded-md p-2 sm:p-6">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base sm:text-sm flex items-center font-medium text-gray-600">
                      <span className="hidden sm:flex">Week Applications</span>
                      <span className="flex sm:hidden">Week Applications</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 ml-1 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent className="text-gray-500 tracking-normal">
                            <p className="text-gray-500 text-xs leading-tight font-normal">
                              This week starting{" "}
                              <span className="font-semibold">
                                {formattedStartDate}
                              </span>{" "}
                              and ending{" "}
                              <span className="font-semibold">
                                {formattedEndDate}
                              </span>{" "}
                              has{" "}
                              <span className="font-semibold">{countWeek}</span>{" "}
                              application(s) representing{" "}
                              <span className="font-semibold">
                                {percentageWeek}
                              </span>{" "}
                              change comparing to previous week!
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <span className="hidden sm:inline-flex items-center rounded-sm bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      <ListTodo className="h-6 w-6 font-normal" />
                    </span>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                      +{countWeek}
                    </div>
                    <p className="text-xs tracking-tight flex items-center gap-x-1 text-muted-foreground">
                      <span>
                        {parseInt(percentageWeek) > 0 ||
                        percentageWeek === "∞" ? (
                          <span className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            <TrendingUp className="h-4 w-4 mr-0.5" />
                            {percentageWeek}
                          </span>
                        ) : percentageWeek === "0%" ? (
                          <span className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            <MoveRight className="h-4 w-4 mr-0.5" />
                            {percentageWeek}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                            <TrendingDown className="h-4 w-4 mr-0.5" />
                            {percentageWeek}
                          </span>
                        )}
                      </span>
                      <span className="tracking-tighter leading-tight">
                        vs. last week
                      </span>
                    </p>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200 rounded-md p-2 sm:p-6">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base sm:text-sm flex items-center font-medium text-gray-600">
                      <span className="hidden sm:flex">
                        Offered Applications
                      </span>
                      <span className="flex sm:hidden">
                        Offered Applications
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 ml-1 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent className="text-gray-500 tracking-normal">
                            <p className="text-gray-500 text-xs leading-tight font-normal">
                              With{" "}
                              <span className="font-semibold">
                                {currentSuccessful}
                              </span>{" "}
                              total application(s) offered, this month of{" "}
                              {fullMonthName} has{" "}
                              <span className="font-semibold">
                                {countSuccess}
                              </span>{" "}
                              job(s) offered representing{" "}
                              <span className="font-semibold">
                                {percentageSuccess}
                              </span>{" "}
                              change comparing to last month&apos;s job offered!
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <span className="hidden sm:inline-flex items-center rounded-sm bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      <CheckSquare className="h-6 w-6 font-normal" />
                    </span>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                      +{currentSuccessful}
                    </div>
                    <p className="text-xs tracking-tight flex items-center gap-x-1 text-muted-foreground">
                      <span>
                        {parseInt(percentageSuccess) > 0 ||
                        percentageSuccess === "∞" ? (
                          <span className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            <TrendingUp className="h-4 w-4 mr-0.5" />
                            {percentageSuccess}
                          </span>
                        ) : percentageSuccess === "0%" ? (
                          <span className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            <MoveRight className="h-4 w-4 mr-0.5" />
                            {percentageSuccess}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                            <TrendingDown className="h-4 w-4 mr-0.5" />
                            {percentageSuccess}
                          </span>
                        )}
                      </span>
                      <span className="tracking-tighter leading-tight">
                        vs. last month
                      </span>
                    </p>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200 rounded-md p-2 sm:p-6">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-base flex items-center sm:text-sm font-medium text-gray-600">
                      <span className="hidden sm:flex">New Applications</span>
                      <span className="flex sm:hidden">New Applications</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 ml-1 text-gray-500" />
                          </TooltipTrigger>
                          <TooltipContent className="text-gray-500 tracking-normal">
                            <p className="text-gray-500 text-xs leading-tight font-normal">
                              Total of{" "}
                              <span className="font-semibold">
                                {pendingLength}
                              </span>{" "}
                              new application(s), today {day} has{" "}
                              <span className="font-semibold">
                                {countPending}
                              </span>{" "}
                              application(s) representing{" "}
                              <span className="font-semibold">
                                {percentagePending}
                              </span>{" "}
                              change comparing to yesterday&apos;s applications!
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <span className="hidden sm:inline-flex items-center rounded-sm bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      <Activity className="h-6 w-6 font-normal" />
                    </span>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                      +{pendingLength}
                    </div>
                    <p className="text-xs tracking-tight flex items-center gap-x-1 text-muted-foreground">
                      <span>
                        {parseInt(percentagePending) > 0 ||
                        percentagePending === "∞" ? (
                          <span className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            <TrendingUp className="h-4 w-4 mr-0.5" />
                            {percentagePending}
                          </span>
                        ) : percentagePending === "0%" ? (
                          <span className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            <MoveRight className="h-4 w-4 mr-0.5" />
                            {percentagePending}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                            <TrendingDown className="h-4 w-4 mr-0.5" />
                            {percentagePending}
                          </span>
                        )}
                      </span>
                      <span className="tracking-tighter leading-tight">
                        vs. yesterday
                      </span>
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border border-gray-200 rounded-md pt-2 pb-4 px-2">
                  <CardHeader className="mb-4">
                    <CardTitle className="text-gray-600 text-xl">
                      Applications Overview
                    </CardTitle>
                    <CardDescription className="text-xs">
                      You have received {thisMonthApplications} application(s)
                      in {fullMonthName}.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="-ml-6">
                    <BarCharts applications={applications} />
                  </CardContent>
                </Card>
                <Card className="col-span-4 lg:col-span-3 border border-gray-200 rounded-md pt-2 px-2">
                  <CardHeader className="mb-4">
                    <CardTitle className="text-gray-600 text-xl">
                      Response Overview
                    </CardTitle>
                    <CardDescription className="text-xs">
                      There are {currentActive} total active,{" "}
                      {currentSuccessful} successful and {currentUnsuccessful}{" "}
                      unsuccessful applications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="-ml-6">
                    <TheLineCharts applications={applications} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
