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
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  Loader2,
  MoreHorizontal,
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
import { Input } from "@/components/ui/input";
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
import { ApproveEmployerCreditAlertModal } from "../models/referrals/ApproveEmployerCredit";

interface CombinedDataItems {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  inviteeEmail: string;
  inviteeName: string | null;
  redeemed: boolean;
  credit: number;
  uniqueCode: string;
  myRole: string;
  hide: boolean;
  invitationCode: string | null;
  joined: boolean;
  approved: boolean;
  failed: boolean;
  createdAt: Date;
}

interface EmployerReferralsProps {
  combinedData: CombinedDataItems[];
}

export function EmployerReferrals({ combinedData }: EmployerReferralsProps) {
  const data = combinedData;
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams?.get("origin");
  const { toast } = useToast();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [currentlyApprovingID, setCurrentlyApprovingID] = React.useState<
    string | null
  >(null);

  const [approvalOpen, setApprovalOpen] = React.useState<boolean>(false);

  const approveClose = () => {
    setApprovalOpen((prev) => !prev);
    setCurrentlyApprovingID(null);
  };

  const toggleApproval = (referralID: string) => {
    setCurrentlyApprovingID(referralID);
    setApprovalOpen(true);
  };

  const { mutate: approvingCredit, isLoading: approveLoading } =
    trpc.adminApproveEmployerCredit.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description:
            "This referral credit's approval detail has been captured.",
          variant: "default",
          duration: 3000,
        });
        setCurrentlyApprovingID(null)
        setApprovalOpen(false);
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
              "There was a problem capturing this employer's credit approval details",
            duration: 3000,
            variant: "destructive",
          });
        }
        setCurrentlyApprovingID(null)
        setApprovalOpen(false);
      },
      onMutate: ({ referralID }) => {
        setCurrentlyApprovingID(referralID);
      },
      onSettled: () => {
        setCurrentlyApprovingID(null);
      },
    });

  const submitApproval = (referralID: string) => {
    setCurrentlyApprovingID(referralID);
    approvingCredit({ referralID: referralID });
  };
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<CombinedDataItems, keyof CombinedDataItems>[] = [
    {
      accessorKey: "createdAt",
      header: "Referred Date",
      cell: ({ row }) => {
        const date: Date = row.getValue("createdAt");
        return <div suppressHydrationWarning className="font-normal text-sm">{format(date, "PPP")}</div>;
      },
    },
    {
      accessorKey: "inviteeName",
      header: "Invitee Name",
      cell: ({ row }) => (
        <div className="capitalize text-sm font-normal">
          {row.getValue("inviteeName")}
        </div>
      ),
    },
    {
      accessorKey: "inviteeEmail",
      header: "Invitee Email",
      cell: ({ row }) => (
        <div className=" text-sm font-normal">
          {row.getValue("inviteeEmail")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Inviter Email",
      cell: ({ row }) => (
        <div className="capitalize text-sm font-normal">
          {row.getValue("email")}
        </div>
      ),
    },
    {
      id: "credit",
      enableHiding: false,
      header: "Credit",
      cell: ({ row }) => {
        const { approved, failed, credit } = row.original;

        let formatted;
        switch (true) {
          case approved === true && failed === false:
            formatted = (
              <div className="text-[14px] font-medium text-emerald-600">
                <span>Ksh.{credit}</span>
              </div>
            );
            break;
          case approved === false && failed === true:
          case approved === true && failed === true:
            formatted = (
              <div className="text-[14px] font-medium text-red-700">
                <span>Ksh.{credit}</span>
              </div>
            );
            break;
          default:
            formatted = (
              <div className="text-[14px] font-medium text-gray-700">
                <span>Ksh.{credit}</span>
              </div>
            );
            break;
        }

        return <div className="text-sm font-normal">{formatted}</div>;
      },
    },
    {
      id: "approved",
      enableHiding: false,
      header: "Approval",
      cell: ({ row }) => {
        const { approved, failed } = row.original;

        let formatted;
        switch (true) {
          case approved === true && failed === false:
            formatted = (
              <div className="inline-flex items-center rounded-sm bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                <span>Passed</span>
              </div>
            );
            break;
          case approved === false && failed === true:
          case approved === true && failed === true:
            formatted = (
              <div className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                <span>Failed</span>
              </div>
            );
            break;
          default:
            formatted = (
              <div className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ">
                <span>Pending</span>
              </div>
            );
            break;
        }

        return <div className="text-sm font-normal">{formatted}</div>;
      },
    },
    {
      accessorKey: "joined",
      header: "Status",
      cell: ({ row }) => {
        const joined = row.getValue("joined");

        const formatted =
          joined === true ? (
            <div className="inline-flex items-center rounded-sm bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
              <span>Joined</span>
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
        <div className=" flex justify-center items-center">View</div>
      ),
      enableHiding: false,
      cell: ({ row }) => {
        const data = row.original;
        return (
          <div className="font-normal text-sm flex justify-center items-center">
            {currentlyApprovingID === data.id && (
              <ApproveEmployerCreditAlertModal
                isOpen={approvalOpen}
                onClose={approveClose}
                onConfirm={() => submitApproval(data.id)}
                loading={approveLoading}
              />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-5 w-8 p-0 rounded-sm">
                  <span className="sr-only">Open menu</span>
                  {currentlyApprovingID === data.id && approveLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MoreHorizontal className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-gray-800">
                  Referral Actions
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <span
                    onClick={() => toggleApproval(data.id)}
                    className="text-gray-600 flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    Verify Approval
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
      <div className="flex items-center mt-4 justify-between gap-x-4 py-1">
        <Input
          placeholder="Search for an inviter email"
          value={
            (table.getColumn("email")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="w-full sm:max-w-sm"
        />
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
