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
  Archive,
  ArchiveRestore,
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { isBefore, addDays } from "date-fns";
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
import { Job } from "@prisma/client";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/app/_trpc/client";

interface AllJobsProps {
  myJobs: Job[];
}

export function AllJobsApplications({ myJobs }: AllJobsProps) {
  const data = myJobs;
  const router = useRouter();
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
  const [currentlyOpeningID, setCurrentlyOpeningID] = React.useState<
    string | null
  >(null);

  const [currentlyArchiving, setCurrentlyArchiving] = React.useState<
    string | null
  >(null);

  const [openingLoading, setOpeningLoading] = React.useState<boolean>(false);

  const openApp = (jobId: string) => {
    setCurrentlyOpeningID(jobId);
    setOpeningLoading(true);
    router.push(`/manage/dashboard/jobs/${jobId}?origin=manage/dashboard`);
    router.refresh();
  };

  const { mutate: archiveJob, isLoading } = trpc.employerArchiveJob.useMutation(
    {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "This job has successfully been placed in archived list",
          variant: "default",
          duration: 3000,
        });
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
              "There was a problem trying to archive this job. Kindly try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
      onMutate: ({ jobId }) => {
        setCurrentlyArchiving(jobId);
      },
      onSettled: () => {
        setCurrentlyArchiving(null);
      },
    }
  );

  const { mutate: unarchiveJob, isLoading: unarchiveLoading } =
    trpc.employerUnarchiveJobs.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Archived jobs have successfully been retrieved",
          variant: "default",
          duration: 3000,
        });
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
              "There was a problem trying to unarchive your job(s). Kindly try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const columns: ColumnDef<Job>[] = [
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <div
            className="flex justify-start items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Published Date
            <ArrowUpDown className="ml-0.5 h-4 w-4 shrink-0" />
          </div>
        );
      },
      cell: ({ row }) => {
        const date: Date = row.getValue("createdAt");

        return (
          <div suppressHydrationWarning className="font-normal text-sm">
            {format(date, "PPP")}
          </div>
        );
      },
    },
    {
      accessorKey: "job_id",
      header: "Job ID",
      cell: ({ row }) => (
        <div className="font-normal text-sm">{row.getValue("job_id")}</div>
      ),
    },
    {
      accessorKey: "job_title",
      header: "Job Title",
      cell: ({ row }) => {
        const jobTitle = row.getValue("job_title");
        return (
          <div className="capitalize text-sm line-clamp-1 font-normal">
            {typeof jobTitle === "string" ? jobTitle.toLowerCase() : ""}
          </div>
        );
      },
    },
    {
      accessorKey: "applied",
      header: ({ column }) => {
        return (
          <div
            className="flex justify-center items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Applied
            <ArrowUpDown className="ml-0.5 h-4 w-4 shrink-0" />
          </div>
        );
      },
      cell: ({ row }) => {
        const ownPlatformMethod = row.original.ownPlatformMethod;

        return (
          <div
            className={`font-normal text-sm flex justify-center items-center ${
              ownPlatformMethod === "own"
                ? "text-orange-800"
                : ownPlatformMethod === "here"
                ? "text-purple-800"
                : ""
            }`}
          >
            {ownPlatformMethod === "own" ? "Outs" : row.getValue("applied")}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const { deadline, createdAt } = row.original;

        const now = new Date();
        const isPastDeadline = deadline
          ? isBefore(new Date(deadline), now)
          : false;
        const isPastCreatedAtLimit = createdAt
          ? isBefore(new Date(createdAt), addDays(now, -30))
          : false;

        const isActive = !isPastDeadline && !isPastCreatedAtLimit;

        const formatted = isActive ? (
          <div className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
            <span>Active</span>
          </div>
        ) : (
          <div className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">
            <span>Closed</span>
          </div>
        );

        return <div className="text-sm font-normal">{formatted}</div>;
      },
    },
    {
      id: "actions",
      header: () => (
        <div className=" flex justify-center items-center">Open</div>
      ),
      enableHiding: false,
      cell: ({ row }) => {
        const job = row.original;
        return (
          <div className="font-normal text-sm flex justify-center items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-5 w-8 p-0 rounded-sm"
                  disabled={
                    currentlyOpeningID === job.id ||
                    openingLoading ||
                    currentlyArchiving === job.id ||
                    isLoading
                  }
                >
                  <span className="sr-only">Open menu</span>
                  {currentlyOpeningID === job.id && openingLoading ? (
                    <span>
                      <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />
                    </span>
                  ) : currentlyArchiving === job.id && isLoading ? (
                    <span>
                      <Loader2 className="h-5 w-5 text-gray-500 animate-spin" />
                    </span>
                  ) : (
                    <MoreHorizontal className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-gray-800">
                  Application Actions
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <span
                    className="text-gray-600 flex items-center"
                    onClick={() => openApp(job.id)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    View Details
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span
                    className="text-gray-600 flex items-center"
                    onClick={() => archiveJob({ jobId: job.id })}
                  >
                    <Archive className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    Archive Job
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(job.id)}
                  className="text-gray-600 flex items-center shrink-0"
                >
                  <Copy className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                  Copy Identity
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
          Jobs Published
        </h2>
      </div>
      <p className="text-sm text-gray-600 -mt-1">
        Click on <span className="font-bold">Open</span> to open and view each
        job&apos;s application. <b className="text-orange-800">Outs</b> means
        application platform is <b>External</b>
      </p>
      <div className="flex items-center justify-between gap-x-4 py-1">
        <Input
          placeholder="Search for a job by job title"
          value={
            (table.getColumn("job_title")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("job_title")?.setFilterValue(event.target.value)
          }
          className="w-full sm:max-w-sm"
        />
        <div>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button
                disabled={unarchiveLoading}
                className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-2 py-2 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50"
              >
                {unarchiveLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin shrink-0 text-gray-600" />
                  </>
                ) : (
                  <GripVertical className="h-6  w-6 text-gray-600" />
                )}
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-1 w-48 origin-top-right divide-y divide-gray-100 rounded-sm bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <h2 className="text-gray-700 text-base font-medium py-1 px-4">
                  Job Actions
                </h2>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <span
                        onClick={() => unarchiveJob()}
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "px-4 flex items-center hover:cursor-pointer py-2 text-sm"
                        )}
                      >
                        <ArchiveRestore className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                        Unarchive Job
                      </span>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
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
