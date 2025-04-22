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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  ExternalLink,
  Grip,
  GripVertical,
  LayoutPanelLeft,
  Loader2,
  Mails,
  MoreHorizontal,
  MoreVertical,
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

interface CombinedDataItems {
  category: string;
  jobCount: number;
  desireCount: number;
  emailedCount: number;
  notEmailedCount: number;
}

interface EmailCategoriesProps {
  combinedData: CombinedDataItems[];
}

export function EmailCategories({ combinedData }: EmailCategoriesProps) {
  const data = combinedData;
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams?.get("origin");
  const { toast } = useToast();
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<CombinedDataItems, keyof CombinedDataItems>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "category",
      header: "Job Category",
      cell: ({ row }) => (
        <div className="font-normal text-sm">{row.getValue("category")}</div>
      ),
    },
    {
      accessorKey: "jobCount",
      header: "Count",
      cell: ({ row }) => (
        <div className="capitalize text-sm font-normal">
          {row.getValue("jobCount")}
        </div>
      ),
    },
    {
      accessorKey: "emailedCount",
      header: "Emailed",
      cell: ({ row }) => (
        <div className="capitalize text-sm font-normal">
          {row.getValue("emailedCount")}
        </div>
      ),
    },
    {
      accessorKey: "notEmailedCount",
      header: "Unemailed",
      cell: ({ row }) => (
        <div className="capitalize text-sm font-normal">
          {row.getValue("notEmailedCount")}
        </div>
      ),
    },
    {
      accessorKey: "desireCount",
      header: "Desires",
      cell: ({ row }) => (
        <div className="capitalize text-sm font-normal">
          {row.getValue("desireCount")}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className=" flex justify-center items-center">View</div>
      ),
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="font-normal text-sm flex justify-center items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-5 w-8 p-0 rounded-sm">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-gray-800">
                  Analytics Actions
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <span
                    onClick={() =>
                      router.push("/control/email/analytics/skills")
                    }
                    className="text-gray-600 flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    Skills Analytics
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span
                    onClick={() =>
                      router.push("/control/email/analytics/general")
                    }
                    className="text-gray-600 flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    General Analytics
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span
                    onClick={() =>
                      router.push("/control/email/analytics/category")
                    }
                    className="text-gray-600 flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    Category Analytics
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
      <div className="flex items-center justify-between gap-x-4 mb-2 flex-row">
        <div className=" flex flex-row items-center">
          <h2 className="font-bold text-gray-600 tracking-tight text-xl sm:text-2xl">
            Basic Emails Analytics
          </h2>
        </div>
        <div>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex font-normal w-full justify-center items-center gap-x-1.5 rounded-sm bg-primary px-3 h-[37px] sm:h-[38px] text-sm text-primary-foreground hover:opacity-90">
                <span className="hidden sm:flex">More Options</span>
                <span className="sm:hidden">Options</span>
                <ChevronDown className="h-4 w-4 ml-0.5 shrink-0" />
              </Menu.Button>
            </div>

            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute w-52 mx-auto right-0 z-10 mt-1  origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/control/email"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-700"
                            : "text-gray-600",
                          "flex items-center hover:bg-secondary font-normal cursor-pointer px-4 py-2 text-sm"
                        )}
                      >
                        <LayoutPanelLeft className="h-5 w-5 shrink-0 mr-2" />
                        Email Categories
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/control/email/skills"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-700"
                            : "text-gray-600",
                          "flex items-center hover:bg-secondary font-normal cursor-pointer px-4 py-2 text-sm"
                        )}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5 shrink-0 mr-2"
                        >
                          <path d="M12 12h.01" />
                          <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                          <path d="M22 13a18.15 18.15 0 0 1-20 0" />
                          <rect width="20" height="14" x="2" y="6" rx="2" />
                        </svg>
                        Send Skills Email
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/control/email/general"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-700"
                            : "text-gray-600",
                          "flex items-center hover:bg-secondary font-normal cursor-pointer px-4 py-2 text-sm"
                        )}
                      >
                        <Mails className="h-5 w-5 shrink-0 mr-2" />
                        Send General Emails
                      </Link>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
      <div className="flex items-center justify-between gap-x-4 py-1">
        <Input
          placeholder="Search for a job category"
          value={
            (table.getColumn("category")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("category")?.setFilterValue(event.target.value)
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
