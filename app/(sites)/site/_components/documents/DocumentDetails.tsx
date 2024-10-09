"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
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
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/Preview";

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
  return (
    <div className="w-full relative mx-auto">
      <section className="w-full print:space-y-4">
        <div className="flex-1 w-full">
          <div>
            <div className="w-full flex flex-col leading-tight items-center justify-center">
              <h1 className="text-2xl font-bold text-gray-600">
                {application.dbUser.name}
              </h1>
              <p className="-mt-0.5 text-gray-600 text-sm">
                <span className="text-sm">{application.contact?.county}</span>{" "}
                {application.bio?.citizen && (
                  <span>{application.bio?.citizen}</span>
                )}
              </p>
              <div className="flex gap-x-1 items-center h-4">
                {application.contact?.email && (
                  <p className="text-pretty text-sm text-gray-600">
                    {application.contact?.email}
                  </p>
                )}
                {application.contact?.email && (
                  <Separator orientation="vertical" />
                )}
                {application.contact?.phone && (
                  <p className="text-pretty text-sm text-gray-600">
                    {application.contact?.phone}
                  </p>
                )}
              </div>
            </div>
            <Section className="mt-1 w-full">
              <div className="flex items-center justify-between  border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold text-gray-600">
                  Summary
                </h2>
              </div>
              <div className="text-pretty -mt-0.5 text-sm text-gray-600">
                <Preview value={application.about?.about as string} />
              </div>
            </Section>
            <Section className="mt-2 w-full">
              <div className="flex items-center justify-between  border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold text-gray-600">
                  Work Experience
                </h2>
              </div>
              {application.experiences.length !== 0 &&
                application.experiences.flatMap((work) => {
                  return (
                    <Card key={work.id} className="-mt-0.5">
                      <CardHeader>
                        <div className="flex items-center justify-between gap-x-2 text-base">
                          <h3 className="flex items-center h-4 gap-x-1 font-semibold">
                            <span className="hover:underline text-gray-600 line-clamp-1">
                              {work.position}
                            </span>
                            {work.employmentType && (
                              <Separator orientation="vertical" />
                            )}
                            <span className="text-gray-600 line-clamp-1 text-xs font-normal">
                              {work.employmentType}
                            </span>
                          </h3>
                          <div className="text-sm line-clamp-1 tabular-nums text-gray-600">
                            {work.startMonth as string}/
                            {work.startYear as string} -{" "}
                            {work.endMonth && work.endYear ? (
                              <span>
                                {work.endMonth as string}/
                                {work.endYear as string}
                              </span>
                            ) : (
                              <>Present</>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between w-full">
                          {work.position && (
                            <h4 className="text-sm line-clamp-1 font-medium italic text-gray-600">
                              {work.nameCompany}
                            </h4>
                          )}
                          <div>
                            {work.location && (
                              <h3 className="text-sm font line-clamp-1 normal italic text-gray-600">
                                {work.location}
                              </h3>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      {work.description && (
                        <CardContent className="text-sm text-gray-600">
                          <Preview value={work.description as string} />
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
            </Section>
            <Section className="mt-2 w-full">
              <div className="flex items-center justify-between  border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold text-gray-600">
                  Education
                </h2>
              </div>
              {application.tertiary.length !== 0 &&
                application.tertiary?.flatMap((education) => {
                  return (
                    <Card key={education.id} className="-mt-0.5">
                      <CardHeader>
                        <div className="flex items-center text-gray-600 justify-between gap-x-2 text-base">
                          <h3 className="font-semibold line-clamp-1 text-gray-600">
                            {education.institution}
                          </h3>
                          <div className="text-sm line-clamp-1 tabular-nums text-gray-600">
                            {education.startMonth as string}/
                            {education.startYear as string} -{" "}
                            {education.endMonth as string}/
                            {education.endYear as string}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="mt-1 text-sm text-gray-600">
                        <p className="font-medium">{education.programArea}</p>
                        <p className="font-medium">{education.field}</p>
                        <p className="font-medium">{education.grade}</p>
                        <div>
                          <Preview value={education.activities as string} />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              {application.secondary && (
                <Card className="-mt-0.5">
                  <CardHeader>
                    <div className="flex items-center text-gray-600 justify-between gap-x-2 text-base">
                      <h3 className="font-semibold line-clamp-1 text-gray-600">
                        {application.secondary.school}
                      </h3>
                      <div className="text-sm tabular-nums line-clamp-1 text-gray-600">
                        {application.secondary.startMonth as string}/
                        {application.secondary.startYear as string} -{" "}
                        {application.secondary.endMonth as string}/
                        {application.secondary.endYear as string}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-1 text-sm">
                    <p>{application.secondary.county}</p>
                  </CardContent>
                </Card>
              )}
            </Section>
            {application.skills?.skills.length !== 0 && (
              <Section className="mt-2 w-full">
                <div className="flex items-center justify-between  border-b border-gray-200">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-600">
                    Skills Summary
                  </h2>
                </div>
                <ul
                  role="list"
                  className="grid grid-cols-1 -mt-.5 pl-4 list-disc sm:grid-cols-2 gap-y-0.5 text-gray-600 text-sm"
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

            <Section className="mt-2 w-full">
              <div className="flex items-center justify-between  border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold text-gray-600">
                  Awards & Honours
                </h2>
              </div>
              {application.awards.flatMap((award) => {
                return (
                  <Card key={award.id} className="-mt-0.5">
                    <CardHeader>
                      <div className="flex items-center text-gray-600 justify-between gap-x-2 text-base">
                        <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold">
                          <span className="hover:underline line-clamp-1 text-gray-600">
                            {award.title}
                          </span>
                        </h3>
                        <div className="text-sm line-clamp-1 tabular-nums text-gray-600">
                          {award.awardedMonth as string}/
                          {award.awardedYear as string}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-600">
                      <Preview value={award.description as string} />
                    </CardContent>
                  </Card>
                );
              })}
            </Section>

            <Section className="mt-2 w-full">
              <div className="flex items-center justify-between  border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold text-gray-600">
                  Certifications
                </h2>
              </div>
              {application.certification.flatMap((item) => {
                return (
                  <Card key={item.id} className="-mt-0.5">
                    <CardHeader>
                      <div className="flex text-gray-600 items-center justify-between gap-x-2 text-base">
                        <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold">
                          <span className="hover:underline line-clamp-1 text-gray-600">
                            {item.certificateLicenseName}
                          </span>
                        </h3>
                        <div className="text-sm line-clamp-1 tabular-nums text-gray-600">
                          {item.validStartMonth as string}/
                          {item.validStartYear as string}-
                          {item.validEndMonth as string}/
                          {item.validEndYear as string}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-600">
                      <Preview value={item.description as string} />
                    </CardContent>
                  </Card>
                );
              })}
            </Section>

            <Section className="mt-2 w-full">
              <h2 className="text-lg sm:text-xl font-bold text-gray-600 border-b border-gray-200">
                Languages
              </h2>
              {application.languages.flatMap((item) => {
                return (
                  <Card key={item.id} className="-mt-0.5">
                    <CardContent className="text-sm">
                      <p className="inline-flex text-gray-600 items-center justify-center gap-x-1 font-normal">
                        <span className="font-medium">{item.language}</span>:{" "}
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
