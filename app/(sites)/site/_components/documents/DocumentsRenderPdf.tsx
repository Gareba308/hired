"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import {
  About,
  Award,
  CertificationLicense,
  Experience,
  Language,
  Resume,
  SecondaryEducation,
  Skills,
  TertiaryEducation,
  User,
  WorkerBio,
  WorkerContact,
} from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import MyPdfDocument from "./MyPdfDocument";

interface DocumentsRenderItems {
  dbUser: User;
  about: About | null;
  experiences: Experience[];
  secondary: SecondaryEducation | null;
  tertiary: TertiaryEducation[];
  bio: WorkerBio | null;
  certification: CertificationLicense[];
  awards: Award[];
  languages: Language[];
  contact: WorkerContact | null;
  resume: Resume | null;
  skills: Skills | null;
}

interface DocumentsRenderProps {
  document: DocumentsRenderItems;
}

const DocumentsRenderPdf = ({
  document: application,
}: DocumentsRenderProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const origin = searchParams?.get("origin");

  const functionOpenResume = (resumeURL: string) => {
    if (resumeURL) {
      window.open(resumeURL, "_blank");
    } else {
      toast({
        title: "No resume available",
        description:
          "Sorry, you have not uploaded a resume. Upload to be able to open in this section",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const printDivCandidate = () => {
    const printableArea = document.getElementById("divToPrint");
    if (printableArea) {
      window.print();
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
    <>
      <MyPdfDocument document={application} />
    </>
  );
};

export default DocumentsRenderPdf;
