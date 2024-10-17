"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ResumeFAQs from "@/components/ResumeFAQs";

const ResumeBuild = () => {
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
          <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
        </svg>
      ),
      title: "Free Resume Creation",
      desc: "Create a professional, high-quality PDF resume for free with Hired. No hidden charges, just a simple and efficient resume tool for job seekers",
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
          <path d="m4 6 3-3 3 3" />
          <path d="M7 17V3" />
          <path d="m14 6 3-3 3 3" />
          <path d="M17 17V3" />
          <path d="M4 21h16" />
        </svg>
      ),
      title: "Automatic Resume Updates",
      desc: "Your resume updates instantly when you modify your profile or portfolio. Keep your resume current for active job seekers",
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
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
      ),
      title: "Download Anytime, Anywhere",
      desc: "Easily download your resume anytime from your account. Use it on Hired or anywhere else. Your resume is always accessible for applications",
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
          <path d="m12.99 6.74 1.93 3.44" />
          <path d="M19.136 12a10 10 0 0 1-14.271 0" />
          <path d="m21 21-2.16-3.84" />
          <path d="m3 21 8.02-14.26" />
          <circle cx="12" cy="5" r="2" />
        </svg>
      ),
      title: "Customizable Resume Content",
      desc: "Tailor your resume by updating your portfolio. Add new work experience, skills, and qualifications for automatic changes",
    },
  ];

  const stats = [
    {
      data: "500+",
      title: "Resumes Generated",
    },
    {
      data: "300+",
      title: "Feature Users",
    },
    {
      data: "95%",
      title: "User Satisfaction",
    },
  ];
  return (
    <>
      <div className="bg-white">
        <section className="sm:mt-5 mt-4 mx-auto max-w-screen-xl pb-4 px-4 items-center lg:flex md:px-8">
          <div className="space-y-3 flex-1 sm:text-center lg:text-left">
            <h1
              className="text-gray-700 font-extrabold text-4xl xl:text-5xl"
              title="Create professional resume for free"
            >
              Create professional resumes for
              <span className="text-green-800"> FREE</span>
            </h1>
            <p className="text-gray-700 text-base sm:text-[15px] max-w-xl leading-relaxed sm:mx-auto lg:ml-0">
              Create your FREE resume with our professional resume generation
              service! Connect with top employers in Kenya and enhance your job
              search. Stand out and land your dream job today!
            </p>
            <div>
              <p className="text-gray-700 py-3 text-base font-medium sm:text-[15px]">
                Would you like to generate you resume?
              </p>
              <div className="items-center w-full space-y-5 sm:justify-center sm:space-x-5 sm:space-y-0 sm:flex lg:justify-start">
                <Link
                  href="/home/login"
                  title="Generate a resume"
                  className="flex items-center justify-center  py-4 px-5 text-center w-full text-primary font-medium bg-gray-300 duration-150 hover:opacity-90 border border-gray-400 rounded-sm shadow-sm hover:shadow-none"
                >
                  Generate Free Resume
                </Link>
                <Link
                  href="/home/jobs/in/kenya"
                  title="Explore all available jobs in Kenya"
                  className="flex items-center w-full justify-center bg-white py-4 px-5 text-primary hover:text-sky-800 font-medium duration-150 active:bg-secondary border border-gray-300 rounded-sm md:inline-flex"
                >
                  Explore All Jobs
                </Link>
              </div>
            </div>
          </div>
          <div className="flex-1 text-center mt-4 lg:mt-0 lg:ml-3">
            <Image
              src={
                "https://res.cloudinary.com/dflvibeo6/image/upload/v1728816892/newHome_dgyyhf.png"
              }
              alt="resume Image"
              title="Resume Build Hero Image"
              width={1364}
              height={840}
              priority={true}
              quality={100}
              className="w-full mx-auto  lg:w-full rounded-xl bg-gray-900/10 p-2 lg:p-4 ring-1 ring-inset ring-gray-900/20 lg:rounded-2xl"
            />
          </div>
        </section>
        <section className="py-14 bg-gray-300">
          <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-primary text-3xl font-semibold sm:text-4xl">
                Resume Generation Metrics
              </h3>
              <div className="mt-3 text-primary text-sm sm:text-[15px]">
                Job seekers are loving our FREE resume generation services! With
                our easy-to-use platform, creating high-quality, professional
                resumes has never been simpler..
              </div>
            </div>
            <div className="mt-12">
              <ul className="flex flex-col items-center justify-center gap-y-8 sm:flex-row sm:flex-wrap lg:divide-x divide-gray-700">
                {stats.map((item, idx) => (
                  <li key={idx} className="text-center px-12 md:px-16">
                    <h4 className="text-4xl text-primary font-semibold">
                      {item.data}
                    </h4>
                    <p className="mt-3 font-medium text-primary">
                      {item.title}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section className="pt-14 max-w-screen-xl mx-auto pb-4 px-4 items-center lg:flex md:px-8">
          <div className="text-gray-600">
            <div className="max-w-xl mx-auto space-y-3 sm:text-center">
              <div>
                <h2
                  title="Why job seekers like us"
                  className="text-gray-700 text-3xl font-bold sm:text-4xl"
                >
                  Why Use Resume Generator
                </h2>
              </div>
            </div>
            <div className="mt-6">
              <ul className="grid gap-y-8 gap-x-12 sm:grid-cols-2 lg:grid-cols-2">
                {features.map((item, idx) => (
                  <li key={idx} className="flex gap-x-3.5 sm:gap-5">
                    <div className="flex-none w-12 h-12 bg-gray-100 text-primary rounded-lg flex items-center justify-center border-gray-100">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-lg text-gray-700 font-semibold">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-base sm:text-[15px]">
                        {item.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mx-auto mt-4 max-w-6xl">
                <div className="mt-4 flow-root sm:mt-8">
                  <div className="rounded-xl bg-gray-900/10 p-2 lg:p-4 ring-1 ring-inset ring-gray-900/20 lg:rounded-2xl">
                    <Image
                      src={
                        "https://res.cloudinary.com/dflvibeo6/image/upload/v1728904218/dest_zhrlun.png"
                      }
                      alt="Product Preview"
                      title="Candidates Build Free Resume Preview"
                      width={1364}
                      height={840}
                      priority={true}
                      quality={100}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="pt-14 max-w-screen-xl mx-auto pb-4 px-4 items-center lg:flex md:px-8">
          <div className="text-gray-600 w-full md:mx-auto md:flex md:flex-col md:justify-center md:items-center">
            <div className="max-w-xl mx-auto space-y-3 sm:text-center">
              <h2
                className="text-gray-700 text-3xl font-bold sm:text-4xl"
                title="Generate Free Resume Frequently Asked Questions"
              >
                Generate Free Resume FAQs
              </h2>
            </div>
            <ResumeFAQs />
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default ResumeBuild;
