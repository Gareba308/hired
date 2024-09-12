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
  ChevronsLeft,
  ChevronsRight,
  Copy,
  ExternalLink,
  Grip,
  GripVertical,
  Loader2,
  MoreHorizontal,
  MoreVertical,
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
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HomepageContact } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HomeContactAlertModal } from "../models/contact/HomeContact";

interface HomepageContactProps {
  contact: HomepageContact[];
}

export function HomepageContacts({ contact }: HomepageContactProps) {
  const data = contact;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [currentlyOpeningID, setCurrentlyOpeningID] = React.useState<
    string | null
  >(null);
  const [contactOpen, setContactOpen] = React.useState<boolean>(false);
  const onClose = () => {
    setContactOpen((prev) => !prev);
    setCurrentlyOpeningID(null);
  };

  const onConfirm = () => {
    setContactOpen((prev) => !prev);
    setCurrentlyOpeningID(null);
  };

  const toggleOpen = (contactID: string) => {
    setContactOpen(true);
    setCurrentlyOpeningID(contactID);
  };

  const columns: ColumnDef<HomepageContact>[] = [
    {
      accessorKey: "createdAt",
      header: "Contacted On:",
      cell: ({ row }) => {
        const date: Date = row.getValue("createdAt");

        return <div className="font-normal text-sm">{format(date, "PPP")}</div>;
      },
    },
    {
      accessorKey: "fullName",
      header: "Full Name",
      cell: ({ row }) => (
        <div className="font-normal text-sm">{row.getValue("fullName")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email Address",
      cell: ({ row }) => (
        <div className="font-normal text-sm">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => {
        const subject = row.getValue("subject");
        return (
          <div className="capitalize text-sm font-normal">
            {typeof subject === "string" ? subject.toLowerCase() : ""}
          </div>
        );
      },
    },

    {
      accessorKey: "location",
      header: "User Agent",
      cell: ({ row }) => (
        <div className="font-normal text-sm">{row.getValue("location")}</div>
      ),
    },
    {
      accessorKey: "ipAddress",
      header: "IP Address",
      cell: ({ row }) => (
        <div className="font-normal text-sm">{row.getValue("ipAddress")}</div>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className=" flex justify-center items-center">Open</div>
      ),
      enableHiding: false,
      cell: ({ row }) => {
        const message = row.original;
        return (
          <div className="font-normal text-sm flex justify-center items-center">
            {currentlyOpeningID === message.id && (
              <HomeContactAlertModal
                isOpen={contactOpen}
                onClose={onClose}
                onConfirm={onConfirm}
                contact={message}
              />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-5 w-8 p-0 rounded-sm">
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
                    className="text-gray-600 flex items-center"
                    onClick={() => toggleOpen(message.id)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    View Details
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span
                    className="text-gray-600 flex items-center"
                    onClick={() => {}}
                  >
                    <Trash className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    Delete Message
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
    <div className="w-full">
      <div className=" flex items-center justify-between gap-x-4">
        <h2 className="font-bold text-gray-600 tracking-tight text-xl sm:text-2xl">
          Homepage Contact Messages
        </h2>
      </div>
      <div className="rounded-lg mt-2 border bg-white">
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
