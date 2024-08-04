"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import {
  ArrowBigRight,
  Loader2,
  MailIcon,
  MailPlus,
  MapPin,
  PhoneForwardedIcon,
  PhoneIcon,
  Printer,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Application } from "@prisma/client";
import QuillPreview from "@/components/QuillPreview";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

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
interface DocumentDetailsProps {
  document: DocumentsRenderItems;
}

export default function DocumentDetails({
  document: application,
}: DocumentDetailsProps) {
  function getInitials(fullName: string): string {
    const nameParts = fullName.split(" ");
    if (nameParts.length >= 2) {
      const initials =
        nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0);
      return initials.toUpperCase();
    }
    return fullName.charAt(0).toUpperCase();
  }

  return (
    <div className="w-full relative mx-auto">
      <section className="w-full print:space-y-6">
        <div className="flex-1 w-full">
          <div>
            <div className="flex items-center justify-between gap-x-4">
              <div className="flex-1 space-y-1.5">
                <h1 className="text-lg sm:text-xl font-bold text-gray-700">
                  {application.dbUser.name}
                </h1>
                <p className="max-w-2xl text-pretty text-sm text-gray-700">
                  {application.bio?.currentJobTitle}
                </p>
                <div className="max-w-md items-center text-pretty text-xs text-gray-700">
                  <div className="flex items-center gap-x-1.5 align-baseline hover:underline">
                    <MapPin className="h-4 w-4" />
                    {application.bio && <p>{application.bio?.county}</p>}
                  </div>
                </div>
                <div>
                  <div className="flex gap-x-1 pt-1 text-sm text-gray-700 print:hidden">
                    {application.contact?.email ? (
                      <Button className="" variant="outline" size="sm" asChild>
                        <a href={`mailto:${application.contact.email}`}>
                          <MailIcon className="w-5 -m-1 h-5" />
                        </a>
                      </Button>
                    ) : null}
                    {application.contact?.phone ? (
                      <Button className="" variant="outline" size="sm" asChild>
                        <a href={`tel:${application.contact.phone}`}>
                          <PhoneIcon className="w-5 -m-1 h-5" />
                        </a>
                      </Button>
                    ) : null}
                    {application.contact?.secondaryEmail ? (
                      <Button className="" variant="outline" size="sm" asChild>
                        <a
                          href={`mailto:${application.contact.secondaryEmail}`}
                        >
                          <MailPlus className="w-5 -m-1 h-5" />
                        </a>
                      </Button>
                    ) : null}
                    {application.contact?.secondaryPhone ? (
                      <Button className="" variant="outline" size="sm" asChild>
                        <a href={`tel:${application.contact.secondaryPhone}`}>
                          <PhoneForwardedIcon className="w-5 -m-1 h-5" />
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </div>
                <div className="hidden flex-col gap-x-1 text-sm text-gray-700 print:flex">
                  {application.contact && (
                    <div>
                      {application.contact?.email ? (
                        <a href={`mailto:${application.contact.email}`}>
                          <span className="underline">
                            {application.contact.email}
                          </span>
                        </a>
                      ) : null}
                      {application.contact?.phone ? (
                        <a href={`tel:${application.contact.phone}`}>
                          <span className="underline">
                            {application.contact.phone}
                          </span>
                        </a>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0 flex justify-end">
                {application.bio && (
                  <div>
                    {application.bio?.profilePic ? (
                      <div>
                        <div className="flex-none w-16 h-16 border rounded-sm border-gray-200 md:hidden bg-sky-100 text-indigo-600 flex items-center justify-center">
                          <Image
                            src={application.bio?.profilePic as string}
                            alt={application.bio?.name as string}
                            width={64}
                            className="rounded-sm"
                            height={64}
                          />
                        </div>
                        <div className="hidden flex-none w-20 h-20 border rounded-sm border-gray-200 bg-sky-100 text-indigo-600 md:flex items-center justify-center">
                          <Image
                            src={application.bio?.profilePic as string}
                            alt={application.bio?.name as string}
                            width={80}
                            className="rounded-sm"
                            height={80}
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex-none w-16 h-16 border rounded-sm border-gray-200 md:hidden bg-sky-100 text-indigo-600 flex items-center justify-center">
                          <Image
                            src={
                              "https://res.cloudinary.com/dx0i37cyd/image/upload/v1708947730/avatar-159236_1280_1_r7od9k.png"
                            }
                            alt="Profile Picture"
                            width={64}
                            className="rounded-sm"
                            height={64}
                            priority={true}
                          />
                        </div>
                        <div className="hidden flex-none w-20 h-20 border rounded-sm border-gray-200 bg-sky-100 text-indigo-600 md:flex items-center justify-center">
                          <Image
                            src={
                              "https://res.cloudinary.com/dx0i37cyd/image/upload/v1708947730/avatar-159236_1280_1_r7od9k.png"
                            }
                            alt="Profile Picture"
                            width={80}
                            className="rounded-sm"
                            height={80}
                            priority={true}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Section className="mt-4">
              <div className="flex items-center justify-between  border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold text-gray-700">
                  About
                </h2>
              </div>
              <div className="text-pretty text-sm text-gray-700">
                <QuillPreview
                  htmlContent={application.about?.about as string}
                />
              </div>
            </Section>
            <Section className="mt-4">
              <div className="flex items-center justify-between  border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold text-gray-700">
                  Work Experience
                </h2>
              </div>
              {application.experiences.length !== 0 &&
                application.experiences.flatMap((work) => {
                  return (
                    <Card key={work.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between gap-x-2 text-base">
                          <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold">
                            <a className="hover:underline text-gray-700">
                              {work.nameCompany}
                            </a>
                            <span className="inline-flex gap-x-1">
                              <Badge
                                variant="secondary"
                                className="align-middle fon rounded-sm text-gray-600 capitalize border border-slate-200 text-xs"
                              >
                                {work.employmentType}
                              </Badge>
                            </span>
                          </h3>
                          <div className="text-sm tabular-nums text-gray-600">
                            {work.startMonth as string}/
                            {work.startYear as string} -{" "}
                            {work.endMonth as string}/{work.endYear as string}
                          </div>
                        </div>

                        {work.position && (
                          <h4 className="text-sm font-semibold text-gray-600">
                            {work.position}
                          </h4>
                        )}
                      </CardHeader>
                      {work.description && (
                        <CardContent className="text-sm text-gray-700">
                          <QuillPreview
                            htmlContent={work.description as string}
                          />
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
            </Section>
            <Section className="mt-4">
              <div className="flex items-center justify-between  border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold text-gray-700">
                  Education
                </h2>
              </div>
              {application.tertiary.length !== 0 &&
                application.tertiary?.flatMap((education) => {
                  return (
                    <Card key={education.id}>
                      <CardHeader>
                        <div className="flex items-center text-gray-700 justify-between gap-x-2 text-base">
                          <h3 className="font-semibold text-gray-700">
                            {education.institution}
                          </h3>
                          <div className="text-sm tabular-nums text-gray-600">
                            {education.startMonth as string}/
                            {education.startYear as string} -{" "}
                            {education.endMonth as string}/
                            {education.endYear as string}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="mt-2 text-sm text-gray-700">
                        <p>{education.programArea}</p>
                        <p>{education.field}</p>
                        <p>{education.grade}</p>
                        <div>
                          <QuillPreview
                            htmlContent={education.activities as string}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              {application.secondary && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center text-gray-700 justify-between gap-x-2 text-base">
                      <h3 className="font-semibold text-gray-700">
                        {application.secondary.school}
                      </h3>
                      <div className="text-sm tabular-nums text-gray-600">
                        {application.secondary.startMonth as string}/
                        {application.secondary.startYear as string} -{" "}
                        {application.secondary.endMonth as string}/
                        {application.secondary.endYear as string}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-2 text-sm">
                    <p>{application.secondary.county}</p>
                  </CardContent>
                </Card>
              )}
            </Section>
            {application.skills?.skills.length !== 0 && (
              <Section className="mt-4">
                <div className="flex items-center justify-between  border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-700">
                    Candidate&apos;s Skills
                  </h2>
                </div>
                <ul
                  role="list"
                  className="grid grid-cols-1 pl-4 list-disc sm:grid-cols-2 gap-y-0.5 text-gray-700 text-sm"
                >
                  {application.skills?.skills?.map((skill: string) => {
                    return (
                      <li key={skill} className="">
                        {skill}
                      </li>
                    );
                  })}
                </ul>
              </Section>
            )}

            <Section className="mt-4">
              <div className="flex items-center justify-between  border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold text-gray-700">
                  Awards & Honours
                </h2>
              </div>
              {application.awards.flatMap((award) => {
                return (
                  <Card key={award.id}>
                    <CardHeader>
                      <div className="flex items-center text-gray-700 justify-between gap-x-2 text-base">
                        <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold">
                          <a
                            className="hover:underline text-gray-700"
                            href="#!"
                          >
                            {award.title}
                          </a>
                        </h3>
                        <div className="text-sm tabular-nums text-gray-600">
                          {award.awardedMonth as string}/
                          {award.awardedYear as string}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700">
                      <QuillPreview htmlContent={award.description as string} />
                    </CardContent>
                  </Card>
                );
              })}
            </Section>

            <Section className="mt-4">
              <div className="flex items-center justify-between  border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold text-gray-700">
                  Certifications
                </h2>
              </div>
              {application.certification.flatMap((item) => {
                return (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex text-gray-700 items-center justify-between gap-x-2 text-base">
                        <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold">
                          <a
                            className="hover:underline text-gray-700"
                            href="#!"
                          >
                            {item.certificateLicenseName}
                          </a>
                        </h3>
                        <div className="text-sm tabular-nums text-gray-600">
                          {item.validStartMonth as string}/
                          {item.validStartYear as string}-
                          {item.validEndMonth as string}/
                          {item.validEndYear as string}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700">
                      <QuillPreview htmlContent={item.description as string} />
                    </CardContent>
                  </Card>
                );
              })}
            </Section>

            <Section className="mt-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-700 border-b border-gray-200">
                Languages
              </h2>
              {application.languages.flatMap((item) => {
                return (
                  <Card key={item.id}>
                    <CardContent className="text-sm">
                      <p className="inline-flex text-gray-700 items-center justify-center gap-x-1 font-normal">
                        <span>{item.language}</span>
                        <ArrowBigRight className="h-4 w-4 mx-1" />
                        {item.proficiency}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </Section>
          </div>
        </div>
      </section>
    </div>
  );
}
