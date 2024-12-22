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
import { ArrowUpDown, Copy, ExternalLink, MoreHorizontal } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Application } from "@prisma/client";
import Link from "next/link";
import { ApplicationHistoryAlertModal } from "../models/applications/ApplicationHistoryModal";

interface AllApplicationsProps {
  myApplication: Application[];
}

export function AllApplications({ myApplication }: AllApplicationsProps) {
  const [currentlyViewingID, setCurrentlyViewingID] = React.useState<
    string | null
  >(null);
  const [viewOpen, setViewOpen] = React.useState<boolean>(false);
  const viewClose = () => {
    setViewOpen((prev) => !prev);
    setCurrentlyViewingID(null);
  };

  const toggleView = (applicationID: string) => {
    setViewOpen(true);
    setCurrentlyViewingID(applicationID);
  };

  const viewConfirm = () => {
    setViewOpen((prev) => !prev);
    setCurrentlyViewingID(null);
  };
  const columns: ColumnDef<Application>[] = [
    {
      accessorKey: "createdAt",
      header: "Applied",
      cell: ({ row }) => {
        const date: Date = row.getValue("createdAt");

        return (
          <div suppressHydrationWarning className="font-normal text-gray-700 text-sm">
            {format(date, "PPP")}
          </div>
        );
      },
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
      accessorKey: "job_id",
      header: "Job ID",
      cell: ({ row }) => (
        <div className="capitalize text-sm font-normal">
          {row.getValue("job_id")}
        </div>
      ),
    },
    {
      accessorKey: "companyName",
      header: "Company Name",
      cell: ({ row }) => (
        <div className="font-normal text-sm line-clamp-1">{row.getValue("companyName")}</div>
      ),
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
      header: () => (
        <div className="flex justify-center items-center">Status</div>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status");

        const formatted =
          status === "PENDING" ? (
            <div className="inline-flex items-center rounded-sm bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
              <span className="h-[6px] w-[6px] rounded-full bg-indigo-700 mr-1" />
              <span>Pending</span>
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

        return (
          <div className="text-sm font-normal flex justify-center items-center">
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
        const application = row.original;
        return (
          <div className="font-normal text-sm flex justify-center items-center">
            {currentlyViewingID === application.id && (
              <ApplicationHistoryAlertModal
                isOpen={viewOpen}
                onClose={viewClose}
                onConfirm={viewConfirm}
                application={application}
              />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-gray-800">
                  Application Actions
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <span
                    onClick={() => toggleView(application.id)}
                    className="text-gray-600 flex items-center shrink-0"
                  >
                    <ExternalLink className="h-4 w-4 mr-1 text-gray-500" />
                    View Details
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(application.id)}
                  className="text-gray-600 flex items-center shrink-0"
                >
                  <Copy className="h-4 w-4 mr-1 text-gray-500" />
                  Copy Identity
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
  const data = myApplication;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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
      <h2 className="font-bold text-gray-600 tracking-tight text-xl sm:text-2xl">
        Job Applications
      </h2>
      <div className="flex items-center py-2">
        <Input
          placeholder="Search for an application..."
          value={
            (table.getColumn("jobTitle")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("jobTitle")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
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
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
