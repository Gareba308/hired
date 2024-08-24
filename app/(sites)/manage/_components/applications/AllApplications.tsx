"use client";

import * as React from "react";
import { useRouter} from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import {
  Activity,
  ArrowUpDown,
  Ban,
  BarChartBig,
  BookOpen,
  CheckCircle,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CornerUpLeft,
  ExternalLink,
  ListTodo,
  MoreHorizontal,
  MoveRight,
  RefreshCw,
  Trash,
  TrendingDown,
  TrendingUp,
  Undo,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Application } from "@prisma/client";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AllApplicationsProps {
  myApplication: Application[];
  jobTitle: string | null;
  thisMonthCount: number;
  thisMonthImprovement: string;
  countSuccess: number;
  percentageSuccess: string;
  percentageWeek: string;
  countWeek: number;
  countPending: number;
  percentagePending: string;
}

export function AllApplications({
  myApplication,
  jobTitle,
  thisMonthCount,
  countSuccess,
  thisMonthImprovement,
  percentageSuccess,
  percentageWeek,
  countWeek,
  countPending,
  percentagePending,
}: AllApplicationsProps) {
  const data = myApplication;
  const router = useRouter();
  const { toast } = useToast();

  function hideEmail(email: string): string {
    const atIndex = email.indexOf("@");
    if (atIndex !== -1) {
      const firstPart = email.slice(0, atIndex - 3) + "***";
      const secondPart = email.slice(atIndex);
      return firstPart + secondPart;
    } else {
      return email;
    }
  }

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [currentlyDeletingID, setCurrentlyDeletingID] = React.useState<
    string | null
  >(null);
  const [currentlyOpeningID, setCurrentlyOpeningID] = React.useState<
    string | null
  >(null);
  const [currentlyRejectingID, setCurrentlyRejectingID] = React.useState<
    string | null
  >(null);
  const [currentlyOfferingID, setCurrentlyOfferingID] = React.useState<
    string | null
  >(null);
  const [currentlyInterviewID, setCurrentlyInterviewID] = React.useState<
    string | null
  >(null);
  const [currentlyForwardID, setCurrentlyForwardID] = React.useState<
    string | null
  >(null);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [loadingPending, setLoadingPending] = React.useState(false);
  const [forwardApplication, setForwardApplication] = React.useState(false);

  const { mutate: deleteApplication, isLoading } =
    trpc.employerHideApplication.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description:
            "You have successfully deleted this application from your side.",
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
              "There was a problem deleting this message. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
      onMutate: ({ applicationID }) => {
        setCurrentlyDeletingID(applicationID);
      },
      onSettled: () => {
        setCurrentlyDeletingID(null);
      },
    });

  const deleted = (applicationId: string) => {
    deleteApplication({ applicationID: applicationId });
  };
  const { mutate: updatePending } = trpc.employerUpdatePending.useMutation({
    onMutate: ({ applicationID }) => {
      setCurrentlyOpeningID(applicationID);
      setLoadingPending(true);
    },
    onSettled: () => {
      if (currentlyOpeningID) {
        setLoadingPending(true);
        const navigatePromise = new Promise<void>((resolve, reject) => {
          router.push(`/manage/dashboard/applications/${currentlyOpeningID}`);
          router.refresh();
        });
        navigatePromise
          .then(() => {
            setLoadingPending(false);
          })
          .catch((error) => {
            console.error("Error navigating:", error);
          });
      }
    },
  });

  const forwardApp = (appID: string) => {
    setCurrentlyForwardID(appID);
    setForwardApplication(true);
    router.push(`/manage/dashboard/applications/${appID}`);
    router.refresh();
  };

  const { mutate: updateReject, isLoading: rejectLoading } =
    trpc.employerUpdateReject.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description:
            "Your decision has successfully been captured and communication conveyed to applicant.",
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
            description: "There was a problem updating your decision.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
      onMutate: ({ applicationID }) => {
        setCurrentlyRejectingID(applicationID);
      },
      onSettled: () => {
        setCurrentlyRejectingID(null);
      },
    });

  const { mutate: updateOffer, isLoading: offerLoading } =
    trpc.employerUpdateOffered.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description:
            "The request to offer this applicant a job has been captured and an initial communication conveyed.",
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
            description: "There was a problem updating this changes",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
      onMutate: ({ applicationID }) => {
        setCurrentlyOfferingID(applicationID);
      },
      onSettled: () => {
        setCurrentlyOfferingID(null);
      },
    });

  const { mutate: updateInterview, isLoading: interviewLoading } =
    trpc.employerUpdateInterview.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description:
            "This job application has been marked as headed to interview stage",
          variant: "default",
          duration: 3000,
        });
        router.refresh();
      },
      onError: (err) => {
        if (err.message) {
          toast({
            title: "Something went wrong",
            duration: 3000,
            description: err.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Something went wrong",
            description:
              "There was a problem updating your changes on this job application",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
      onMutate: ({ applicationID }) => {
        setCurrentlyInterviewID(applicationID);
      },
      onSettled: () => {
        setCurrentlyInterviewID(null);
      },
    });

  const columns: ColumnDef<Application>[] = [
    {
      accessorKey: "job_id",
      header: "Job ID",
      cell: ({ row }) => (
        <div className="font-normal text-sm">{row.getValue("job_id")}</div>
      ),
    },
    {
      accessorKey: "jobTitle",
      header: "Job Title",
      cell: ({ row }) => (
        <div className="capitalize text-sm font-normal">
          {row.getValue("jobTitle")}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Applied",
      cell: ({ row }) => {
        const date: Date = row.getValue("createdAt");

        return <div className="font-normal text-sm">{format(date, "PPP")}</div>;
      },
    },
    {
      accessorKey: "applicantName",
      header: "Applicant Name",
      cell: ({ row }) => (
        <div className="capitalize text-sm font-normal">
          {row.getValue("applicantName")}
        </div>
      ),
    },
    {
      accessorKey: "userEmail",
      header: "Applicant Email",
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <div className="font-normal text-sm">
            {status === "INTERVIEW" ||
            status === "OFFERED" ||
            status === "REVIEWING"
              ? row.getValue("userEmail")
              : hideEmail(row.getValue("userEmail"))}
          </div>
        );
      },
    },
    {
      accessorKey: "finalScore",
      header: ({ column }) => {
        return (
          <div
            className="flex justify-center items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Score
            <ArrowUpDown className="ml-0.5 h-4 w-4 shrink-0" />
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-sm font-normal flex justify-center items-center">
          {row.getValue("finalScore")}%
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");

        const formatted =
          status === "PENDING" ? (
            <div className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              <span className="h-[6px] w-[6px] rounded-full bg-blue-700 mr-1" />
              <span>Pending</span>
            </div>
          ) : status === "REVIEWING" ? (
            <div className="inline-flex items-center rounded-sm bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700 ring-1 ring-inset ring-violet-700/10">
              <span className="h-[6px] w-[6px] rounded-full bg-violet-700 mr-1" />
              <span>Reviewing</span>
            </div>
          ) : status === "INTERVIEW" ? (
            <div className="inline-flex items-center rounded-sm bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
              <span className="h-[6px] w-[6px] rounded-full bg-yellow-700 mr-1" />
              <span>Interview</span>
            </div>
          ) : status === "OFFERED" ? (
            <div className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
              <span className="h-[6px] w-[6px] rounded-full bg-green-700 mr-1" />
              <span>Offered</span>
            </div>
          ) : (
            <div className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10">
              <span className="h-[6px] w-[6px] rounded-full bg-red-700 mr-1" />
              <span>Declined</span>
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
        const application = row.original;
        return (
          <div className="font-normal text-sm flex justify-center items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-5 w-8 p-0 rounded-sm"
                  disabled={
                    currentlyDeletingID === application.id ||
                    currentlyOpeningID === application.id ||
                    currentlyForwardID === application.id ||
                    currentlyRejectingID === application.id ||
                    currentlyOfferingID === application.id ||
                    currentlyInterviewID === application.id ||
                    interviewLoading ||
                    offerLoading ||
                    rejectLoading ||
                    isLoading ||
                    loadingPending ||
                    forwardApplication
                  }
                >
                  <span className="sr-only">Open menu</span>
                  {currentlyDeletingID === application.id && isLoading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin text-destructive-foreground" />
                    </>
                  ) : currentlyOpeningID === application.id &&
                    loadingPending ? (
                    <span className="text-gray-600 text-xs flex items-center shrink-0">
                      <RefreshCw className="h-4 w-4 animate-spin shrink-0 text-gray-600 mr-1" />
                      Opening...
                    </span>
                  ) : currentlyForwardID === application.id &&
                    forwardApplication ? (
                    <span className="text-gray-600 text-xs flex items-center shrink-0">
                      <RefreshCw className="h-4 w-4 animate-spin shrink-0 text-gray-600 mr-1" />
                      Opening...
                    </span>
                  ) : currentlyRejectingID === application.id &&
                    rejectLoading ? (
                    <span className="text-gray-600 text-xs flex items-center shrink-0">
                      <RefreshCw className="h-4 w-4 animate-spin shrink-0 text-red-600 mr-1" />
                      Updating...
                    </span>
                  ) : currentlyOfferingID === application.id && offerLoading ? (
                    <span className="text-gray-600 text-xs flex items-center shrink-0">
                      <RefreshCw className="h-4 w-4 animate-spin shrink-0 text-green-600 mr-1" />
                      Updating...
                    </span>
                  ) : currentlyInterviewID === application.id &&
                    interviewLoading ? (
                    <span className="text-gray-600 text-xs flex items-center shrink-0">
                      <RefreshCw className="h-4 w-4 animate-spin shrink-0 text-yellow-600 mr-1" />
                      Updating...
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
                <DropdownMenuItem className="text-sm">
                  {application.status === "PENDING" ? (
                    <>
                      <span
                        className="text-gray-600 flex text-sm items-center shrink-0"
                        onClick={() =>
                          updatePending({ applicationID: application.id })
                        }
                      >
                        <ExternalLink className="h-4 w-4 mr-1.5 shrink-0 text-gray-500" />
                        Full Application
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        onClick={() => forwardApp(application.id)}
                        className="text-gray-600 flex text-sm items-center shrink-0"
                      >
                        <ExternalLink className="h-4 w-4 mr-1.5 shrink-0 text-gray-500" />
                        Full Application
                      </span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className={`text-sm ${
                    application.status === "DECLINED" ||
                    application.status === "OFFERED"
                      ? "line-through text-gray-600"
                      : "text-gray-600"
                  }`}
                  disabled={
                    application.status === "DECLINED" ||
                    application.status === "OFFERED"
                  }
                  onClick={() =>
                    updateReject({ applicationID: application.id })
                  }
                >
                  <span className="flex items-center shrink-0 text-gray-600">
                    <Ban className="h-4 w-4 mr-1.5 shrink-0 text-gray-500" />
                    Mark Rejected
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className={`text-sm ${
                    application.status === "DECLINED" ||
                    application.status === "OFFERED"
                      ? "line-through text-gray-600"
                      : "text-gray-600"
                  }`}
                  disabled={
                    application.status === "DECLINED" ||
                    application.status === "OFFERED"
                  }
                  onClick={() => updateOffer({ applicationID: application.id })}
                >
                  <span className="flex items-center shrink-0 text-gray-600">
                    <CheckCircle className="h-4 w-4 mr-1.5 shrink-0 text-gray-500" />
                    Mark Offered
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={
                    application.status === "DECLINED" ||
                    application.status === "OFFERED" ||
                    application.status === "INTERVIEW"
                  }
                  className={`text-sm ${
                    application.status === "DECLINED" ||
                    application.status === "OFFERED" ||
                    application.status === "INTERVIEW"
                      ? "line-through text-gray-600"
                      : "text-gray-600"
                  }`}
                  onClick={() =>
                    updateInterview({ applicationID: application.id })
                  }
                >
                  <span className="flex items-center shrink-0">
                    <BookOpen className="h-4 w-4 mr-1.5 shrink-0 text-gray-500" />
                    Invite Interview
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-sm text-destructive-foreground"
                  onClick={() => deleted(application.id)}
                >
                  <span className="flex items-center shrink-0 text-destructive-foreground">
                    <Trash className="h-4 w-4 mr-1.5 shrink-0" />
                    Delete Application
                  </span>
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
      <div className="mb-0.5 flex flex-col">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/manage/dashboard">Back</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Single Job Applications</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h2 className="font-bold text-gray-600 mt-3 tracking-tight text-[18px] md:text-xl lg:text-2xl">
          {jobTitle ? <>{jobTitle} Applications</> : <>Job Applications</>}
        </h2>
      </div>
      <div className="mb-8 mt-2">
        <div className="grid gap-2 sm:gap-4 grid-cols-2 xl:grid-cols-4">
          <Card className="border border-gray-200 rounded-md p-2 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base sm:text-sm flex items-center font-medium text-gray-600">
                <span className="hidden sm:flex">Total Applications</span>
                <span className="flex sm:hidden">Total Applications</span>
              </CardTitle>
              <span className="hidden sm:inline-flex items-center rounded-sm bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                <BarChartBig className="h-6 w-6 font-normal" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                +{myApplication.length}
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
                  {parseInt(percentageWeek) > 0 || percentageWeek === "∞" ? (
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
                <span className="hidden sm:flex">Offered Applications</span>
                <span className="flex sm:hidden">Offered Applications</span>
              </CardTitle>
              <span className="hidden sm:inline-flex items-center rounded-sm bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                <CheckSquare className="h-6 w-6 font-normal" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                +{countSuccess}
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
              </CardTitle>
              <span className="hidden sm:inline-flex items-center rounded-sm bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                <Activity className="h-6 w-6 font-normal" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                +{countPending}
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
      </div>
      <p className="text-xs sm:text-sm text-gray-700 mb-1.5">
        Open <span className="font-semibold">Actions</span> to get
        applicant&apos;s job application. Rate the application to obtain final
        score.
      </p>
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
