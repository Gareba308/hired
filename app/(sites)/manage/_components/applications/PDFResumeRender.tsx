"use client";

import React from "react";
import { Application} from "@prisma/client";
import UploadedResume from "./UploadedResume";

interface ResumeRenderProps {
  application: Application;
}

const PDFResumeRender = ({ application }: ResumeRenderProps) => {
  return (
    <main>
      <section aria-labelledby="products-heading" className="pb-4">
        <div className="flex flex-col">
          <div className="lg:col-span-3 w-full mx-auto lg:max-h-[calc(100vh-165px)] lg:overflow-y-auto h-full lg:mr-2">
            <h3 className="font-bold text-gray-600 tracking-tight text-xl mt-2 sm:text-2xl lg:text-3xl">
              Uploaded Resume
            </h3>
            <div className="pb-3">
              <UploadedResume application={application} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PDFResumeRender;
