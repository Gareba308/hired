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
import "@/lib/suppressHydration"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Axe,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CornerUpLeft,
  ExternalLink,
  Loader2,
  MoreHorizontal,
  Trash,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import Link from "next/link";
import { ReportHistoryAlertModal } from "../models/report/ReportHistoryModal";
import { DeleteJobReportAlertModal } from "../models/report/DeleteAlertModal";

interface CombinedDataItems {
  id: string;
  userId: string;
  userName: string | null;
  jobId: string;
  jobName: string;
  companyId: string;
  employerName: string;
  subject: string;
  report: string;
  createdAt: Date;
  sorted: boolean;
  companyPhone: string;
  companyEmail: string;
}

interface ReceivedReportsProps {
  combinedData: CombinedDataItems[];

  countReports: number;
  percentageReports: string;
  countReportSuccess: number;
  percentageReportSuccess: string;
  countReportWeek: number;
  percentageReportWeek: string;
  countReportPending: number;
  percentageReportPending: string;
}

export function ReceivedReports({
  combinedData,
  countReports,
  percentageReports,
  countReportSuccess,
  percentageReportSuccess,
  countReportWeek,
  percentageReportWeek,
  countReportPending,
  percentageReportPending,
}: ReceivedReportsProps) {
  const data = combinedData;
  const router = useRouter();
  const date = new Date();
  const fullMonthName = format(date, "MMMM");
  const startWeek = startOfWeek(date);
  const endWeek = endOfWeek(date);
  const day = format(date, "dd/MMMM");
  const formattedStartDate = format(startWeek, "dd/MMM");
  const formattedEndDate = format(endWeek, "dd/MMM");
  const searchParams = useSearchParams();
  const [currentlyOpeningReportID, setCurrentlyOpeningReportID] =
    React.useState<string | null>(null);
  const [currentlySortingReportID, setCurrentlySortingReportID] =
    React.useState<string | null>(null);
  const [reportOpen, setReportOpen] = React.useState<boolean>(false);
  const reportClose = () => {
    setReportOpen((prev) => !prev);
    setCurrentlyOpeningReportID(null);
  };

  const toggleReport = (reportID: string) => {
    setReportOpen(true);
    setCurrentlyOpeningReportID(reportID);
  };
  const origin = searchParams?.get("origin");
  const { toast } = useToast();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const { mutate: adminSortReport, isLoading: sortReportLoading } =
    trpc.adminSortReport.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "This report has been marked as sorted",
          variant: "default",
          duration: 3000,
        });
        reportClose();
        router.refresh();
      },
      onError: (err) => {
        if (err.message) {
          toast({
            title: "Something went wrong",
            variant: "destructive",
            duration: 3000,
            description: err.message,
          });
        } else {
          toast({
            title: "Something went wrong",
            variant: "destructive",
            duration: 3000,
            description:
              "There was a problem updating the status of the job report.",
          });
        }
        reportClose();
      },
      onMutate: ({ reportID }) => {
        setCurrentlyOpeningReportID(reportID);
      },
      onSettled: () => {
        setCurrentlyOpeningReportID(null);
      },
    });

  const { mutate: adminSortJobReport, isLoading: sortJobReportLoading } =
    trpc.adminSortReport.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "This report has been marked as sorted",
          variant: "default",
          duration: 3000,
        });
        router.refresh();
      },
      onError: (err) => {
        if (err.message) {
          toast({
            title: "Something went wrong",
            variant: "destructive",
            duration: 3000,
            description: err.message,
          });
        } else {
          toast({
            title: "Something went wrong",
            variant: "destructive",
            duration: 3000,
            description:
              "There was a problem updating the status of the job report.",
          });
        }
      },
      onMutate: ({ reportID }) => {
        setCurrentlySortingReportID(reportID);
      },
      onSettled: () => {
        setCurrentlySortingReportID(null);
      },
    });

  const sortJobReportConfirm = (reportID: string) => {
    setCurrentlySortingReportID(reportID);
    adminSortJobReport({ reportID });
  };
  const sortReportConfirm = (reportID: string) => {
    setCurrentlyOpeningReportID(reportID);
    adminSortReport({ reportID });
  };

  const [currentlyDeleteID, setCurrentlyDeleteID] = React.useState<
    string | null
  >(null);
  const [deleteReportOpen, setDeleteReportOpen] =
    React.useState<boolean>(false);
  const deleteReportClose = () => {
    setDeleteReportOpen((prev) => !prev);
    setCurrentlyDeleteID(null);
  };

  const toggleDelete = (reportID: string) => {
    setDeleteReportOpen(true);
    setCurrentlyDeleteID(reportID);
  };

  const { mutate: deleteReport, isLoading: deleteLoad } =
    trpc.adminDeleteSingleJobReport.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "The job report has successfully been deleted.",
          variant: "default",
          duration: 3000,
        });
        deleteReportClose();
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
              "There was a problem while deleting this job report. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
        deleteReportClose();
      },
    });

  const confirmDelete = (reportID: string) => {
    setCurrentlyDeleteID(reportID);
    deleteReport({ reportID });
  };
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<CombinedDataItems, keyof CombinedDataItems>[] = [
    {
      accessorKey: "createdAt",
      header: "Report Date",
      cell: ({ row }) => {
        const date: Date = row.getValue("createdAt");
        return <div className="font-normal text-sm">{format(date, "PPP")}</div>;
      },
    },
    {
      accessorKey: "userName",
      header: "Reporter",
      cell: ({ row }) => (
        <div className="capitalize text-sm font-normal">
          {row.getValue("userName")}
        </div>
      ),
    },
    {
      accessorKey: "jobName",
      header: "Job Name",
      cell: ({ row }) => (
        <div className="capitalize text-sm font-normal">
          {row.getValue("jobName")}
        </div>
      ),
    },
    {
      accessorKey: "employerName",
      header: "Employer Company",
      cell: ({ row }) => (
        <div className="capitalize text-sm font-normal">
          {row.getValue("employerName")}
        </div>
      ),
    },
    {
      accessorKey: "companyPhone",
      header: "Phone Number",
      cell: ({ row }) => (
        <div className="text-sm font-normal">
          {row.getValue("companyPhone")}
        </div>
      ),
    },
    {
      accessorKey: "companyEmail",
      header: "Email Address",
      cell: ({ row }) => (
        <div className="text-sm font-normal">
          {row.getValue("companyEmail")}
        </div>
      ),
    },
    {
      accessorKey: "sorted",
      header: "Status",
      cell: ({ row }) => {
        const sorted = row.getValue("sorted");

        const formatted =
          sorted === true ? (
            <div className="inline-flex items-center rounded-sm bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
              <span>Sorted</span>
            </div>
          ) : (
            <div className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700">
              <span>Pending</span>
            </div>
          );

        return <div className="text-sm font-normal">{formatted}</div>;
      },
    },
    {
      id: "actions",
      header: () => (
        <div className=" flex justify-center items-center">Actions</div>
      ),
      enableHiding: false,
      cell: ({ row }) => {
        const data = row.original;
        return (
          <div className="font-normal text-sm flex justify-center items-center">
            {currentlyOpeningReportID === data.id && (
              <ReportHistoryAlertModal
                isOpen={reportOpen}
                onClose={reportClose}
                onConfirm={() => sortReportConfirm(data.id)}
                loading={sortReportLoading}
                report={data}
              />
            )}
            {currentlyDeleteID === data.id && (
              <DeleteJobReportAlertModal
                isOpen={deleteReportOpen}
                onClose={deleteReportClose}
                loading={deleteLoad}
                onConfirm={() => confirmDelete(data.id)}
              />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={
                    sortJobReportLoading || sortReportLoading || deleteLoad
                  }
                  variant="ghost"
                  className="h-5 w-8 p-0 rounded-sm"
                >
                  <span className="sr-only">Open menu</span>
                  {currentlySortingReportID === data.id &&
                  sortJobReportLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : currentlyOpeningReportID === data.id &&
                    sortReportLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : currentlyDeleteID === data.id && deleteLoad ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MoreHorizontal className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-gray-800">
                  Report Actions
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <span
                    onClick={() => toggleReport(data.id)}
                    className="text-gray-600 flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    View Report
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span
                    onClick={() => sortJobReportConfirm(data.id)}
                    className="text-gray-600 flex items-center"
                  >
                    <Axe className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    Check Report
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span
                    onClick={() => toggleDelete(data.id)}
                    className="text-gray-600 flex items-center"
                  >
                    <Trash className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    Delete Report
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
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
      <div className="flex items-center justify-between gap-x-4 mb-2 flex-row">
        <div className=" flex flex-row items-center">
          <Link
            href={origin ? `/${origin}` : "/control"}
            className="hover:text-[#005580]"
          >
            <CornerUpLeft className="h-6 w-6 mr-2 shrink-0" />
          </Link>
          <h2 className="font-bold text-gray-600 tracking-tight text-xl sm:text-2xl">
            Worker Job Reports
          </h2>
        </div>
      </div>

      <div className="mt-3 mb-6">
        <div className="grid gap-2 sm:gap-4 grid-cols-2 xl:grid-cols-4">
          <Card className="border border-gray-200 rounded-md p-2 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base sm:text-sm flex items-center font-medium text-gray-600">
                <span className="hidden sm:flex">Total Reports</span>
                <span className="flex sm:hidden">Total Reports</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 ml-1 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent className="text-gray-500 tracking-normal">
                      <p className="text-gray-500 leading-tight text-xs font-normal">
                        Total of{" "}
                        <span className="font-semibold">{combinedData.length}</span>{" "}
                        report(s), the month of{" "}
                        <span className="font-semibold">{fullMonthName}</span>{" "}
                        accounts for{" "}
                        <span className="font-semibold">{countReports}</span>{" "}
                        report(s) received leading to{" "}
                        <span className="font-semibold">{percentageReports}</span>{" "}
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
                +{combinedData.length}
              </div>
              <p className="text-xs tracking-tight flex items-center gap-x-1 text-muted-foreground">
                <span>
                  {parseInt(percentageReports) > 0 || percentageReports === "∞" ? (
                    <span className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      <TrendingUp className="h-4 w-4 mr-0.5" />
                      {percentageReports}
                    </span>
                  ) : percentageReports === "0%" ? (
                    <span className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      <MoveRight className="h-4 w-4 mr-0.5" />
                      {percentageReports}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                      <TrendingDown className="h-4 w-4 mr-0.5" />
                      {percentageReports}
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
                <span className="hidden sm:flex">Week Report</span>
                <span className="flex sm:hidden">Week Report</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 ml-1 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent className="text-gray-500 tracking-normal">
                      <p className="text-gray-500 text-xs leading-tight font-normal">
                        This week starting{" "}
                        <span className="font-semibold">{formattedStartDate}</span>{" "}ending
                        <span className="font-semibold">{formattedEndDate}</span>{" "}
                        has{" "}
                        <span className="font-semibold">{countReportWeek}</span>{" "}
                        report(s) representing{" "}
                        <span className="font-semibold">
                          {percentageReportWeek}
                        </span>{" "}
                        change comparing to previous month!
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
                +{countReportWeek}
              </div>
              <p className="text-xs tracking-tight flex items-center gap-x-1 text-muted-foreground">
                <span>
                  {parseInt(percentageReportWeek) > 0 ||
                  percentageReportWeek === "∞" ? (
                    <span className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      <TrendingUp className="h-4 w-4 mr-0.5" />
                      {percentageReportWeek}
                    </span>
                  ) : percentageReportWeek === "0%" ? (
                    <span className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      <MoveRight className="h-4 w-4 mr-0.5" />
                      {percentageReportWeek}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                      <TrendingDown className="h-4 w-4 mr-0.5" />
                      {percentageReportWeek}
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
                <span className="hidden sm:flex">Sorted Report</span>
                <span className="flex sm:hidden">Sorted Report</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 ml-1 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent className="text-gray-500 tracking-normal">
                      <p className="text-gray-500 text-xs leading-tight font-normal">
                        With{" "}
                        <span className="font-semibold">
                          {countReportSuccess}
                        </span>{" "}
                        report(s) sorted, this month of{" "}
                        {fullMonthName} has{" "}
                        <span className="font-semibold">
                          {countReportSuccess}
                        </span>{" "}
                        report(s) sort success{" "} representing
                        <span className="font-semibold">
                          {percentageReportSuccess}
                        </span>{" "}
                        change comparing to last month!
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
                +{countReportSuccess}
              </div>
              <p className="text-xs tracking-tight flex items-center gap-x-1 text-muted-foreground">
                <span>
                  {parseInt(percentageReportSuccess) > 0 ||
                  percentageReportSuccess === "∞" ? (
                    <span className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      <TrendingUp className="h-4 w-4 mr-0.5" />
                      {percentageReportSuccess}
                    </span>
                  ) : percentageReportSuccess === "0%" ? (
                    <span className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      <MoveRight className="h-4 w-4 mr-0.5" />
                      {percentageReportSuccess}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                      <TrendingDown className="h-4 w-4 mr-0.5" />
                      {percentageReportSuccess}
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
                <span className="hidden sm:flex">New Reports</span>
                <span className="flex sm:hidden">New Reports</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 ml-1 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent className="text-gray-500 tracking-normal">
                      <p className="text-gray-500 text-xs leading-tight font-normal">
                        Total of{" "}
                        <span className="font-semibold">{countReportPending}</span>{" "}
                        new report(s), today {day} has{" "}
                        <span className="font-semibold">{countReportPending}</span>{" "}
                        report(s) representing{" "}
                        <span className="font-semibold">
                          {percentageReportPending}
                        </span>{" "}
                        change comparing to yesterday!
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
                +{countReportPending}
              </div>
              <p className="text-xs tracking-tight flex items-center gap-x-1 text-muted-foreground">
                <span>
                  {parseInt(percentageReportPending) > 0 ||
                  percentageReportPending === "∞" ? (
                    <span className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      <TrendingUp className="h-4 w-4 mr-0.5" />
                      {percentageReportPending}
                    </span>
                  ) : percentageReportPending === "0%" ? (
                    <span className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      <MoveRight className="h-4 w-4 mr-0.5" />
                      {percentageReportPending}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                      <TrendingDown className="h-4 w-4 mr-0.5" />
                      {percentageReportPending}
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
    </div>
  );
}
