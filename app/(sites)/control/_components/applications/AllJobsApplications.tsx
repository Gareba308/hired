"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { endOfWeek, startOfWeek } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Archive,
  ArchiveRestore,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  ExternalLink,
  Grip,
  GripVertical,
  Loader2,
  MoreHorizontal,
  MoreVertical,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Job } from "@prisma/client";
import { isBefore, addDays } from "date-fns";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import { BarCharts } from "./BarChart";
import { TheLineCharts } from "./LineChart";

interface AllJobsProps {
  myJobs: Job[];

  myUnexpiredJobs: number;
  countJobs: number;
  percentageJobs: string;
  countJobSuccess: number;
  percentageJobSuccess: string;
  countJobUnsuccess: number;
  percentageJobUnsuccess: string;
  countJobWeek: number;
  percentageJobWeek: string;
  countJobPending: number;
  percentageJobPending: string;
  jobs: Job[];
}

export function AllJobsApplications({
  myJobs,
  jobs,
  myUnexpiredJobs,
  countJobs,
  percentageJobs,
  countJobSuccess,
  percentageJobSuccess,
  countJobUnsuccess,
  percentageJobUnsuccess,
  countJobPending,
  percentageJobPending,
}: AllJobsProps) {
  const data = myJobs;
  const date = new Date();
  const fullMonthName = format(date, "MMMM");
  const startWeek = startOfWeek(date);
  const endWeek = endOfWeek(date);
  const day = format(date, "dd/MMMM");
  const formattedStartDate = format(startWeek, "dd/MMM");
  const formattedEndDate = format(endWeek, "dd/MMM");
  const router = useRouter();
  const { toast } = useToast();
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [currentlyOpeningID, setCurrentlyOpeningID] = React.useState<
    string | null
  >(null);

  const [currentlyArchiving, setCurrentlyArchiving] = React.useState<
    string | null
  >(null);

  const [openingLoading, setOpeningLoading] = React.useState<boolean>(false);

  const openApp = (jobId: string) => {
    setCurrentlyOpeningID(jobId);
    setOpeningLoading(true);
    router.push(`/control/dashboard/jobs/${jobId}?origin=control/dashboard`);
    router.refresh();
  };

  const { mutate: archiveJob, isLoading } = trpc.employerArchiveJob.useMutation(
    {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "This job has successfully been placed in archived list",
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
            duration: 3000,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Something went wrong",
            description:
              "There was a problem trying to archive this job. Kindly try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
      onMutate: ({ jobId }) => {
        setCurrentlyArchiving(jobId);
      },
      onSettled: () => {
        setCurrentlyArchiving(null);
      },
    }
  );

  const { mutate: unarchiveJob, isLoading: unarchiveLoading } =
    trpc.employerUnarchiveJobs.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Archived jobs have successfully been retrieved",
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
            duration: 3000,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Something went wrong",
            description:
              "There was a problem trying to unarchive your job(s). Kindly try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const columns: ColumnDef<Job>[] = [
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <div
            className="flex justify-start items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Published Date
            <ArrowUpDown className="ml-0.5 h-4 w-4 shrink-0" />
          </div>
        );
      },
      cell: ({ row }) => {
        const date: Date = row.getValue("createdAt");

        return (
          <div suppressHydrationWarning className="font-normal text-sm">
            {format(date, "PPP")}
          </div>
        );
      },
    },
    {
      accessorKey: "job_id",
      header: "Job ID",
      cell: ({ row }) => (
        <div className="font-normal text-sm">{row.getValue("job_id")}</div>
      ),
    },
    {
      accessorKey: "job_title",
      header: "Job Title",
      cell: ({ row }) => {
        const jobTitle = row.getValue("job_title");
        return (
          <div className="capitalize text-sm line-clamp-1 font-normal">
            {typeof jobTitle === "string" ? jobTitle.toLowerCase() : ""}
          </div>
        );
      },
    },
    {
      accessorKey: "applied",
      header: ({ column }) => {
        return (
          <div
            className="flex justify-center items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Applied
            <ArrowUpDown className="ml-0.5 h-4 w-4 shrink-0" />
          </div>
        );
      },
      cell: ({ row }) => {
        const ownPlatformMethod = row.original.ownPlatformMethod;

        return (
          <div
            className={`font-normal text-sm flex justify-center items-center ${
              ownPlatformMethod === "own"
                ? "text-orange-800"
                : ownPlatformMethod === "here"
                ? "text-purple-800"
                : ""
            }`}
          >
            {ownPlatformMethod === "own" ? "Outs" : row.getValue("applied")}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const { deadline, createdAt } = row.original;

        const now = new Date();
        const isPastDeadline = deadline
          ? isBefore(new Date(deadline), now)
          : false;
        const isPastCreatedAtLimit = createdAt
          ? isBefore(new Date(createdAt), addDays(now, -30))
          : false;

        const isActive = !isPastDeadline && !isPastCreatedAtLimit;

        const formatted = isActive ? (
          <div className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
            <span>Active</span>
          </div>
        ) : (
          <div className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">
            <span>Closed</span>
          </div>
        );

        return <div className="text-sm font-normal">{formatted}</div>;
      },
    },
    {
      id: "actions",
      header: () => (
        <div className=" flex justify-center items-center">View</div>
      ),
      enableHiding: false,
      cell: ({ row }) => {
        const job = row.original;
        return (
          <div className="font-normal text-sm flex justify-center items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-5 w-8 p-0 rounded-sm"
                  disabled={
                    currentlyOpeningID === job.id ||
                    openingLoading ||
                    currentlyArchiving === job.id ||
                    isLoading
                  }
                >
                  <span className="sr-only">Open menu</span>
                  {currentlyOpeningID === job.id && openingLoading ? (
                    <span>
                      <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />
                    </span>
                  ) : currentlyArchiving === job.id && isLoading ? (
                    <span>
                      <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />
                    </span>
                  ) : (
                    <MoreHorizontal className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-gray-800">
                  Application Actions
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <span
                    className="text-gray-600 flex items-center"
                    onClick={() => openApp(job.id)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    View Details
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span
                    className="text-gray-600 flex items-center"
                    onClick={() => archiveJob({ jobId: job.id })}
                  >
                    <Archive className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    Archive Job
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(job.id)}
                  className="text-gray-600 flex items-center shrink-0"
                >
                  <Copy className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                  Copy Identity
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className=" flex items-center justify-between gap-x-4">
        <h2 className="font-bold text-gray-600 tracking-tight text-xl sm:text-2xl">
          Jobs Published
        </h2>
      </div>
      <div className="mt-3 mb-6">
        <div className="grid gap-2 sm:gap-4 grid-cols-2 xl:grid-cols-4">
          <Card className="border border-gray-200 rounded-md p-2 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base sm:text-sm flex items-center font-medium text-gray-600">
                <span className="hidden sm:flex">Active Jobs</span>
                <span className="flex sm:hidden">Active Jobs</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 ml-1 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent className="text-gray-500 tracking-normal">
                      <p className="text-gray-500 leading-tight text-xs font-normal">
                        Total of{" "}
                        <span className="font-semibold">{myUnexpiredJobs}</span>{" "}
                        job(s), the month of{" "}
                        <span className="font-semibold">{fullMonthName}</span>{" "}
                        accounts for{" "}
                        <span className="font-semibold">{countJobs}</span>{" "}
                        job(s) received leading to{" "}
                        <span className="font-semibold">{percentageJobs}</span>{" "}
                        change comparing to last month!
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <span className="sm:inline-flex hidden items-center rounded-sm bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                <BarChartBig className="h-6 w-6 font-normal" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                +{myUnexpiredJobs}
              </div>
              <p className="text-xs tracking-tight flex items-center gap-x-1 text-muted-foreground">
                <span>
                  {parseInt(percentageJobs) > 0 || percentageJobs === "∞" ? (
                    <span className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      <TrendingUp className="h-4 w-4 mr-0.5" />
                      {percentageJobs}
                    </span>
                  ) : percentageJobs === "0%" ? (
                    <span className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      <MoveRight className="h-4 w-4 mr-0.5" />
                      {percentageJobs}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                      <TrendingDown className="h-4 w-4 mr-0.5" />
                      {percentageJobs}
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
                <span className="hidden sm:flex">Apply Here</span>
                <span className="flex sm:hidden">Apply Here</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 ml-1 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent className="text-gray-500 tracking-normal">
                      <p className="text-gray-500 text-xs leading-tight font-normal">
                        This month of{" "}
                        <span className="font-semibold">{fullMonthName}</span>{" "}
                        has{" "}
                        <span className="font-semibold">{countJobSuccess}</span>{" "}
                        job(s) representing{" "}
                        <span className="font-semibold">
                          {percentageJobSuccess}
                        </span>{" "}
                        change comparing to previous month!
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <span className="sm:inline-flex hidden items-center rounded-sm bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                <ListTodo className="h-6 w-6 font-normal" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                +{countJobSuccess}
              </div>
              <p className="text-xs tracking-tight flex items-center gap-x-1 text-muted-foreground">
                <span>
                  {parseInt(percentageJobSuccess) > 0 ||
                  percentageJobSuccess === "∞" ? (
                    <span className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      <TrendingUp className="h-4 w-4 mr-0.5" />
                      {percentageJobSuccess}
                    </span>
                  ) : percentageJobSuccess === "0%" ? (
                    <span className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      <MoveRight className="h-4 w-4 mr-0.5" />
                      {percentageJobSuccess}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                      <TrendingDown className="h-4 w-4 mr-0.5" />
                      {percentageJobSuccess}
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
                <span className="hidden sm:flex">Own Platform</span>
                <span className="flex sm:hidden">Own Platform</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 ml-1 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent className="text-gray-500 tracking-normal">
                      <p className="text-gray-500 text-xs leading-tight font-normal">
                        With{" "}
                        <span className="font-semibold">
                          {countJobUnsuccess}
                        </span>{" "}
                        job(s) being applied externally, this month of{" "}
                        {fullMonthName} has{" "}
                        <span className="font-semibold">
                          {countJobUnsuccess}
                        </span>{" "}
                        job(s) being applied externally representing{" "}
                        <span className="font-semibold">
                          {percentageJobUnsuccess}
                        </span>{" "}
                        change comparing to last month!
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <span className="sm:inline-flex hidden items-center rounded-sm bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                <CheckSquare className="h-6 w-6 font-normal" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                +{countJobUnsuccess}
              </div>
              <p className="text-xs tracking-tight flex items-center gap-x-1 text-muted-foreground">
                <span>
                  {parseInt(percentageJobUnsuccess) > 0 ||
                  percentageJobUnsuccess === "∞" ? (
                    <span className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      <TrendingUp className="h-4 w-4 mr-0.5" />
                      {percentageJobUnsuccess}
                    </span>
                  ) : percentageJobUnsuccess === "0%" ? (
                    <span className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      <MoveRight className="h-4 w-4 mr-0.5" />
                      {percentageJobUnsuccess}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                      <TrendingDown className="h-4 w-4 mr-0.5" />
                      {percentageJobUnsuccess}
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
                <span className="hidden sm:flex">New Jobs</span>
                <span className="flex sm:hidden">New Jobs</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 ml-1 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent className="text-gray-500 tracking-normal">
                      <p className="text-gray-500 text-xs leading-tight font-normal">
                        Total of{" "}
                        <span className="font-semibold">{countJobPending}</span>{" "}
                        new job(s), today {day} has{" "}
                        <span className="font-semibold">{countJobPending}</span>{" "}
                        job(s) representing{" "}
                        <span className="font-semibold">
                          {percentageJobPending}
                        </span>{" "}
                        change comparing to yesterday&apos;s jobs!
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
              <span className="sm:inline-flex hidden items-center rounded-sm bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                <Activity className="h-6 w-6 font-normal" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                +{countJobPending}
              </div>
              <p className="text-xs tracking-tight flex items-center gap-x-1 text-muted-foreground">
                <span>
                  {parseInt(percentageJobPending) > 0 ||
                  percentageJobPending === "∞" ? (
                    <span className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      <TrendingUp className="h-4 w-4 mr-0.5" />
                      {percentageJobPending}
                    </span>
                  ) : percentageJobPending === "0%" ? (
                    <span className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      <MoveRight className="h-4 w-4 mr-0.5" />
                      {percentageJobPending}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                      <TrendingDown className="h-4 w-4 mr-0.5" />
                      {percentageJobPending}
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
      </div>
      <p className="text-sm text-gray-600 mt-2">
        Tabular representation of the applications and views of jobs posted on
        this platform.
      </p>
      <div className="flex items-center justify-between gap-x-4 py-1">
        <Input
          placeholder="Search for a job by job title"
          value={
            (table.getColumn("job_title")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("job_title")?.setFilterValue(event.target.value)
          }
          className="w-full sm:max-w-sm"
        />
        <div>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button
                disabled={unarchiveLoading}
                className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-2 py-2 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50"
              >
                {unarchiveLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin shrink-0 text-gray-600" />
                  </>
                ) : (
                  <GripVertical className="h-6  w-6 text-gray-600" />
                )}
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-1 w-48 origin-top-right divide-y divide-gray-100 rounded-sm bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <h2 className="text-gray-700 text-base font-medium py-1 px-4">
                  Job Actions
                </h2>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <span
                        onClick={() => unarchiveJob()}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "px-4 flex items-center hover:cursor-pointer py-2 text-sm"
                        )}
                      >
                        <ArchiveRestore className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                        Unarchive Job
                      </span>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="text-gray-900 text-base whitespace-nowrap font-semibold"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="whitespace-nowrap"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground hidden sm:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center text-gray-600 space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-500 font-medium">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-[100px] text-gray-500 items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border border-gray-200 rounded-md pt-2 pb-4 px-2">
          <CardHeader className="mb-4">
            <CardTitle className="text-gray-600 text-xl">
              Jobs Overview
            </CardTitle>
            <CardDescription className="text-xs">
              You have {countJobs} jobs(s) posted in {fullMonthName}, which
              represent {percentageJobs} change.
            </CardDescription>
          </CardHeader>
          <CardContent className="-ml-6">
            <BarCharts jobs={jobs} />
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3 border border-gray-200 rounded-md pt-2 px-2">
          <CardHeader className="mb-4">
            <CardTitle className="text-gray-600 text-xl">
              Platform Overview
            </CardTitle>
            <CardDescription className="text-xs">
              There are {countJobSuccess} jobs to be applied here,{" "}
              {countJobUnsuccess} jobs to be applied on external platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="-ml-6">
            <TheLineCharts jobs={jobs} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
