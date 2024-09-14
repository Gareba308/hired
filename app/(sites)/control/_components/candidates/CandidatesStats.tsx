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
  Trash,
  ArchiveRestore,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  CornerUpLeft,
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
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarCharts } from "./BarChart";
import { TheLineCharts } from "./LineChart";
import Link from "next/link";

interface UserWithApplicationCount extends User {
  applicationCount: number;
}
interface CandidatesStatsProps {
  combinedData: UserWithApplicationCount[];
  countWorkers: number;
  percentageWorkers: string;
  countWorkerSuccess: number;
  percentageWorkerSuccess: string;
  countWorkerWeek: number;
  percentageWorkerWeek: string;
  countWorkerPending: number;
  percentageWorkerPending: string;
}

export function CandidatesStats({
  combinedData,
  countWorkers,
  percentageWorkers,
  countWorkerSuccess,
  percentageWorkerSuccess,
  countWorkerWeek,
  percentageWorkerWeek,
  countWorkerPending,
  percentageWorkerPending,
}: CandidatesStatsProps) {
  const data = combinedData.map((user) => ({
    ...user,
  }));

  const date = new Date();
  const fullMonthName = format(date, "MMMM");
  const startWeek = startOfWeek(date);
  const endWeek = endOfWeek(date);
  const day = format(date, "dd/MMMM");
  const formattedStartDate = format(startWeek, "dd/MMM");
  const formattedEndDate = format(endWeek, "dd/MMM");
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "createdAt",
      header: "Published",
      cell: ({ row }) => {
        const date: Date = row.getValue("createdAt");

        return <div suppressHydrationWarning className="font-normal text-sm">{format(date, "PPP")}</div>;
      },
    },
    {
      accessorKey: "name",
      header: "Worker Name",
      cell: ({ row }) => (
        <div className="capitalize text-sm font-normal">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Worker Email",
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
      accessorKey: "applicationCount",
      header: () => (
        <div className=" flex justify-center items-center">Applied</div>
      ),
      cell: ({ row }) => (
        <div className="font-normal text-sm flex justify-center items-center">
          {row.getValue("applicationCount")}
        </div>
      ),
    },
    {
      accessorKey: "emailVerified",
      header: () => {
        return (
          <div className="flex justify-center items-center">Email Verified</div>
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
      accessorKey: "suspended",
      header: () => {
        return (
          <div className="flex justify-center items-center">Status</div>
        );
      },
      cell: ({ row }) => {
        const suspended = row.getValue("suspended");

        const formatted =
          suspended === true ? (
            <div className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10">
              <span>Suspended</span>
            </div>
          ) : (
            <div className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              <span>Active</span>
            </div>
          );

        return (
          <div className="font-normal text-sm flex justify-center items-center">
            {formatted}
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
        <Link href={"/control/candidates"} className="hover:text-[#005580]">
          <CornerUpLeft className="h-6 w-6 mr-2 shrink-0" />
        </Link>
        <h2 className="font-bold text-gray-600 tracking-tight text-xl sm:text-2xl">
          Workers Stats
        </h2>
      </div>
      <div className="mt-3 mb-6">
        <div className="grid gap-2 sm:gap-4 grid-cols-2 xl:grid-cols-4">
          <Card className="border border-gray-200 rounded-md p-2 sm:p-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base sm:text-sm flex items-center font-medium text-gray-600">
                <span className="hidden sm:flex">Total Workers</span>
                <span className="flex sm:hidden">Total</span>
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
                        worker(s), the month of{" "}
                        <span className="font-semibold">{fullMonthName}</span>{" "}
                        accounts for{" "}
                        <span className="font-semibold">{countWorkers}</span>{" "}
                        worker(s) received leading to{" "}
                        <span className="font-semibold">
                          {percentageWorkers}
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
                  {parseInt(percentageWorkers) > 0 ||
                  percentageWorkers === "∞" ? (
                    <span className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      <TrendingUp className="h-4 w-4 mr-0.5" />
                      {percentageWorkers}
                    </span>
                  ) : percentageWorkers === "0%" ? (
                    <span className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      <MoveRight className="h-4 w-4 mr-0.5" />
                      {percentageWorkers}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                      <TrendingDown className="h-4 w-4 mr-0.5" />
                      {percentageWorkers}
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
                <span className="hidden sm:flex">Week Workers</span>
                <span className="flex sm:hidden">Week Workers</span>
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
                          {fullMonthName}
                        </span>{" "}
                        has{" "}
                        <span className="font-semibold">{countWorkerWeek}</span>{" "}
                        worker(s) representing{" "}
                        <span className="font-semibold">
                          {percentageWorkerWeek}
                        </span>{" "}
                        change comparing to previous week!
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
                +{countWorkerWeek}
              </div>
              <p className="text-xs tracking-tight flex items-center gap-x-1 text-muted-foreground">
                <span>
                  {parseInt(percentageWorkerWeek) > 0 ||
                  percentageWorkerWeek === "∞" ? (
                    <span className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      <TrendingUp className="h-4 w-4 mr-0.5" />
                      {percentageWorkerWeek}
                    </span>
                  ) : percentageWorkerWeek === "0%" ? (
                    <span className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      <MoveRight className="h-4 w-4 mr-0.5" />
                      {percentageWorkerWeek}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                      <TrendingDown className="h-4 w-4 mr-0.5" />
                      {percentageWorkerWeek}
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
                          {countWorkerSuccess}
                        </span>{" "}
                        worker(s) having been referred, this month of{" "}
                        {fullMonthName} has{" "}
                        <span className="font-semibold">
                          {countWorkerSuccess}
                        </span>{" "}
                        worker(s) being applied externally representing{" "}
                        <span className="font-semibold">
                          {percentageWorkerSuccess}
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
                +{countWorkerSuccess}
              </div>
              <p className="text-xs tracking-tight flex items-center gap-x-1 text-muted-foreground">
                <span>
                  {parseInt(percentageWorkerSuccess) > 0 ||
                  percentageWorkerSuccess === "∞" ? (
                    <span className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      <TrendingUp className="h-4 w-4 mr-0.5" />
                      {percentageWorkerSuccess}
                    </span>
                  ) : percentageWorkerSuccess === "0%" ? (
                    <span className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      <MoveRight className="h-4 w-4 mr-0.5" />
                      {percentageWorkerSuccess}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                      <TrendingDown className="h-4 w-4 mr-0.5" />
                      {percentageWorkerSuccess}
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
                <span className="hidden sm:flex">New Workers</span>
                <span className="flex sm:hidden">New Workers</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 ml-1 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent className="text-gray-500 tracking-normal">
                      <p className="text-gray-500 text-xs leading-tight font-normal">
                        Total of{" "}
                        <span className="font-semibold">
                          {countWorkerPending}
                        </span>{" "}
                        new worker(s), today {day} has{" "}
                        <span className="font-semibold">
                          {countWorkerPending}
                        </span>{" "}
                        worker(s) representing{" "}
                        <span className="font-semibold">
                          {percentageWorkerPending}
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
                +{countWorkerPending}
              </div>
              <p className="text-xs tracking-tight flex items-center gap-x-1 text-muted-foreground">
                <span>
                  {parseInt(percentageWorkerPending) > 0 ||
                  percentageWorkerPending === "∞" ? (
                    <span className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      <TrendingUp className="h-4 w-4 mr-0.5" />
                      {percentageWorkerPending}
                    </span>
                  ) : percentageWorkerPending === "0%" ? (
                    <span className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      <MoveRight className="h-4 w-4 mr-0.5" />
                      {percentageWorkerPending}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                      <TrendingDown className="h-4 w-4 mr-0.5" />
                      {percentageWorkerPending}
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border border-gray-200 rounded-md pt-2 pb-4 px-2">
          <CardHeader className="mb-4">
            <CardTitle className="text-gray-600 text-xl">
              Workers Overview
            </CardTitle>
            <CardDescription className="text-xs">
              You have {countWorkers} worker(s) registered in the month of{" "}
              {fullMonthName}, which represent {percentageWorkers} change.
            </CardDescription>
          </CardHeader>
          <CardContent className="-ml-6">
            <BarCharts workers={combinedData} />
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3 border border-gray-200 rounded-md pt-2 px-2">
          <CardHeader className="mb-4">
            <CardTitle className="text-gray-600 text-xl">
              Category Overview
            </CardTitle>
            <CardDescription className="text-xs">
              There are {countWorkerSuccess} referred workers.
            </CardDescription>
          </CardHeader>
          <CardContent className="-ml-6">
            <TheLineCharts workers={combinedData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
