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
  Banknote,
  ChevronLeft,
  ChevronRight,
  CornerUpLeft,
  ExternalLink,
  Loader2,
  MoreHorizontal,
  Trash,
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
import { RedeemedHistoryAlertModal } from "../models/referrals/RedeemedHistoryModal";

interface CombinedDataItems {
  id: string;
  fullName: string;
  paymentID: string;
  phoneNumber: string;
  paymentDate: Date;
  paymentPhone: string;
  userId: string;
  email: string;
  availablePoints: number;
  subtotal: number;
  tax: number;
  transactionFee: number;
  totalPayable: number;
  paid: boolean;
  hide: boolean;
  createdAt: Date;
}

interface RedeemHistoryProps {
  history: CombinedDataItems[];
}

export function RedeemHistory({ history }: RedeemHistoryProps) {
  const data = history;
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams?.get("origin");
  const { toast } = useToast();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [redeemOpen, setRedeemOpen] = React.useState<boolean>(false);
  const [currentlyOpeningRedeem, setCurrentlyOpeningRedeem] = React.useState<
    string | null
  >(null);
  const redeemClose = () => {
    setRedeemOpen((prev) => !prev);
    setCurrentlyOpeningRedeem(null);
  };

  const redeemConfirm = () => {
    setRedeemOpen((prev) => !prev);
    setCurrentlyOpeningRedeem(null);
  };

  const toggleRedeem = (redeemID: string) => {
    setCurrentlyOpeningRedeem(redeemID);
    setRedeemOpen(true);
  };

  const [
    currentlyDeletingRedeemHistoryID,
    setCurrentlyDeletingRedeemHistoryID,
  ] = React.useState<string | null>(null);

  const [deleteHistoryOpen, setDeleteHistoryOpen] =
    React.useState<boolean>(false);
  const deleteClose = () => {
    setCurrentlyDeletingRedeemHistoryID(null);
    setDeleteHistoryOpen((prev) => !prev);
  };

  const toggleDelete = (redeemID: string) => {
    setCurrentlyDeletingRedeemHistoryID(redeemID);
    setDeleteHistoryOpen(true);
  };

  const { mutate: deleteHistory, isLoading } =
    trpc.workerDeleteRedeemHistory.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You successfully deleted a redeem history",
          variant: "default",
          duration: 3000,
        });
        setDeleteHistoryOpen(false);
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
              "There was a problem deleting your redeem history. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
        setDeleteHistoryOpen(false);
      },
      onMutate: ({ redeemID }) => {
        setCurrentlyDeletingRedeemHistoryID(redeemID);
      },
      onSettled: () => {
        setCurrentlyDeletingRedeemHistoryID(null);
      },
    });

  const deleteConfirm = (redeemID: string) => {
    setCurrentlyDeletingRedeemHistoryID(redeemID);
    deleteHistory({
      redeemID: redeemID,
    });
  };

  const columns: ColumnDef<CombinedDataItems, keyof CombinedDataItems>[] = [
    {
      accessorKey: "createdAt",
      header: "Date Requested",
      cell: ({ row }) => {
        const date: Date = row.getValue("createdAt");
        return <div className="font-normal text-sm">{format(date, "PPP")}</div>;
      },
    },
    {
      accessorKey: "paymentID",
      header: "Payment ID",
      cell: ({ row }) => (
        <div className="text-sm font-normal">{row.getValue("paymentID")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email Address",
      cell: ({ row }) => (
        <div className="text-sm font-normal">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "fullName",
      header: "Full Name",
      cell: ({ row }) => (
        <div className="text-sm font-normal">{row.getValue("fullName")}</div>
      ),
    },
    {
      accessorKey: "availablePoints",
      header: "Points",
      cell: ({ row }) => (
        <div className="text-sm font-normal">
          {row.getValue("availablePoints")}
        </div>
      ),
    },
    {
      accessorKey: "totalPayable",
      header: "Amount",
      cell: ({ row }) => (
        <div className="text-sm font-normal">
          Ksh.{row.getValue("totalPayable")}
        </div>
      ),
    },
    {
      accessorKey: "paid",
      header: "Status",
      cell: ({ row }) => {
        const paid = row.getValue("paid");

        const formatted =
          paid === true ? (
            <div className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              <span>Paid</span>
            </div>
          ) : (
            <div className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              <span>Pending</span>
            </div>
          );

        return <div className="text-sm font-normal">{formatted}</div>;
      },
    },
    {
      accessorKey: "paymentDate",
      header: "Payment Date",
      cell: ({ row }) => {
        const date: Date = row.getValue("paymentDate");
        return <div suppressHydrationWarning className="font-normal text-sm">{format(date, "PPP")}</div>;
      },
    },
    {
      id: "actions",
      header: () => (
        <div className=" flex justify-center items-center">Actions</div>
      ),
      enableHiding: false,
      cell: ({ row }) => {
        const redeem = row.original;
        return (
          <div className="font-normal text-sm flex justify-center items-center">
            {currentlyOpeningRedeem === redeem.id && (
              <RedeemedHistoryAlertModal
                isOpen={redeemOpen}
                onClose={redeemClose}
                onConfirm={redeemConfirm}
                redeem={redeem}
              />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={
                    currentlyDeletingRedeemHistoryID === redeem.id && isLoading
                  }
                  variant="ghost"
                  className="h-5 w-8 p-0 rounded-sm"
                >
                  <span className="sr-only">Open menu</span>
                  {currentlyDeletingRedeemHistoryID === redeem.id &&
                  isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  ) : (
                    <MoreHorizontal className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-gray-800">
                  Redeem Actions
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <span
                    onClick={() => toggleRedeem(redeem.id)}
                    className="text-gray-600 flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    View History
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span
                    onClick={() => toggleRedeem(redeem.id)}
                    className="text-gray-600 flex items-center"
                  >
                    <Banknote className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    Make Payment
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span
                    onClick={() => toggleDelete(redeem.id)}
                    className="text-gray-600 flex items-center"
                  >
                    <Trash className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    Delete History
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
      <div className="mt-4">
        <p className="text-sm text-gray-700 font-normal">
          This includes workers&apos; redeemable credit points. Redeemed amounts are
          disbursed to recipients via M-Pesa every Thursday.
        </p>
        <div className="rounded-lg border mt-1 bg-white">
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
                    No redeem requests yet.
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
