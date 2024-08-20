"use client";

import { Job, PickAssessCandidate } from "@prisma/client";
import { ArrowBigLeft, Loader2, Trash } from "lucide-react";
import TitleEdit from "./TitleEdit";
import DescriptionEdit from "./DescriptionEdit";
import CountyEdit from "./CountyEdit";
import CategoryEdit from "./CategoryEdit";
import EmploymentTypeEdit from "./EmploymentTypeEdit";
import DeadlineEdit from "./DeadlineEdit";
import ResponsibilitiesEdit from "./ResponsibilitiesEdit";
import ExperienceEdit from "./ExperienceEdit";
import AcademicsEdit from "./AcademicsEdit";
import RequirementsEdit from "./RequirementsEdit";
import VacanciesEdit from "./VacanciesEdit";
import SalaryEdit from "./SalaryEdit";
import BenefitsEdit from "./BenefitsEdit";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DeleteAlertModal } from "../models/job/DeleteAlertModal";
import { trpc } from "@/app/_trpc/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ChooseMethodEdit from "./ChooseMethodEdit";
import NonRegisteredEdit from "./NonRegisteredEdit";
import CompanyNameEdit from "./CompanyNameEdit";
import AddAssessmentEdit from "./AddAssessmentEdit";
import AssessmentOneIDEdit from "./AssessmentOneIDEdit";
import AssessmentTwoIDEdit from "./AssessmentTwoIDEdit";

interface EditJobPageProps {
  job: Job | null;
  myOrderedPicks: PickAssessCandidate[]
}
const EditJob = ({ job, myOrderedPicks }: EditJobPageProps) => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams?.get("origin");

  const { toast } = useToast();

  const [deleteOpen, setDeleteOpen] = useState(false);

  const { mutate: confirmDelete, isLoading } =
    trpc.employerDeleteJob.useMutation({
      onSuccess: () => {
        toast({
          title: "Successfully deleted",
          description: "The job has successfully been deleted",
          variant: "default",
          duration: 3000,
        });
        router.push("/control/jobs");
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
              "There was a problem deleting this job. Please try again later",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const submitDelete = () => {
    setDeleteOpen(false);
    confirmDelete({ jobID: job?.id! });
  };

  return (
    <>
      <div>
        <div className="flex items-center gap-x-1.5 sm:gap-x-2">
          <div className="mb-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/control/jobs">All Jobs</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/control/jobs/${job?.id}`}>
                    Job Details
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Edit Job</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="font-bold text-gray-600 tracking-tight text-2xl lg:text-2xl">
            Job Settings
          </h3>
        </div>
      </div>
      {job?.job_title && (
        <div className="text-gray-600">
          <h2 className="text-lg sm:text-[18px] sm:leading-[1.2rem] font-semibold">
            Title:{" "}
            <Link
              href={`/control/jobs/${job.id}`}
              className="font-bold text-gray-600 hover:underline"
            >
              {job?.job_title}
            </Link>
          </h2>
        </div>
      )}
      <div className=" border-t border-gray-200">
        <dl className="divide-y divide-gray-100">
          <TitleEdit job={job} jobId={job?.id as string} />
          <NonRegisteredEdit job={job} jobId={job?.id as string} />
          {job?.jobFormNonRegisteredCompany === true && (
            <CompanyNameEdit job={job} jobId={job?.id as string} />
          )}
          <CountyEdit job={job} jobId={job?.id as string} />
          <CategoryEdit job={job} jobId={job?.id as string} />
          <EmploymentTypeEdit job={job} jobId={job?.id as string} />
          <DescriptionEdit job={job} jobId={job?.id as string} />
          <DeadlineEdit job={job} jobId={job?.id as string} />
          <ResponsibilitiesEdit job={job} jobId={job?.id as string} />
          <ExperienceEdit job={job} jobId={job?.id as string} />
          <AcademicsEdit job={job} jobId={job?.id as string} />
          <RequirementsEdit job={job} jobId={job?.id as string} />
          <VacanciesEdit job={job} jobId={job?.id as string} />
          <SalaryEdit job={job} jobId={job?.id as string} />
          <BenefitsEdit job={job} jobId={job?.id as string} />
          <ChooseMethodEdit job={job} jobId={job?.id as string} />
          <AddAssessmentEdit job={job} jobId={job?.id as string} />
          {job?.addAssessment === true && (
            <AssessmentOneIDEdit
              job={job}
              jobId={job?.id as string}
              orderedAssessments={myOrderedPicks}
            />
          )}
          {job?.addAssessment === true && job.assessmentOneID && (
            <AssessmentTwoIDEdit
              job={job}
              jobId={job?.id as string}
              orderedAssessments={myOrderedPicks}
            />
          )}
        </dl>
      </div>

      <div className="pt-4">
        <dl className="border-t border-red-200">
          <div className="pt-2 pb-4 pl-0.5 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-800">
            <DeleteAlertModal
              isOpen={deleteOpen}
              onClose={() => setDeleteOpen(false)}
              onConfirm={submitDelete}
              loading={isLoading}
              job={job}
            />
            <dt className="text-xl font-bold text-destructive-foreground">
              Delete Job
            </dt>
            <dd className="mt-1 leading-6 text-gray-600 sm:col-span-2 sm:mt-0">
              <p className="mt-1 max-w-full leading-6 text-base text-gray-500">
                We encourage you to observe{" "}
                <span className="font-medium text-primary">CAUTION</span> before
                deleting this job. Deleting will disrupt job analytics and
                stored data including received applications. This action is
                IRREVERSIBLE.
              </p>

              <p className="text-gray-500">
                By clicking{" "}
                <span className="font-medium text-destructive-foreground">
                  Delete
                </span>{" "}
                button below, the job will be removed from our database.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-start gap-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setDeleteOpen(true)}
                  className={cn(
                    "flex mt-4 w-full sm:w-[200px] rounded-sm items-center justify-center border border-destructive-foreground/20 bg-red-100 px-8 py-3 text-base font-medium text-destructive-foreground",
                    isLoading && "opacity-60"
                  )}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </>
                  ) : (
                    <span className="flex items-center">
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => router.push(`/control/jobs/${job?.id}`)}
                  className="flex mt-4 w-full sm:w-[200px] rounded-sm items-center justify-center border border-gray-200 bg-slate-200 px-8 py-3 text-base font-medium text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </>
  );
};

export default EditJob;
