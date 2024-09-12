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
  ChevronLeft,
  ChevronRight,
  Gift,
  Loader2,
  MoreHorizontal,
  Trash,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import "@/lib/suppressHydration"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { useRouter} from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import { User, WorkerContact, WorkerCreditPoints } from "@prisma/client";
import { RedeemReferralCreditAlertModal } from "../models/referrals/RedeemReferralCreditModal";
import { DeleteReferralAlertModal } from "../models/referrals/DeleteReferralHistory";

interface CombinedDataItems {
  inviteeEmail: string;
  inviteeName: string | null;
  uniqueCode: string;
  joined: boolean;
  failed: boolean;
  approved: boolean;
  hide: boolean;
  createdAt: Date;
  credit: number;
  id: string;
}

interface ReferredWorkersProps {
  myReferrals: CombinedDataItems[];
  accountBalance: WorkerCreditPoints | null;
  contact: WorkerContact | null;
  user: User;
}

export function ReferredWorkers({
  myReferrals,
  accountBalance,
  contact,
  user,
}: ReferredWorkersProps) {
  const data = myReferrals;

  const router = useRouter();
  const { toast } = useToast();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  function obfuscateEmail(email: string): string {
    const [localPart, domain] = email.split("@");

    if (localPart.length < 3) {
      return "*".repeat(localPart.length) + "@" + domain;
    } else {
      const charsToHide = Math.max(3, Math.floor(localPart.length / 2));
      const visibleChars = localPart.length - charsToHide;
      const obfuscatedLocalPart =
        localPart.substring(0, visibleChars) + "*".repeat(charsToHide);
      return obfuscatedLocalPart + "@" + domain;
    }
  }
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [redeemOpen, setRedeemOpen] = React.useState<boolean>(false);
  const redeemClose = () => {
    setRedeemOpen((prev) => !prev);
  };

  const redeemConfirm = () => {
    setRedeemOpen((prev) => !prev);
  };

  const [
    currentlyDeletingReferralHistoryID,
    setCurrentlyDeletingReferralHistoryID,
  ] = React.useState<string | null>(null);

  const [deleteReferralOpen, setDeleteReferralOpen] =
    React.useState<boolean>(false);
  const deleteClose = () => {
    setCurrentlyDeletingReferralHistoryID(null);
    setDeleteReferralOpen((prev) => !prev);
  };

  const toggleDelete = (referralID: string) => {
    setCurrentlyDeletingReferralHistoryID(referralID);
    setDeleteReferralOpen(true);
  };

  const { mutate: deleteReferral, isLoading } =
    trpc.workerDeleteReferralHistory.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You successfully deleted a referral history",
          variant: "default",
          duration: 3000,
        });
        setDeleteReferralOpen(false);
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
              "There was a problem deleting your referral history. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
        setDeleteReferralOpen(false);
      },
      onMutate: ({ referralID }) => {
        setCurrentlyDeletingReferralHistoryID(referralID);
      },
      onSettled: () => {
        setCurrentlyDeletingReferralHistoryID(null);
      },
    });

  const deleteConfirm = (referralID: string) => {
    setCurrentlyDeletingReferralHistoryID(referralID);
    deleteReferral({
      referralID: referralID,
    });
  };
  const columns: ColumnDef<CombinedDataItems, keyof CombinedDataItems>[] = [
    {
      accessorKey: "createdAt",
      header: "Date Invited",
      cell: ({ row }) => {
        const date: Date = row.getValue("createdAt");
        return <div className="font-normal text-sm">{format(date, "PPP")}</div>;
      },
    },
    {
      accessorKey: "uniqueCode",
      header: "Unique Code",
      cell: ({ row }) => (
        <div className="text-sm font-normal">{row.getValue("uniqueCode")}</div>
      ),
    },
    {
      accessorKey: "inviteeEmail",
      header: "Invitee Email",
      cell: ({ row }) => (
        <div className="text-sm font-normal">
          {obfuscateEmail(row.getValue("inviteeEmail"))}
        </div>
      ),
    },
    {
      accessorKey: "inviteeName",
      header: "Invitee Name",
      cell: ({ row }) => {
        const invitee = row.getValue("inviteeName");

        const formatted = invitee ? (
          <div>
            <span>{invitee as string}</span>
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
                <span>Granted</span>
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
      id: "actions",
      header: () => (
        <div className=" flex justify-center items-center">View</div>
      ),
      enableHiding: false,
      cell: ({ row }) => {
        const referral = row.original;
        return (
          <div className="font-normal text-sm flex justify-center items-center">
            {currentlyDeletingReferralHistoryID === referral.id && (
              <DeleteReferralAlertModal
                isOpen={deleteReferralOpen}
                onClose={deleteClose}
                onConfirm={() => deleteConfirm(referral.id)}
                loading={isLoading}
              />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-5 w-8 p-0 rounded-sm">
                  <span className="sr-only">Open menu</span>
                  {currentlyDeletingReferralHistoryID === referral.id &&
                  isLoading ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  ) : (
                    <MoreHorizontal className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel className="text-gray-800">
                  Referral Actions
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <span
                    onClick={() => toggleDelete(referral.id)}
                    className="text-gray-600 flex items-center"
                  >
                    <Trash className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    Delete Detail
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
    <div className="w-full mt-3">
      <div className="flex items-center justify-between gap-x-4 flex-row">
        <RedeemReferralCreditAlertModal
          isOpen={redeemOpen}
          onClose={redeemClose}
          onConfirm={redeemConfirm}
          accountBalance={accountBalance}
          contact={contact}
          user={user}
        />
        <h2 className="font-bold text-gray-600 tracking-tight text-xl sm:text-2xl">
          My Referred Users
        </h2>
        <Button
          onClick={() => setRedeemOpen(true)}
          className="hover:bg-primary hover:opacity-90"
          variant="default"
          size="sm"
          type="button"
        >
          <Gift className="h-4 w-4 mr-2 shrink-0" />
          Redeem Now
        </Button>
      </div>
      <div className="mt-1">
        <p className="text-sm text-gray-600 font-normal">
          You currently have
          <span className="font-medium text-emerald-600">
            {" "}
            {accountBalance?.balance} points approved
          </span>{" "}
          &{" "}
          <span className="font-medium text-emerald-600">
            {accountBalance?.onRedeem} points
          </span>{" "}
          on redeem request . The minimum redeemable is{" "}
          <span className="font-medium">200 approved points</span>.
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
                    No referral results yet.
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
