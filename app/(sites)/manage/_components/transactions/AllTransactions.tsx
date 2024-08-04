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
  ExternalLink,
  Loader2,
  Mail,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface AllTransactionsItems {
  id: string;
  userId: string;
  isEmployerID: string;
  mPesaID: string;
  paymentPhone: string;
  amount: number;
  createdAt: Date;
}

interface AllTransactionsProps {
  payments: AllTransactionsItems[];
}

export function AllTransactions({ payments }: AllTransactionsProps) {
  const data = payments;
  const router= useRouter()
  const {toast}= useToast()
  const [loading, setLoading] = React.useState<boolean>(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [currentlyOpeningID, setCurrentlyOpeningID] = React.useState<
    null | string
  >(null);
  const openReceipt = (receiptID: string) => {
    try {
      setCurrentlyOpeningID(receiptID);
      setLoading(true);
      router.push(`/manage/transactions/receipt/${receiptID}`);
      router.refresh();
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "We could not connect you to the receipt, try again later",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<AllTransactionsItems, keyof AllTransactionsItems>[] =
    [
      {
        accessorKey: "createdAt",
        header: "Transaction Date",
        cell: ({ row }) => {
          const date: Date = row.getValue("createdAt");
          return (
            <div className="font-normal text-sm">{format(date, "PPP")}</div>
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
            <div className="text-sm font-normal flex justify-center items-center">
              {format(date, "HH:mm")}h
            </div>
          );
        },
      },
      {
        accessorKey: "id",
        header: "Payment ID",
        cell: ({ row }) => (
          <div className="text-sm font-normal">{row.getValue("id")}</div>
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
          <div className=" flex justify-center items-center">Receipt</div>
        ),
        enableHiding: false,
        cell: ({ row }) => {
          const receipt = row.original;
          return (
            <div className="font-normal text-sm flex justify-center items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-5 w-8 p-0 rounded-sm">
                    <span className="sr-only">Open menu</span>
                    {currentlyOpeningID === receipt.id && loading ? (
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                    ) : (
                      <MoreHorizontal className="h-4 w-4 shrink-0" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuLabel className="text-gray-800">
                    Transaction Actions
                  </DropdownMenuLabel>
                  <DropdownMenuItem>
                    <span
                      onClick={() => openReceipt(receipt.id)}
                      className="text-gray-600 flex items-center"
                    >
                      <ExternalLink className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                      Check Receipt
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
