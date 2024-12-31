"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CornerUpLeft, Edit, GitPullRequest } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { PickAssessmentAlertModal } from "../models/assessments/PickAssessmentAlertModal";
import { useRouter } from "next/navigation";
import { AssessmentBanner } from "@prisma/client";
import { EmployerAcceptAssessmentAlertModal } from "../models/assessments/AcceptAssessment";

interface EmployerAssessProps {
  banners: AssessmentBanner[];
  demoBanners: AssessmentBanner[];
}
const EmployerAssess = ({ banners, demoBanners }: EmployerAssessProps) => {
  const router = useRouter();
  const [pickOpen, setPickOpen] = useState<boolean>(false);
  const pickClose = () => {
    setPickOpen((prev) => !prev);
  };

  const togglePick = () => {
    setPickOpen(true);
  };
  const pickConfirm = () => {
    setPickOpen((prev) => !prev);
  };

  const [demoOpen, setDemoOpen] = useState<boolean>(false);
  const demoClose = () => {
    setDemoOpen((prev) => !prev);
  };

  const demoConfirm = () => {
    setDemoOpen((prev) => !prev);
  };

  const toggleDemo = () => {
    setDemoOpen(true);
  };
  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
          <path d="m12 12 4 10 1.7-4.3L22 16Z" />
        </svg>
      ),
      title: "1. Select Assessment",
      desc: "Choose an assessment that aligns with your organization's specific needs and category from our available test options.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
          <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
        </svg>
      ),
      title: "2. Top Up Account",
      desc: "To make your assessment available to candidates, please ensure you have sufficient funds in your account balance.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <line x1="10" x2="21" y1="6" y2="6" />
          <line x1="10" x2="21" y1="12" y2="12" />
          <line x1="10" x2="21" y1="18" y2="18" />
          <path d="M4 6h1v4" />
          <path d="M4 10h2" />
          <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
        </svg>
      ),
      title: "3. List a Job",
      desc: "After selecting and purchasing an assessment, you can post your job. The assessment will be mandatory for candidates before they apply.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M7 7v10" />
          <path d="M11 7v10" />
          <path d="m15 7 2 10" />
        </svg>
      ),
      title: "4. Access Results",
      desc: "Access the dashboard to view all available job applications and their corresponding assessment scores.",
    },
  ];
  return (
    <section className="relative max-w-screen-xl mx-auto pb-4">
      <div className="border-b border-gray-200 pb-1 flex items-center">
        <Link href="/control/assessments" className="hover:text-[#005580]">
          <CornerUpLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 mr-1.5 sm:mr-2.5 shrink-0" />
        </Link>
        <h3 className="text-3xl text-center lg:text-start tracking-tight text-gray-600 font-bold md:text-3xl">
          Candidate&apos;s <span className="font-bold">Assessments</span>
        </h3>
      </div>

      <section className="mx-auto max-w-screen-xl pb-4 mt-4 items-center lg:flex">
        <div className="space-y-4 flex-1 sm:text-center lg:text-left">
          <h1 className="text-gray-700 font-extrabold text-3xl md:text-4xl xl:text-5xl">
            Assessment of Candidates&apos;
            <span className="text-[#005580]"> Skills</span>
          </h1>
          <p className="text-gray-500 text-base sm:text-[15px] max-w-xl leading-relaxed sm:mx-auto lg:ml-0">
            We have streamlined the process of finding and identifying talented
            candidates with the right skills and knowledge to meet your
            organization&apos;s needs. The assessment is designed to facilitate
            this process efficiently and effectively.
          </p>
          <div>
            <PickAssessmentAlertModal
              isOpen={pickOpen}
              onClose={pickClose}
              onConfirm={pickConfirm}
              banners={banners}
            />
            <div className="items-center space-y-5 sm:justify-center sm:space-x-5 sm:space-y-0 sm:flex lg:justify-start">
              <a
                onClick={() => togglePick()}
                className="flex items-center py-4 px-5 text-center cursor-pointer text-white font-medium bg-primary duration-150 hover:opacity-90 rounded-sm shadow-lg hover:shadow-none"
              >
                Assess Candidates&apos; Skills
                <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5 ml-1.5 shrink-0" />
              </a>
            </div>
          </div>
        </div>
        <div className="flex-1 text-center mt-4 lg:mt-0 lg:ml-3">
          <Image
            src={
              "https://res.cloudinary.com/dflvibeo6/image/upload/v1725101412/Screenshot_13_axgg2d.png"
            }
            alt="Landing job hero"
            width={1364}
            height={840}
            priority={true}
            quality={100}
            className="w-full mx-auto  lg:w-full rounded-xl bg-gray-900/5 p-2 lg:p-4 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl"
          />
        </div>
      </section>

      <section className="relative mt-2 py-10 bg-gray-900 -mx-4 md:-mx-5">
        <div className="relative max-w-screen-xl mx-auto px-4 text-gray-300 justify-between gap-24 md:px-8">
          <div className="max-w-2xl">
            <h3 className="text-white text-2xl font-semibold sm:text-3xl">
              How Are Skills Assessments Conducted?
            </h3>
            <p className="mt-3 text-base sm:text-[15px]">
              Our team meticulously crafts these assessments, taking them
              through various stages of development and evaluation to ensure
              they meet the highest standards.
            </p>
            <p className="mt-1 text-base sm:text-[15px]">
              This process guarantees that your organization will be able to
              identify and select the most qualified candidates. Assessment will
              be charged{" "}
              <span className="font-bold underline">Kshs. 10,000.</span>
            </p>
          </div>
          <div className="mt-8 lg:mt-6">
            <ul className="grid gap-8 sm:grid-cols-2">
              {features.map((item, idx) => (
                <li key={idx} className="flex gap-x-4">
                  <div className="flex-none w-12 h-12 bg-gray-700 text-cyan-400 rounded-lg flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-lg text-gray-100 font-semibold">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-base font-normal">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-5">
            <p className="text-sm italic">
              <b className="not-italic">Note:</b> In the event of insufficient
              balance, you will need to top up in the pricing section.
            </p>
          </div>
        </div>
        <div
          className="absolute inset-0 max-w-md mx-auto h-72 blur-[118px]"
          style={{
            background:
              "linear-gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.26) 34.2%, rgba(192, 132, 252, 0.1) 77.55%)",
          }}
        ></div>
      </section>

      <section>
        <div className="relative z-10 gap-2 items-center lg:flex">
          <div className="flex-1 max-w-lg py-5 sm:mx-auto sm:text-center lg:max-w-max lg:text-left">
            <h3 className="text-3xl text-center lg:text-start tracking-tight text-gray-600 font-bold md:text-3xl">
              Request a <span className="font-bold text-[#005580]">Demo</span>?
            </h3>
            <p className="text-gray-600 text-base sm:text-[15px] leading-normal mt-2">
              Identify and select candidates who possess the
              <span className="font-semibold">
                {" "}
                skills, qualifications, and knowledge
              </span>{" "}
              that align with the core activities and requirements of your
              organization.
            </p>
            <div className="flex items-center justify-center lg:justify-start">
              <EmployerAcceptAssessmentAlertModal
                isOpen={demoOpen}
                onClose={demoClose}
                onConfirm={demoConfirm}
                banners={demoBanners}
              />
              <Button
                size="lg"
                variant="default"
                onClick={() => toggleDemo()}
                type="button"
                className="hover:bg-primary mt-5 hover:opacity-90 font-normal"
              >
                Request Demo
                <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5 shrink-0 ml-1.5" />
              </Button>
            </div>
          </div>
          <div className="flex-1 relative shrink-0 mx-auto sm:w-9/12 lg:mt-0 lg:w-auto">
            <Image
              src="https://res.cloudinary.com/dx0i37cyd/image/upload/v1711428882/bwink_ppl_05_single_08_ehxwmt.jpg"
              alt="Start Messaging"
              height={400}
              width={400}
              quality={100}
              priority={true}
            />
          </div>
        </div>
        <div>
          <p className="text-gray-600 text-sm leading-normal italic">
            <span className="font-medium mr-1.5 not-italic">Note:</span> This
            demonstration will illustrate how our skills assessments are
            presented to candidates, helping you identify and select the most
            qualified individuals.
          </p>
        </div>
      </section>
    </section>
  );
};

export default EmployerAssess;
