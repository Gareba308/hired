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
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Mail,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import "@/lib/suppressHydration"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TransactionMessageAlertModal from "../models/transactions/TransactionMessage";

interface AllAccountsItems {
  id: string;
  userId: string;
  fullName: string;
  isEmployerID: string;
  planID: string;
  companyID: string;
  companyName: string;
  planPrice: number;
  planName: string;
  invoiceID: string;
  planUnits: number;
  createdAt: Date;
}

interface AllAccountsProps {
  purchases: AllAccountsItems[];
}

export function AllAccounts({ purchases }: AllAccountsProps) {
  const data = purchases;
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

  const columns: ColumnDef<AllAccountsItems, keyof AllAccountsItems>[] = [
    {
      accessorKey: "createdAt",
      header: "Purchase Date",
      cell: ({ row }) => {
        const date: Date = row.getValue("createdAt");
        return <div className="font-normal text-sm">{format(date, "PPP")}</div>;
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
          <div className="text-sm font-normal flex justify-center items-center">
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
      accessorKey: "invoiceID",
      header: "Invoice ID",
      cell: ({ row }) => (
        <div className="text-sm font-normal">{row.getValue("invoiceID")}</div>
      ),
    },
    {
      accessorKey: "planName",
      header: () => {
        return (
          <div className="flex justify-center items-center">Plan Name</div>
        );
      },
      cell: ({ row }) => (
        <div className="text-sm font-normal flex justify-center items-center">
          {row.getValue("planName")}
        </div>
      ),
    },
    {
      accessorKey: "planPrice",
      header: ({ column }) => {
        return (
          <div
            className="flex justify-center items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Charges
            <ArrowUpDown className="ml-0.5 h-4 w-4 shrink-0" />
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-sm font-normal flex justify-center items-center">
          Ksh. {row.getValue("planPrice")}
        </div>
      ),
    },
    {
      accessorKey: "planUnits",
      header: ({ column }) => {
        return (
          <div
            className="flex justify-center items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Unit
            <ArrowUpDown className="ml-0.5 h-4 w-4 shrink-0" />
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-sm font-normal flex justify-center items-center">
          {row.getValue("planUnits")}
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
        const purchase = row.original;
        return (
          <div className="font-normal text-sm flex justify-center items-center">
            {currentlyOpeningPaymentID === purchase.id && (
                <TransactionMessageAlertModal
                  isOpen={messagingOpen}
                  onClose={messageClose}
                  onConfirm={messageConfirm}
                  companyID={purchase.companyID}
                  companyName={purchase.companyName}
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
                  Purchase Actions
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <span
                    onClick={() => toggleMessage(purchase.id)}
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
      <div className="mt-3">
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
