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
import { trpc } from "@/app/_trpc/client";
import {
  CircleEllipsis,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CornerUpLeft,
  Trash,
  MoreVertical,
  Loader2,
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
import { Input } from "@/components/ui/input";
import {
  Activity,
  BarChartBig,
  CheckSquare,
  Info,
  ListTodo,
  MoveRight,
  TrendingDown,
  TrendingUp,
  ArrowUpDown,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Company, Job, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { BarCharts } from "./BarChart";
import { TheLineCharts } from "./LineChart";
import Link from "next/link";
import { DeletePendingAlertModal } from "../models/companies/DeletePending";
import { DeleteAccountAlertModal } from "../models/companies/DeleteAccount";

interface CompaniesStatsProps {
  combinedData: User[];
  countEmployers: number;
  percentageEmployers: string;
  countEmployerSuccess: number;
  percentageEmployerSuccess: string;
  countEmployerWeek: number;
  percentageEmployerWeek: string;
  countEmployerPending: number;
  percentageEmployerPending: string;
  jobs: Job[];
  companies: Company[];
}

export function CompaniesStats({
  combinedData,
  countEmployers,
  percentageEmployers,
  countEmployerSuccess,
  percentageEmployerSuccess,
  countEmployerWeek,
  percentageEmployerWeek,
  countEmployerPending,
  percentageEmployerPending,
  jobs,
  companies,
}: CompaniesStatsProps) {
  const data = combinedData;

  const date = new Date();
  const fullMonthName = format(date, "MMMM");
  const startWeek = startOfWeek(date);
  const endWeek = endOfWeek(date);
  const day = format(date, "dd/MMMM");
  const formattedStartDate = format(startWeek, "dd/MMM");
  const formattedEndDate = format(endWeek, "dd/MMM");
  const router = useRouter();
  const { toast } = useToast();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [currentlyPendingID, setCurrentlyPendingID] = React.useState<
    string | null
  >(null);
  const [currentlyDeletingID, setCurrentlyDeletingID] = React.useState<
    string | null
  >(null);
  const [pendingOpen, setPendingOpen] = React.useState<boolean>(false);
  const pendingClose = () => {
    setPendingOpen((prev) => !prev);
    setCurrentlyPendingID(null);
  };

  const toggleOpen = (pendingId: string) => {
    setPendingOpen(true);
    setCurrentlyPendingID(pendingId);
  };

  const [deleteOpen, setDeleteOpen] = React.useState<boolean>(false);
  const deleteClose = () => {
    setDeleteOpen((prev) => !prev);
    setCurrentlyDeletingID(null);
  };

  const toggleDelete = (accountId: string) => {
    setDeleteOpen(true);
    setCurrentlyDeletingID(accountId);
  };

  const { mutate: pendingUpdate, isLoading: pendingLoading } =
    trpc.adminUpdatePendingAccount.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You successfully updated account's re-signup",
          variant: "default",
          duration: 3000,
        });
        router.refresh();
      },
      onError: (err) => {
        toast({
          title: "Something went wrong",
          description:
            err.message || "There was a problem updating account's re-signup",
          variant: "destructive",
          duration: 3000,
        });
      },
      onMutate: ({ accountId }) => {
        setCurrentlyPendingID(accountId);
      },
      onSettled: () => {
        setCurrentlyPendingID(null);
      },
    });

  const pendingConfirm = (pendingID: string) => {
    setCurrentlyPendingID(pendingID);
    pendingUpdate({accountId: pendingID });
    pendingClose();
  };

  const { mutate: deleteAccount, isLoading: deleteLoading } =
    trpc.adminDeleteAccount.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You successfully deleted this user account",
          variant: "default",
          duration: 3000,
        });
        router.refresh();
      },
      onError: (err) => {
        toast({
          title: "Something went wrong",
          description:
            err.message || "There was a problem deleting this user account",
          variant: "destructive",
          duration: 3000,
        });
      },
      onMutate: ({ accountId }) => {
        setCurrentlyDeletingID(accountId);
      },
      onSettled: () => {
        setCurrentlyDeletingID(null);
      },
    });

  const deleteConfirm = (accountId: string) => {
    setCurrentlyDeletingID(accountId);
    deleteAccount({ accountId});
  };
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <div
            className="flex justify-start items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Registered Date
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
      accessorKey: "name",
      header: "Employer Name",
      cell: ({ row }) => (
        <div className="capitalize text-sm font-normal">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Employer Email",
      cell: ({ row }) => (
        <div className="text-sm font-normal">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "referralCode",
      header: () => (
        <div className=" flex justify-center items-center">Referral Code</div>
      ),
      cell: ({ row }) => (
        <div className="font-normal text-sm flex justify-center items-center">
          {row.getValue("referralCode")}
        </div>
      ),
    },
    {
      accessorKey: "emailVerified",
      header: ({ column }) => {
        return (
          <div
            className="flex justify-center items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Verified
            <ArrowUpDown className="ml-0.5 h-4 w-4 shrink-0" />
          </div>
        );
      },
      cell: ({ row }) => {
        const emailVerified = row.getValue("emailVerified");

        const formatted =
          emailVerified === false ? (
            <div className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              <span>Pending</span>
            </div>
          ) : (
            <div className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              <span>Verified</span>
            </div>
          );

        return (
          <div className="font-normal text-sm flex justify-center items-center">
            {formatted}
          </div>
        );
      },
    },

    {
      accessorKey: "special",
      header: () => {
        return (
          <div className="flex justify-center items-center">Special User</div>
        );
      },
      cell: ({ row }) => {
        const special = row.getValue("special");

        const formatted =
          special === false ? (
            <div className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              <span>Ordinary</span>
            </div>
          ) : (
            <div className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              <span>Special</span>
            </div>
          );

        return (
          <div className="font-normal text-sm flex justify-center items-center">
            {formatted}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <div className=" flex justify-center items-center">Actions</div>
      ),
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="font-normal text-sm flex justify-center items-center">
            {currentlyPendingID === user.id && (
              <DeletePendingAlertModal
                isOpen={pendingOpen}
                onClose={pendingClose}
                loading={pendingLoading}
                onConfirm={() => pendingConfirm(user.id)}
              />
            )}
            {currentlyDeletingID === user.id && (
              <DeleteAccountAlertModal
                isOpen={deleteOpen}
                loading={deleteLoading}
                onClose={deleteClose}
                onConfirm={() => deleteConfirm(user.id)}
              />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={
                    currentlyDeletingID === user.id ||
                    currentlyPendingID === user.id
                  }
                  variant="ghost"
                  className="h-5 w-8 p-0 rounded-sm"
                >
                  <span className="sr-only">Open menu</span>
                  {currentlyDeletingID === user.id && deleteLoading ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  ) : currentlyPendingID === user.id && pendingLoading ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  ) : (
                    <MoreVertical className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-gray-800">
                  Detailed Actions
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <span
                    className="text-gray-600 flex items-center"
                    onClick={() => toggleOpen(user.id)}
                  >
                    <CircleEllipsis className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    Pending Signup
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span
                    className="text-gray-600 flex items-center"
                    onClick={() => toggleDelete(user.id)}
                  >
                    <Trash className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    Delete Account
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
    <div className="w-full mt-2">
      <div className=" flex flex-row items-center">
        <Link href={"/control/companies"} className="hover:text-[#005580]">
          <CornerUpLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 mr-1.5 sm:mr-2.5 shrink-0" />
        </Link>
        <h2 className="font-bold text-gray-600 tracking-tight text-xl sm:text-2xl">
          Employers Stats
        </h2>
      </div>
      <div className="mt-3 mb-6">
        <div className="grid gap-2 sm:gap-4 grid-cols-2 xl:grid-cols-4">
          <Card className="border border-gray-200 rounded-md p-2 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base sm:text-sm flex items-center font-medium text-gray-600">
                <span className="hidden sm:flex">Total Employers</span>
                <span className="flex sm:hidden">Total Employers</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 ml-1 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent className="text-gray-500 tracking-normal">
                      <p className="text-gray-500 leading-tight text-xs font-normal">
                        Total of{" "}
                        <span className="font-semibold">
                          {combinedData.length}
                        </span>{" "}
                        employer(s), the month of{" "}
                        <span className="font-semibold">{fullMonthName}</span>{" "}
                        accounts for{" "}
                        <span className="font-semibold">{countEmployers}</span>{" "}
                        employer(s) sign up leading to{" "}
                        <span className="font-semibold">
                          {percentageEmployers}
                        </span>{" "}
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
                +{combinedData.length}
              </div>
              <p className="text-xs tracking-tight flex items-center gap-x-1 text-muted-foreground">
                <span>
                  {parseInt(percentageEmployers) > 0 ||
                  percentageEmployers === "∞" ? (
                    <span className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      <TrendingUp className="h-4 w-4 mr-0.5" />
                      {percentageEmployers}
                    </span>
                  ) : percentageEmployers === "0%" ? (
                    <span className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      <MoveRight className="h-4 w-4 mr-0.5" />
                      {percentageEmployers}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                      <TrendingDown className="h-4 w-4 mr-0.5" />
                      {percentageEmployers}
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
                <span className="hidden sm:flex">Week Employers</span>
                <span className="flex sm:hidden">Week Employers</span>
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
                        and ending
                        <span className="font-semibold">
                          {" "}
                          {formattedEndDate}
                        </span>{" "}
                        has{" "}
                        <span className="font-semibold">
                          {countEmployerWeek}
                        </span>{" "}
                        employer(s) representing{" "}
                        <span className="font-semibold">
                          {percentageEmployerWeek}
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
                +{countEmployerWeek}
              </div>
              <p className="text-xs tracking-tight flex items-center gap-x-1 text-muted-foreground">
                <span>
                  {parseInt(percentageEmployerWeek) > 0 ||
                  percentageEmployerWeek === "∞" ? (
                    <span className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      <TrendingUp className="h-4 w-4 mr-0.5" />
                      {percentageEmployerWeek}
                    </span>
                  ) : percentageEmployerWeek === "0%" ? (
                    <span className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      <MoveRight className="h-4 w-4 mr-0.5" />
                      {percentageEmployerWeek}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                      <TrendingDown className="h-4 w-4 mr-0.5" />
                      {percentageEmployerWeek}
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
                <span className="hidden sm:flex">Referred</span>
                <span className="flex sm:hidden">Referred Workers</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 ml-1 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent className="text-gray-500 tracking-normal">
                      <p className="text-gray-500 text-xs leading-tight font-normal">
                        With{" "}
                        <span className="font-semibold">
                          {countEmployerSuccess}
                        </span>{" "}
                        employer(s) having been referred, this month of{" "}
                        {fullMonthName} has{" "}
                        <span className="font-semibold">
                          {countEmployerSuccess}
                        </span>{" "}
                        employer(s) being applied externally representing{" "}
                        <span className="font-semibold">
                          {percentageEmployerSuccess}
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
                +{countEmployerSuccess}
              </div>
              <p className="text-xs tracking-tight flex items-center gap-x-1 text-muted-foreground">
                <span>
                  {parseInt(percentageEmployerSuccess) > 0 ||
                  percentageEmployerSuccess === "∞" ? (
                    <span className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      <TrendingUp className="h-4 w-4 mr-0.5" />
                      {percentageEmployerSuccess}
                    </span>
                  ) : percentageEmployerSuccess === "0%" ? (
                    <span className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      <MoveRight className="h-4 w-4 mr-0.5" />
                      {percentageEmployerSuccess}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                      <TrendingDown className="h-4 w-4 mr-0.5" />
                      {percentageEmployerSuccess}
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
                <span className="hidden sm:flex">New Employers</span>
                <span className="flex sm:hidden">New Employers</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 ml-1 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent className="text-gray-500 tracking-normal">
                      <p className="text-gray-500 text-xs leading-tight font-normal">
                        Total of{" "}
                        <span className="font-semibold">
                          {countEmployerPending}
                        </span>{" "}
                        new employer(s), today {day} has{" "}
                        <span className="font-semibold">
                          {countEmployerPending}
                        </span>{" "}
                        employer(s) representing{" "}
                        <span className="font-semibold">
                          {percentageEmployerPending}
                        </span>{" "}
                        change comparing to yesterday&apos;s jobs!
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
                +{countEmployerPending}
              </div>
              <p className="text-xs tracking-tight flex items-center gap-x-1 text-muted-foreground">
                <span>
                  {parseInt(percentageEmployerPending) > 0 ||
                  percentageEmployerPending === "∞" ? (
                    <span className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      <TrendingUp className="h-4 w-4 mr-0.5" />
                      {percentageEmployerPending}
                    </span>
                  ) : percentageEmployerPending === "0%" ? (
                    <span className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      <MoveRight className="h-4 w-4 mr-0.5" />
                      {percentageEmployerPending}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                      <TrendingDown className="h-4 w-4 mr-0.5" />
                      {percentageEmployerPending}
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
      <Input
        placeholder="Search for an employer"
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value)
        }
        className="w-full mb-1 sm:max-w-sm"
      />
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
              Employers Overview
            </CardTitle>
            <CardDescription className="text-xs">
              You have {countEmployers} employer(s) registered in the month of{" "}
              {fullMonthName}, which represent {percentageEmployers} change.
            </CardDescription>
          </CardHeader>
          <CardContent className="-ml-6">
            <BarCharts employers={combinedData} />
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3 border border-gray-200 rounded-md pt-2 px-2">
          <CardHeader className="mb-4">
            <CardTitle className="text-gray-600 text-xl">
              Category Overview
            </CardTitle>
            <CardDescription className="text-xs">
              There are {countEmployerSuccess} referred employers.
            </CardDescription>
          </CardHeader>
          <CardContent className="-ml-6">
            <TheLineCharts employers={combinedData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
