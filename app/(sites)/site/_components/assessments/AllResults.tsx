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
import { AssessmentStatus } from "@prisma/client";
import { AssessmentResultsAlertModal } from "../models/assessment/Results";

interface AllReportsItems {
  id: string;
  userId: string;
  fullName: string;
  testCategory: string;
  completeTime: Date;
  testId: string;
  testName: string;
  status: AssessmentStatus;
  score: number;
  createdAt: Date;
}

interface AllReportsProps {
  results: AllReportsItems[];
}

export function AllResults({ results }: AllReportsProps) {
  const data = results;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [currentlyOpeningReportID, setCurrentlyOpeningReportID] =
    React.useState<string | null>(null);
  const [reportOpen, setReportOpen] = React.useState<boolean>(false);
  const reportClose = () => {
    setReportOpen((prev) => !prev);
    setCurrentlyOpeningReportID(null);
  };

  const toggleReport = (reportID: string) => {
    setReportOpen(true);
    setCurrentlyOpeningReportID(reportID);
  };

  const reportConfirm = () => {
    setReportOpen((prev) => !prev);
    setCurrentlyOpeningReportID(null);
  };

  const columns: ColumnDef<AllReportsItems, keyof AllReportsItems>[] = [
    {
      accessorKey: "createdAt",
      header: "Date Submitted",
      cell: ({ row }) => {
        const date: Date = row.getValue("createdAt");
        return <div className="font-normal text-sm">{format(date, "PPP")}</div>;
      },
    },
    {
      accessorKey: "completeTime",
      header: ({ column }) => {
        return (
          <div
            className="flex justify-center items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Submit Time
          </div>
        );
      },
      cell: ({ row }) => {
        const date: Date = row.getValue("completeTime");
        return (
          <div className="text-sm font-normal flex justify-center items-center">
            {format(date, "HH:mm")}
          </div>
        );
      },
    },
    {
      accessorKey: "testCategory",
      header: "Test Category",
      cell: ({ row }) => (
        <div className="text-sm font-normal">
          {row.getValue("testCategory")}
        </div>
      ),
    },
    {
      accessorKey: "testName",
      header: "Test Name",
      cell: ({ row }) => (
        <div className="text-sm font-normal">{row.getValue("testName")}</div>
      ),
    },
    {
      accessorKey: "score",
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
          {row.getValue("score")}%
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status");

        const formatted =
          status === "PASSED" ? (
            <div className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              <span>Passed</span>
            </div>
          ) : status === "PENDING" ? (
            <div className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
              <span>Pending</span>
            </div>
          ) : status === "UNINITIATED" ? (
            <div className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-700/10">
              <span>Uninitiated</span>
            </div>
          ) : status === "INITIATED" ? (
            <div className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10">
              <span>In Progress</span>
            </div>
          ) : status === "INCOMPLETE" ? (
            <div className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
              <span>Incomplete</span>
            </div>
          ) : status === "REVIEWING" ? (
            <div className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-700/10">
              <span>Reviewing</span>
            </div>
          ) : (
            <div className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10">
              <span>Unsuccessful</span>
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
        const result = row.original;
        return (
          <div className="font-normal text-sm flex justify-center items-center">
            {currentlyOpeningReportID === result.id && (
              <AssessmentResultsAlertModal
                isOpen={reportOpen}
                onClose={reportClose}
                onConfirm={reportConfirm}
                result={result}
              />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-5 w-8 p-0 rounded-sm">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-gray-800">
                  Results Actions
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <span
                    onClick={() => toggleReport(result.id)}
                    className="text-gray-600 flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    View Results
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
        <h2 className='text-xl font-semibold'>Assessment Results</h2>
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
                    No assessment results.
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
