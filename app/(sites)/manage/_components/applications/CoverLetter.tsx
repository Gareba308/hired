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


  return (
    <div
      className="w-full relative mx-auto scroll-my-12 print:p-12"
    >
      <section className="mx-auto bg-white print:shadow-none w-full max-w-4xl print:space-y-6">
          <div className="flex-1 w-full">
            <div>
              <div className="">
                <Section className="items-end -space-y-2 text-gray-700">
                  <div className="flex flex-col items-start leading-tight">
                    <p className="font-bold text-base text-gray-700">
                      {application.applicantName as string}
                      <span className="font-normal text-base">,</span>
                    </p>
                    <p className="text-base text-gray-700">{application.userEmail},</p>
                    {application.workerContact.map((contact, index) => (
                      <div key={index}>
                        {JSON.parse(JSON.stringify(contact)).postal && (
                          <p className="text-base">
                            P.O Box {JSON.parse(JSON.stringify(contact)).postal}
                            {JSON.parse(JSON.stringify(contact)).zip && (
                              <>-{JSON.parse(JSON.stringify(contact)).zip}</>
                            )}
                            ,
                          </p>
                        )}
                        {JSON.parse(JSON.stringify(contact)).town && (
                          <p className="text-base">
                            {JSON.parse(JSON.stringify(contact)).town}
                            {JSON.parse(JSON.stringify(contact)).county && (
                              <>,{JSON.parse(JSON.stringify(contact)).county}</>
                            )}
                            .
                          </p>
                        )}
                      </div>
                    ))}
                    <p className="underline text-base">
                      {format(application.createdAt, "PPP")}.
                    </p>
                  </div>
                </Section>
                <Section className="items-start -space-y-2 leading-tight text-gray-700">
                  <p className="font-bold text-base text-gray-700">
                    {application.companyName}
                    <span className="font-normal text-base">,</span>
                  </p>
                  {application.company.map((company, index) => (
                    <div key={index} className="-mt-3">
                      {JSON.parse(JSON.stringify(company)).postal && (
                        <p className="text-base">
                          P.O Box {JSON.parse(JSON.stringify(company)).postal}
                          {JSON.parse(JSON.stringify(company)).zip && (
                            <>-{JSON.parse(JSON.stringify(company)).zip}</>
                          )}
                          ,
                        </p>
                      )}
                      {JSON.parse(JSON.stringify(company)).town && (
                        <p className="text-base">
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
              <Section className="text-gray-700 mt-3">
                <p className="text-base">Dear Sir/Madam,</p>
                <h2 className="text-lg  -mt-1.5 font-bold text-gray-700 uppercase">
                  RE:{" "}
                  <span className="underline">
                    {application.jobTitle} Application
                  </span>
                </h2>
                <div className="-mt-1  text-base text-gray-700">
                  <QuillPreview
                    htmlContent={application.whyMostQualified as string}
                  />
                </div>
              </Section>
              <Section className="items-start flex flex-col mt-2 text-base w-full  -space-y-4 text-gray-700">
                <p className='w-full'>Yours faithfully,</p>
                <p className="text-gray-500 w-full">(Signed)</p>
                <p className='w-full'>{application.applicantName}.</p>
              </Section>
            </div>
          </div>
      </section>
    </div>
  );
};

export default CoverLetter;