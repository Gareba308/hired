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
  ListPlus,
  Loader2,
  Mail,
  MoreHorizontal,
  Trash,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ReportProblemAlertModal } from "../../models/assessments/ReportProblem";
import { AddAttemptAlertModal } from "../../models/assessments/AddAttempt";
import { DeleteAlertModal } from "../../models/assessments/DeleteReport";
import MessageReporterModal from "../../models/assessments/MessageReporter";

interface AllReportsItems {
  id: string;
  userId: string;
  initiateID: string;
  fullName: string;
  email: string;
  assessmentCategory: string;
  assessmentName: string;
  questionID: string;
  subject: string;
  report: string;
  sorted: boolean;
  createdAt: Date;
}

interface AllReportsProps {
  reports: AllReportsItems[];
}

export function AllReports({ reports }: AllReportsProps) {
  const data = reports;
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

  const [currentlyMessagingReportID, setCurrentlyMessagingReportID] =
    React.useState<string | null>(null);
  const [messageOpen, setMessageOpen] = React.useState<boolean>(false);
  const messageClose = () => {
    setMessageOpen((prev) => !prev);
    setCurrentlyMessagingReportID(null);
  };
  const messageConfirm = () => {
    setMessageOpen((prev) => !prev);
    setCurrentlyMessagingReportID(null);
  };

  const toggleMessage = (reportID: string) => {
    setMessageOpen(true);
    setCurrentlyMessagingReportID(reportID);
  };

  const [currentlyAddingAttemptID, setCurrentlyAddingAttemptID] =
    React.useState<null | string>(null);

  const [addAttemptOpen, setAddAttemptOpen] = React.useState<boolean>(false);
  const addAttemptClose = () => {
    setAddAttemptOpen((prev) => !prev);
    setCurrentlyAddingAttemptID(null);
  };
  const toggleAttemptAdd = (reportID: string) => {
    setAddAttemptOpen(true);
    setCurrentlyAddingAttemptID(reportID);
  };

  const [currentlyDeletingReportID, setCurrentlyDeletingReportID] =
    React.useState<string | null>(null);

  const [deleteReportOpen, setDeleteReportOpen] =
    React.useState<boolean>(false);
  const deleteClose = () => {
    setCurrentlyDeletingReportID(null);
    setDeleteReportOpen((prev) => !prev);
  };

  const toggleDelete = (reportID: string) => {
    setCurrentlyDeletingReportID(reportID);
    setDeleteReportOpen(true);
  };

  const { mutate: deleteReport, isLoading } =
    trpc.adminDeleteAssessmentReport.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You successfully deleted an assessment report",
          variant: "default",
          duration: 3000,
        });
        deleteClose();
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
              "There was a problem deleting this assessment report. Please try again later.",
            variant: "destructive",
            duration: 3000,
          });
        }
        deleteClose();
      },
      onMutate: ({ reportID }) => {
        setCurrentlyDeletingReportID(reportID);
      },
      onSettled: () => {
        setCurrentlyDeletingReportID(null);
      },
    });

  const deleteConfirm = (reportID: string) => {
    setCurrentlyDeletingReportID(reportID);
    deleteReport({
      reportID: reportID,
    });
  };

  const { mutate: sortReport, isLoading: sortLoading } =
    trpc.adminSortAssessmentReport.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Report has been marked as sorted",
          variant: "default",
          duration: 3000,
        });
        reportClose();
        router.refresh();
      },
      onError: (err) => {
        toast({
          title: "Something went wrong",
          description:
            err.message ||
            "There was a problem while marking this report as sorted. Try again later",
          variant: "destructive",
          duration: 3000,
        });
      },
      onMutate: ({ reportID }) => {
        setCurrentlyOpeningReportID(reportID);
      },
      onSettled: () => {
        setCurrentlyOpeningReportID(null);
      },
    });

  const reportConfirm = (reportID: string) => {
    sortReport({ reportID });
  };

  const { mutate: addAttempt, isLoading: addAttemptLoading } =
    trpc.adminAddAssessmentReportingAttempt.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You have added this user an assessment attempt",
          variant: "default",
          duration: 3000,
        });
        addAttemptClose();
        router.refresh();
      },
      onError: (err) => {
        toast({
          title: "Something went wrong",
          description:
            err.message ||
            "There was a problem while adding an assessment attempt. Try again later",
          variant: "destructive",
          duration: 3000,
        });
      },
      onMutate: ({ reportID }) => {
        setCurrentlyAddingAttemptID(reportID);
      },
      onSettled: () => {
        setCurrentlyAddingAttemptID(null);
      },
    });

  const addAttemptConfirm = (reportID: string) => {
    addAttempt({ reportID });
  };

  const columns: ColumnDef<AllReportsItems, keyof AllReportsItems>[] = [
    {
      accessorKey: "createdAt",
      header: "Date Reported",
      cell: ({ row }) => {
        const date: Date = row.getValue("createdAt");
        return <div className="font-normal text-sm">{format(date, "PPP")}</div>;
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
      accessorKey: "email",
      header: "Email Address",
      cell: ({ row }) => (
        <div className="text-sm font-normal">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "assessmentCategory",
      header: "Assessment Category",
      cell: ({ row }) => (
        <div className="text-sm font-normal">
          {row.getValue("assessmentCategory")}
        </div>
      ),
    },
    {
      accessorKey: "questionID",
      header: "Question ID",
      cell: ({ row }) => (
        <div className="text-sm font-normal">{row.getValue("questionID")}</div>
      ),
    },
    {
      accessorKey: "sorted",
      header: "Status",
      cell: ({ row }) => {
        const sorted = row.getValue("sorted");

        const formatted =
          sorted === true ? (
            <div className="inline-flex items-center rounded-sm bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
              <span>Sorted</span>
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
      id: "actions",
      header: () => (
        <div className=" flex justify-center items-center">Actions</div>
      ),
      enableHiding: false,
      cell: ({ row }) => {
        const report = row.original;
        return (
          <div className="font-normal text-sm flex justify-center items-center">
            {currentlyOpeningReportID === report.id && (
              <ReportProblemAlertModal
                isOpen={reportOpen}
                onClose={reportClose}
                onConfirm={() => reportConfirm(report.id)}
                report={report}
                loading={sortLoading}
              />
            )}
            {currentlyAddingAttemptID === report.id && (
              <AddAttemptAlertModal
                isOpen={addAttemptOpen}
                onClose={addAttemptClose}
                onConfirm={() => addAttemptConfirm(report.id)}
                loading={addAttemptLoading}
              />
            )}
            {currentlyDeletingReportID === report.id && (
              <DeleteAlertModal
                isOpen={deleteReportOpen}
                onClose={deleteClose}
                onConfirm={() => deleteConfirm(report.id)}
                loading={isLoading}
              />
            )}
            {currentlyMessagingReportID === report.id && (
              <MessageReporterModal
                isOpen={messageOpen}
                onClose={messageClose}
                onConfirm={messageConfirm}
                fullName={report.fullName}
                userId={report.userId}
              />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  disabled={
                    (currentlyDeletingReportID === report.id && isLoading) ||
                    (currentlyOpeningReportID === report.id && sortLoading) ||
                    (currentlyAddingAttemptID === report.id &&
                      addAttemptLoading)
                  }
                  variant="ghost"
                  className="h-5 w-8 p-0 rounded-sm"
                >
                  <span className="sr-only">Open menu</span>
                  {currentlyDeletingReportID === report.id && isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  ) : currentlyOpeningReportID === report.id && sortLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  ) : currentlyAddingAttemptID === report.id &&
                    addAttemptLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  ) : (
                    <MoreHorizontal className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-gray-800">
                  Report Actions
                </DropdownMenuLabel>
                <DropdownMenuItem>
                  <span
                    onClick={() => toggleReport(report.id)}
                    className="text-gray-600 flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    View Report
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span
                    onClick={() => toggleAttemptAdd(report.id)}
                    className="text-gray-600 flex items-center"
                  >
                    <ListPlus className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    Add Attempt
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span
                    onClick={() => toggleMessage(report.id)}
                    className="text-gray-600 flex items-center"
                  >
                    <Mail className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    Message Sender
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span
                    onClick={() => toggleDelete(report.id)}
                    className="text-gray-600 flex items-center"
                  >
                    <Trash className="h-4 w-4 mr-2 text-gray-500 shrink-0" />
                    Delete Report
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
      <div className="mt-1">
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
