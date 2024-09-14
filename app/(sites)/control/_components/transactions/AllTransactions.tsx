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
import {
  Activity,
  ArrowUpDown,
  BarChartBig,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Coins,
  CreditCard,
  Info,
  ListTodo,
  Mail,
  MoreHorizontal,
  MoveRight,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { format, endOfWeek, startOfWeek } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TransactionMessageAlertModal from "../models/transactions/TransactionMessage";

interface AllTransactionsItems {
  id: string;
  userId: string;
  isEmployerID: string;
  fullName: string;
  userEmail: string;
  mPesaID: string;
  companyID: string;
  companyName: string;
  paymentPhone: string;
  amount: number;
  createdAt: Date;
}

interface AllTransactionsProps {
  payments: AllTransactionsItems[];
  countPayments: number;
  percentagePayments: string;
  countPaymentSuccess: number;
  percentagePaymentSuccess: string;
  countPaymentWeek: number;
  percentagePaymentWeek: string;
  countPaymentPending: number;
  percentagePaymentPending: string;
}

export function AllTransactions({
  payments,
  countPayments,
  percentagePayments,
  countPaymentSuccess,
  percentagePaymentSuccess,
  countPaymentWeek,
  percentagePaymentWeek,
  countPaymentPending,
  percentagePaymentPending,
}: AllTransactionsProps) {
  const data = payments;
  const date = new Date();
  const fullMonthName = format(date, "MMMM");
  const startWeek = startOfWeek(date);
  const endWeek = endOfWeek(date);
  const day = format(date, "dd/MMMM");
  const formattedStartDate = format(startWeek, "dd/MMM");
  const formattedEndDate = format(endWeek, "dd/MMM");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [currentlyOpeningPaymentID, setCurrentlyOpeningPaymentID] =
    React.useState<null | string>(null);
  const [messagingOpen, setMessagingOpen] = React.useState<boolean>(false);
  const messageClose = () => {
    setMessagingOpen((prev) => !prev);
    setCurrentlyOpeningPaymentID(null);
  };

  const toggleMessage = (paymentID: string) => {
    setMessagingOpen(true);
    setCurrentlyOpeningPaymentID(paymentID);
  };

  const messageConfirm = () => {
    setMessagingOpen((prev) => !prev);
    setCurrentlyOpeningPaymentID(null);
  };

  const columns: ColumnDef<AllTransactionsItems, keyof AllTransactionsItems>[] =
    [
      {
        accessorKey: "createdAt",
        header: "Transaction Date",
        cell: ({ row }) => {
          const date: Date = row.getValue("createdAt");
          return (
            <div suppressHydrationWarning className="font-normal text-sm">{format(date, "PPP")}</div>
          );
        },
      },
      {
        accessorKey: "createdAtTime",
        header: () => {
          return <div className="flex justify-center items-center">Time</div>;
        },
        cell: ({ row }) => {
          const date: Date = row.getValue("createdAt");
          return (
            <div suppressHydrationWarning className="text-sm font-normal flex justify-center items-center">
              {format(date, "HH:mm")}h
            </div>
          );
        },
      },
      {
        accessorKey: "fullName",
        header: "Full Name",
        cell: ({ row }) => (
          <div className="text-sm font-normal">{row.getValue("fullName")}</div>
        ),
      },
      {
        accessorKey: "userEmail",
        header: ({ column }) => {
          return (
            <div
              className="flex justify-start items-center"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Email Address
              <ArrowUpDown className="ml-0.5 h-4 w-4 shrink-0" />
            </div>
          );
        },
        cell: ({ row }) => (
          <div className="text-sm font-normal flex justify-start items-center">
            {row.getValue("userEmail")}
          </div>
        ),
      },
      {
        accessorKey: "mPesaID",
        header: () => {
          return (
            <div className="flex justify-center items-center">
              TransactionID
            </div>
          );
        },
        cell: ({ row }) => (
          <div className="text-sm font-normal flex justify-center items-center">
            {row.getValue("mPesaID")}
          </div>
        ),
      },
      {
        accessorKey: "paymentPhone",
        header: () => {
          return (
            <div className="flex justify-center items-center">Phone Number</div>
          );
        },
        cell: ({ row }) => (
          <div className="text-sm font-normal flex justify-center items-center">
            {row.getValue("paymentPhone")}
          </div>
        ),
      },
      {
        accessorKey: "amount",
        header: ({ column }) => {
          return (
            <div
              className="flex justify-center items-center"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Amount
              <ArrowUpDown className="ml-0.5 h-4 w-4 shrink-0" />
            </div>
          );
        },
        cell: ({ row }) => (
          <div className="text-sm font-normal flex justify-center items-center">
            {row.getValue("amount")}
          </div>
        ),
      },
      {
        id: "actions",
        header: () => (
          <div className=" flex justify-center items-center">Actions</div>
        ),
        enableHiding: false,
        cell: ({ row }) => {
          const receipt = row.original;
          return (
            <div className="font-normal text-sm flex justify-center items-center">
              {currentlyOpeningPaymentID === receipt.id && (
                <TransactionMessageAlertModal 
                  isOpen={messagingOpen}
                  onClose={messageClose}
                  onConfirm={messageConfirm}
                  companyID={receipt.companyID}
                  companyName={receipt.companyName}
                />
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-5 w-8 p-0 rounded-sm">
                    <MoreHorizontal className="h-4 w-4 shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuLabel className="text-gray-800">
                    Payment Actions
                  </DropdownMenuLabel>
                  <DropdownMenuItem>
                    <span
                      onClick={() => toggleMessage(receipt.id)}
                      className="text-gray-600 flex items-center"
                    >
                      <Mail className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                      Message User
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
      <div className="mt-1">
        <div className="mt-3 mb-4">
          <div className="grid gap-2 sm:gap-4 grid-cols-2 xl:grid-cols-4">
            <Card className="border border-gray-200 rounded-md p-2 sm:p-6">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base sm:text-sm flex items-center font-medium text-gray-600">
                  <span className="hidden sm:flex">Total Payments</span>
                  <span className="flex sm:hidden">Total Payments</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 ml-1 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent className="text-gray-500 tracking-normal">
                        <p className="text-gray-500 leading-tight text-xs font-normal">
                          Total of{" "}
                          <span className="font-semibold">
                            {payments.length}
                          </span>{" "}
                          payment(s), the month of{" "}
                          <span className="font-semibold">{fullMonthName}</span>{" "}
                          accounts for{" "}
                          <span className="font-semibold">{countPayments}</span>{" "}
                          payment(s) received leading to{" "}
                          <span className="font-semibold">
                            {percentagePayments}
                          </span>{" "}
                          change comparing to last month!
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
                <span className="hidden sm:inline-flex items-center rounded-sm bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  <WalletCards className="h-6 w-6 font-normal" />
                </span>
              </CardHeader>
              <CardContent>
                <div className="text-xl py-1 sm:text-2xl font-bold">
                  Ksh.{countPayments}
                </div>
                <p className="text-xs tracking-tight flex items-center gap-x-1 text-muted-foreground">
                  <span>
                    {parseInt(percentagePayments) > 0 ||
                    percentagePayments === "∞" ? (
                      <span className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        <TrendingUp className="h-4 w-4 mr-0.5" />
                        {percentagePayments}
                      </span>
                    ) : percentagePayments === "0%" ? (
                      <span className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        <MoveRight className="h-4 w-4 mr-0.5" />
                        {percentagePayments}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                        <TrendingDown className="h-4 w-4 mr-0.5" />
                        {percentagePayments}
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
                  <span className="hidden sm:flex">Week Payment</span>
                  <span className="flex sm:hidden">Week Payment</span>
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
                          ending
                          <span className="font-semibold">
                            {formattedEndDate}
                          </span>{" "}
                          has{" "}
                          <span className="font-semibold">
                            {countPaymentWeek}
                          </span>{" "}
                          payment(s) representing{" "}
                          <span className="font-semibold">
                            {percentagePaymentWeek}
                          </span>{" "}
                          change comparing to previous month!
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
                <span className="hidden sm:inline-flex items-center rounded-sm bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  <CreditCard className="h-6 w-6 font-normal" />
                </span>
              </CardHeader>
              <CardContent>
                <div className="text-xl py-1 sm:text-2xl font-bold">
                  Ksh.{countPaymentWeek}
                </div>
                <p className="text-xs tracking-tight flex items-center gap-x-1 text-muted-foreground">
                  <span>
                    {parseInt(percentagePaymentWeek) > 0 ||
                    percentagePaymentWeek === "∞" ? (
                      <span className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        <TrendingUp className="h-4 w-4 mr-0.5" />
                        {percentagePaymentWeek}
                      </span>
                    ) : percentagePaymentWeek === "0%" ? (
                      <span className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        <MoveRight className="h-4 w-4 mr-0.5" />
                        {percentagePaymentWeek}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                        <TrendingDown className="h-4 w-4 mr-0.5" />
                        {percentagePaymentWeek}
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
                  <span className="hidden sm:flex">+6K Payment</span>
                  <span className="flex sm:hidden">+6K Payment</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 ml-1 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent className="text-gray-500 tracking-normal">
                        <p className="text-gray-500 text-xs leading-tight font-normal">
                          With{" "}
                          <span className="font-semibold">
                            {countPaymentSuccess}
                          </span>{" "}
                          payment(s) above 6K this month of {fullMonthName} has{" "}
                          <span className="font-semibold">
                            {countPaymentSuccess}
                          </span>{" "}
                          payment(s) above 6K representing
                          <span className="font-semibold">
                            {percentagePaymentSuccess}
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
                <div className="text-xl py-1 sm:text-2xl font-bold">
                  +{countPaymentSuccess}
                </div>
                <p className="text-xs tracking-tight flex items-center gap-x-1 text-muted-foreground">
                  <span>
                    {parseInt(percentagePaymentSuccess) > 0 ||
                    percentagePaymentSuccess === "∞" ? (
                      <span className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        <TrendingUp className="h-4 w-4 mr-0.5" />
                        {percentagePaymentSuccess}
                      </span>
                    ) : percentagePaymentSuccess === "0%" ? (
                      <span className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        <MoveRight className="h-4 w-4 mr-0.5" />
                        {percentagePaymentSuccess}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                        <TrendingDown className="h-4 w-4 mr-0.5" />
                        {percentagePaymentSuccess}
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
                  <span className="hidden sm:flex">New Payments</span>
                  <span className="flex sm:hidden">New Payments</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 ml-1 text-gray-500" />
                      </TooltipTrigger>
                      <TooltipContent className="text-gray-500 tracking-normal">
                        <p className="text-gray-500 text-xs leading-tight font-normal">
                          Total of{" "}
                          <span className="font-semibold">
                            {countPaymentPending}
                          </span>{" "}
                          new payment(s), today {day} has{" "}
                          <span className="font-semibold">
                            {countPaymentPending}
                          </span>{" "}
                          payment(s) representing{" "}
                          <span className="font-semibold">
                            {percentagePaymentPending}
                          </span>{" "}
                          change comparing to yesterday!
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
                <span className="hidden sm:inline-flex items-center rounded-sm bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  <Coins className="h-6 w-6 font-normal" />
                </span>
              </CardHeader>
              <CardContent>
                <div className="text-xl py-1 sm:text-2xl font-bold">
                  Ksh.{countPaymentPending}
                </div>
                <p className="text-xs tracking-tight flex items-center gap-x-1 text-muted-foreground">
                  <span>
                    {parseInt(percentagePaymentPending) > 0 ||
                    percentagePaymentPending === "∞" ? (
                      <span className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        <TrendingUp className="h-4 w-4 mr-0.5" />
                        {percentagePaymentPending}
                      </span>
                    ) : percentagePaymentPending === "0%" ? (
                      <span className="inline-flex items-center rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        <MoveRight className="h-4 w-4 mr-0.5" />
                        {percentagePaymentPending}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                        <TrendingDown className="h-4 w-4 mr-0.5" />
                        {percentagePaymentPending}
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
        <div className="rounded-lg border mt-2 bg-white">
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
                    No record found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
