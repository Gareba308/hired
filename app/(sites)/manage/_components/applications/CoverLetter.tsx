"use client";

import QuillPreview from "@/components/QuillPreview";
import { Section } from "@/components/ui/section";
import { Application } from "@prisma/client";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface CoverLetterProps {
  application: Application;
}

const CoverLetter = ({ application }: CoverLetterProps) => {
  const { toast } = useToast();

  const printDiv = () => {
    const printableArea = document.getElementById("divToPrint");
    if (printableArea) {
      const originalContents = document.body.innerHTML;
      const printContents = printableArea.innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
    } else {
      toast({
        title: "Something went wrong",
        description: "Could not find the element to print.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div
      id="divToPrint"
      className="w-full relative mx-auto scroll-my-12 print:p-12"
    >
      <section className="mx-auto bg-white tracking-tight print:shadow-none w-full max-w-4xl space-y-4  print:space-y-6">
          <div className="flex-1 w-full">
            <div>
              <div className="-space-y-2">
                <Section className="items-end -space-y-4 font-mono text-gray-700">
                  <div className="flex flex-col items-start leading-tight">
                    <p className="font-bold text-[19px] text-gray-600">
                      {application.applicantName as string}
                      <span className="font-normal text-sm">,</span>
                    </p>
                    <p>{application.userEmail},</p>
                    {application.workerContact.map((contact, index) => (
                      <div key={index}>
                        {JSON.parse(JSON.stringify(contact)).postal && (
                          <p>
                            P.O Box {JSON.parse(JSON.stringify(contact)).postal}
                            {JSON.parse(JSON.stringify(contact)).zip && (
                              <>-{JSON.parse(JSON.stringify(contact)).zip}</>
                            )}
                            ,
                          </p>
                        )}
                        {JSON.parse(JSON.stringify(contact)).town && (
                          <p>
                            {JSON.parse(JSON.stringify(contact)).town}
                            {JSON.parse(JSON.stringify(contact)).county && (
                              <>,{JSON.parse(JSON.stringify(contact)).county}</>
                            )}
                            .
                          </p>
                        )}
                      </div>
                    ))}
                    <p className="underline mt-1">
                      {format(application.createdAt, "PPP")}.
                    </p>
                  </div>
                </Section>
                <Section className="items-start leading-tight -space-y-4 font-mono text-gray-700">
                  <p className="font-bold text-[19px] text-gray-600">
                    {application.companyName}
                    <span className="font-normal text-base">,</span>
                  </p>
                  {application.company.map((company, index) => (
                    <div key={index}>
                      {JSON.parse(JSON.stringify(company)).postal && (
                        <p>
                          P.O Box {JSON.parse(JSON.stringify(company)).postal}
                          {JSON.parse(JSON.stringify(company)).zip && (
                            <>-{JSON.parse(JSON.stringify(company)).zip}</>
                          )}
                          ,
                        </p>
                      )}
                      {JSON.parse(JSON.stringify(company)).town && (
                        <p>
                          {JSON.parse(JSON.stringify(company)).town}
                          {JSON.parse(JSON.stringify(company)).county && (
                            <>,{JSON.parse(JSON.stringify(company)).county}</>
                          )}
                          .
                        </p>
                      )}
                    </div>
                  ))}
                </Section>
              </div>
              <Section className="text-gray-600 mt-2">
                <p className="font-mono">Dear Sir/Madam,</p>
                <h2 className="text-[19px] md:text-xl font-mono -mt-1.5 font-bold text-gray-600 uppercase">
                  RE:
                  <span className="underline">
                    {application.jobTitle} Application
                  </span>
                </h2>
                <div className="text-pretty -mt-1 font-mono text-sm text-gray-700">
                  <QuillPreview
                    htmlContent={application.whyMostQualified as string}
                  />
                </div>
              </Section>
              <Section className="items-start mt-4 text-base -space-y-4 font-mono text-gray-700">
                <p>Yours faithfully,</p>
                <p>(Signed)</p>
                <p>{application.applicantName}.</p>
              </Section>
            </div>
          </div>
      </section>
    </div>
  );
};

export default CoverLetter;