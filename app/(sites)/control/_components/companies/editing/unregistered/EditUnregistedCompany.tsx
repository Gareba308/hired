"use client";

import { UnregisteredCompany } from "@prisma/client";
import { Loader2, Trash } from "lucide-react";
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DeleteAlertModal } from "./DeleteAlertModal";
import CompanyNameEdit from "./CompanyNameEdit";
import CompanyDescriptionEdit from "./CompanyDescriptionEdit";
import CompanyCategoryEdit from "./CompanyCategoryEdit";
import CompanyWebsiteEdit from "./CompanyWebsiteEdit";
import CompanyLogoEdit from "./CompanyLogoEdit";
import CompanyEmailEdit from "./CompanyEmailEdit";

interface EditRegisteredCompanyProps {
  company: UnregisteredCompany;
  slug: string;
}
const EditUnregisteredCompany = ({
  company,
  slug,
}: EditRegisteredCompanyProps) => {
  const router = useRouter();

  const { toast } = useToast();

  const [deleteOpen, setDeleteOpen] = useState(false);

  const { mutate: confirmDelete, isLoading } =
    trpc.adminDeleteUnregisteredCompany.useMutation({
      onSuccess: () => {
        toast({
          title: "Successfully deleted",
          description: "The company has successfully been deleted",
          variant: "default",
          duration: 3000,
        });
        router.push("/control/companies");
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
              "There was a problem deleting this company. Please try again later",
            variant: "destructive",
            duration: 3000,
          });
        }
      },
    });

  const submitDelete = () => {
    setDeleteOpen(false);
    confirmDelete({ companyID: company.id });
  };

  return (
    <>
      <div>
        <div className="flex items-center gap-x-1.5 sm:gap-x-2">
          <div className="mb-3">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/control/companies">
                    Companies
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/control/companies/${slug}`}>
                    Company Detail
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Edit</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="font-bold text-gray-600 tracking-tight text-2xl lg:text-2xl">
            Company Edit
          </h3>
        </div>
      </div>
      {company.companyName && (
        <div className="text-gray-600">
          <h2 className="text-lg sm:text-[18px] sm:leading-[1.2rem] font-semibold">
            Company:{" "}
            <Link
              href={`/control/company/${slug}`}
              className="font-bold text-gray-600 hover:underline"
            >
              {company.companyName}
            </Link>
          </h2>
        </div>
      )}
      <div className=" border-t border-gray-200">
        <dl className="divide-y divide-gray-100">
          <CompanyNameEdit company={company} />
          <CompanyCategoryEdit company={company} />
          <CompanyEmailEdit company={company} />
          <CompanyWebsiteEdit company={company} />
          <CompanyDescriptionEdit company={company} />
          <CompanyLogoEdit company={company} />
        </dl>
      </div>

      <div className="pt-4">
        <dl className="border-t border-red-200">
          <div className="pt-2 pb-4 pl-0.5 lg:pb-5 lg:pt-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:px-0 text-gray-700">
            <DeleteAlertModal
              isOpen={deleteOpen}
              onClose={() => setDeleteOpen(false)}
              onConfirm={submitDelete}
              loading={isLoading}
              company={company}
            />
            <dt className="text-xl font-bold text-destructive-foreground">
              Delete Company
            </dt>
            <dd className="mt-1 leading-6 text-gray-600 sm:col-span-2 sm:mt-0">
              <p className="mt-1 max-w-full leading-6 text-base text-gray-500">
                We encourage you to observe{" "}
                <span className="font-medium text-primary">CAUTION</span> before
                deleting this company. Deleting will disrupt job analytics and
                Others stored data. This action is IRREVERSIBLE.
              </p>

              <p className="text-gray-500">
                By clicking{" "}
                <span className="font-medium text-destructive-foreground">
                  Delete
                </span>{" "}
                button below, the company will be removed from our database.
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
                  onClick={() =>
                    router.push(`/control/companies/${company.id}`)
                  }
                  className="flex mt-4 w-full sm:w-[200px] rounded-sm items-center justify-center border border-gray-200 bg-gray-200 px-8 py-3 text-base font-medium text-gray-700"
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

export default EditUnregisteredCompany;
