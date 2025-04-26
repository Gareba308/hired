"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import dynamic from "next/dynamic";

const AdSenseAd = dynamic(() => import("@/components/Adsense"), { ssr: false });

interface JobSubCategory {
  subCategory: string | null;
}
interface HomePageProps {
  jobs: JobSubCategory[];
}

const HomePage = ({ jobs }: HomePageProps) => {
  type SubcategoryMapping = {
    [key: string]: string;
  };

  const categoryMapping: SubcategoryMapping = {
    ITSubcategory: "Information Technology (IT)",
    HealthcareSubcategory: "Healthcare and Medical",
    FinanceSubcategory: "Finance, Accounting & Insurance",
    SalesSubcategory: "Sales and Marketing",
    SecuritySubcategory: "Security and Law Enforcement",
    EducationSubcategory: "Education and Teaching",
    CustomerSubcategory: "Customer Service and Support",
    EngineeringSubcategory: "Engineering, Repair & Maintenance",
    AgricultureSubcategory: "Agriculture and Farming",
    FishingSubcategory: "Fishing and Blue Economy",
    AdministrativeSubcategory: "Administrative & Office Support",
    ManufacturingSubcategory: "Manufacturing and Production",
    HRSubcategory: "Human Resources",
    SportsSubcategory: "Sports and Entertainment",
    BuildingSubcategory: "Building, Construction, Electric",
    RetailSubcategory: "Retail and Sales",
    HospitalitySubcategory: "Hospitality, Travel and Tourism",
    LegalSubcategory: "Legal and Compliance",
    ResearchSubcategory: "Science, Research, M&E",
    MediaSubcategory: "Media, Communications, Films & Art",
    TransportationSubcategory: "Transportation and Logistics",
    RealEstateSubcategory: "Real Estate",
    SocialSubcategory: "Social Services and Non-Profit",
    ConsultingSubcategory: "Consulting",
  };

  const slugify = (str: string): string => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");
  };
  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
          />
        </svg>
      ),
      title: "Easily Check Job Qualifications",
      desc: "Explore jobs in Kenya and instantly see your qualification percentage. Ensure you're the perfect fit for career opportunities.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
          />
        </svg>
      ),
      title: "Earn Rewards by Referring Job Seekers",
      desc: "Refer other job seekers and earn rewards. Grow your network, find work opportunities, and boost your income while helping others.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      ),
      title: "Personalized Career Tools",
      desc: "Create custom resumes and cover letters to stand out to employers. Personalize your profile and showcase your skills for jobs",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"
          />
        </svg>
      ),
      title: "Streamlined Job Application Process",
      desc: "Easily apply for jobs, manage applications, and track progress. Stay organized with our intuitive dashboard designed for job seekers.",
    },
  ];
  const featuresEmployer = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
          />
        </svg>
      ),
      title: "Assess and Select Top Talent",
      desc: "For jobs in Kenya, employers utilize assessments to identify candidates with the right knowledge, skills, and experience.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
          />
        </svg>
      ),
      title: "Direct Employer Communication",
      desc: "Companies and employers can easily and directly engage with admins and job candidates using our messaging system.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      ),
      title: "Earn Credits for Job Posting",
      desc: "Refer employers to earn credits, which you can use to post jobs. Expand your access to job market and reduce recruiting costs.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"
          />
        </svg>
      ),
      title: "Analytics Dashboard for Employers",
      desc: "Track applicant progress and performance with our data-driven analytics. Employers can easily make informed hiring decisions.",
    },
  ];

  const stats = [
    {
      data: "12K",
      title: "Candidates",
    },
    {
      data: "215+",
      title: "Job Listings",
    },
    {
      data: "4k+",
      title: "Applications",
    },
    {
      data: "61K+",
      title: "Total Views",
    },
  ];

  const testimonials = [
    {
      avatar:
        "https://res.cloudinary.com/dx0i37cyd/image/upload/v1708947730/avatar-159236_1280_1_r7od9k.png",
      name: "Francis K.",
      title: "An Employer",
      quote:
        "Hired revolutionized our hiring with seamless candidate matching, analytics, and a cost-saving referral system.",
    },
    {
      avatar:
        "https://res.cloudinary.com/dx0i37cyd/image/upload/v1708947730/avatar-159236_1280_1_r7od9k.png",
      name: "George W.",
      title: "Job Seeker",
      quote:
        "I found my perfect job quickly with easy qualification checks and earned rewards by referring friends",
    },
    {
      avatar:
        "https://res.cloudinary.com/dx0i37cyd/image/upload/v1708947730/avatar-159236_1280_1_r7od9k.png",
      name: "Micheal O.",
      title: "Job Seeker",
      quote:
        "Hired's custom resumes and job listings made my job search smooth and successful",
    },
  ];

  const uniqueSubCategories = jobs.reduce((acc: string[], job) => {
    const subCategory = job.subCategory;
    if (
      subCategory &&
      !acc.includes(subCategory) &&
      !subCategory.startsWith("Other")
    ) {
      acc.push(subCategory);
    }
    return acc;
  }, []);
  return (
    <>
      <div className="bg-white">
        <header>
          <Navbar />
        </header>
        <section className="sm:mt-5 mt-4 mx-auto max-w-screen-xl pb-4 px-4 items-center lg:flex md:px-8">
          <div className="space-y-4 flex-1 sm:text-center lg:text-left">
            <div>
              <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20">
                Experience unmatched quality; Kenya&apos;s INDEED.
              </span>
            </div>
            <h1
              className="text-gray-700 font-extrabold text-4xl xl:text-5xl"
              title="Connecting top talent to employers"
            >
              Connecting<span className="text-sky-700"> Top Talent</span>{" "} To
              Employers
            </h1>
            <p className="text-gray-700 text-base sm:text-[15px] max-w-xl leading-relaxed sm:mx-auto lg:ml-0">
              Explore top jobs in Kenya, remote jobs, freelance opportunities,
              and ways to earn money online with trusted employers and career
              platforms.
            </p>
            <div>
              <p className="text-gray-700 py-3 text-base font-medium sm:text-[15px]">
                Would you like to see how we can help you?
              </p>
              <div className="items-center w-full space-y-5 sm:justify-center sm:space-x-5 sm:space-y-0 sm:flex lg:justify-start">
                <Link
                  href="/home/login"
                  title="Explore available jobs"
                  className="flex items-center justify-center gap-x-2 py-4 px-5 text-center w-full text-white font-medium bg-primary duration-150 hover:opacity-90 rounded-sm shadow-sm hover:shadow-none"
                >
                  Find your next job
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
                    className="h-5 w-5"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/home/login/enterprises"
                  title="Hire a job seeker"
                  className="flex items-center w-full justify-center bg-gray-300 gap-x-2 py-4 px-5 text-primary hover:text-sky-700 font-medium duration-150 active:bg-gray-100 border rounded-sm md:inline-flex"
                >
                  Find your next hire
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
                    className="h-5 w-5"
                  >
                    <path d="M17 12H3" />
                    <path d="m11 18 6-6-6-6" />
                    <path d="M21 5v14" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex-1 text-center mt-4 lg:mt-0 lg:ml-3">
            <Image
              src={
                "https://res.cloudinary.com/dflvibeo6/image/upload/v1728827079/HomeBest_okwrnr.png"
              }
              alt="Hero Image"
              title="Hero Image"
              width={1364}
              height={840}
              priority={true}
              quality={100}
              className="w-full mx-auto  lg:w-full rounded-xl bg-gray-900/10 p-2 lg:p-4 ring-1 ring-inset ring-gray-900/20 lg:rounded-2xl"
            />
          </div>
        </section>
        <section className="py-14 bg-primary">
          <div className="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h3
                title="Why our customers are happy"
                className="text-primary-foreground text-3xl font-semibold sm:text-4xl"
              >
                Platform Users Are Always Happy
              </h3>
              <p className="mt-3 text-primary-foreground text-sm sm:text-[15px]">
                Employers and job seekers are consistently satisfied with
                reliable matches, a seamless user experience, and comprehensive
                support.
              </p>
            </div>
            <div className="mt-12">
              <ul className="flex flex-col items-center justify-center gap-y-10 sm:flex-row sm:flex-wrap lg:divide-x">
                {stats.map((item, idx) => (
                  <li key={idx} className="text-center px-12 md:px-16">
                    <h4 className="text-4xl text-primary-foreground font-semibold">
                      {item.data}
                    </h4>
                    <p className="mt-3 font-medium text-primary-foreground">
                      {item.title}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section className="pt-3 sm max-w-screen-xl mx-auto pb-2 px-4 items-center sm:justify-center lg:flex md:px-4">
          <AdSenseAd />
        </section>
        <section className="pt-14 max-w-screen-xl mx-auto pb-4 px-4 items-center lg:flex md:px-8">
          <div className="text-gray-600">
            <div className="max-w-xl mx-auto space-y-3 sm:text-center">
              <div>
                <span className="inline-flex items-center rounded-sm bg-gray-200 px-2 py-1 text-base font-medium text-gray-700">
                  Are you talented?
                </span>
                <h2
                  title="Why job seekers like us"
                  className="text-gray-700 text-3xl font-bold sm:text-4xl"
                >
                  Why Job Seekers Love Us
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
                        "https://res.cloudinary.com/dflvibeo6/image/upload/v1724945971/Screenshot_11_c84nxd.png"
                      }
                      alt="Product Preview"
                      title="Candidates Product Preview"
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
          <div className="text-gray-600">
            <div className="max-w-xl mx-auto space-y-3 sm:text-center">
              <div>
                <span className="inline-flex items-center rounded-sm bg-gray-200 px-2 py-1 text-base font-medium text-gray-700 border-gray-100">
                  Do you need talent?
                </span>
                <h2
                  className="text-gray-700 text-3xl font-bold sm:text-4xl"
                  title="Why employers like us"
                >
                  Why Recruiters Love Us
                </h2>
              </div>
            </div>
            <div className="mt-6">
              <ul className="grid gap-y-8 gap-x-12 sm:grid-cols-2 lg:grid-cols-2">
                {featuresEmployer.map((item, idx) => (
                  <li key={idx} className="flex gap-x-3.5 sm:gap-5">
                    <div className="flex-none w-12 h-12 bg-gray-100 text-primary rounded-lg flex items-center justify-center">
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
              <div className="mx-auto mt-4 max-w-6xl mb-4">
                <div className="mt-4 flow-root sm:mt-8">
                  <div className="rounded-xl bg-gray-900/10 ring-1  p-2 lg:p-4 ring-inset ring-gray-900/20 lg:rounded-2xl">
                    <Image
                      src={
                        "https://res.cloudinary.com/dflvibeo6/image/upload/v1725101412/Screenshot_13_axgg2d.png"
                      }
                      alt="Product Preview"
                      title="Employer Product Preview"
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
        <section className="relative pt-14 pb-4">
          <div className="relative z-10 max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="max-w-xl sm:text-center md:mx-auto">
              <h3
                className="text-primary-foreground text-3xl font-semibold sm:text-4xl"
                title="Testmonials"
              >
                Testimonials from Platform Users
              </h3>
              <p className="mt-2 text-primary-foreground text-sm sm:text-[15px]">
                Platform users appreciate the seamless experience, professional
                service, and effective results, often recommending it to others
                for its high quality and reliability.
              </p>
            </div>
            <div className="mt-8">
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((item, idx) => (
                  <li
                    key={idx}
                    className="bg-white rounded-xl border border-gray-300 shadow-sm flex flex-col"
                  >
                    <div className="p-4 flex-grow">
                      <svg
                        className="w-9 h-9 text-gray-300"
                        viewBox="0 0 35 35"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.47895 14.5833C9.15374 14.5833 8.84166 14.6329 8.53103 14.6781C8.63166 14.3398 8.7352 13.9956 8.90145 13.6865C9.0677 13.2373 9.32728 12.8479 9.58541 12.4556C9.80124 12.0312 10.1819 11.7439 10.4619 11.3808C10.755 11.0279 11.1546 10.7931 11.471 10.5C11.7817 10.1937 12.1885 10.0406 12.5123 9.82478C12.8506 9.63082 13.1452 9.41645 13.4602 9.31437L14.2462 8.99062L14.9375 8.70332L14.2302 5.87708L13.3596 6.08707C13.081 6.15707 12.7412 6.23874 12.3548 6.33645C11.9596 6.40937 11.5381 6.60916 11.0685 6.79145C10.6048 6.99853 10.0681 7.13853 9.56937 7.47103C9.0677 7.78895 8.48874 8.05437 7.97833 8.4802C7.48395 8.91916 6.88749 9.29978 6.44708 9.85833C5.96583 10.3804 5.49041 10.9287 5.12145 11.5529C4.69416 12.1479 4.40395 12.8012 4.0977 13.4473C3.82062 14.0933 3.59749 14.754 3.4152 15.3956C3.06958 16.6819 2.91499 17.904 2.8552 18.9496C2.80562 19.9967 2.83478 20.8673 2.89603 21.4973C2.91791 21.7948 2.95874 22.0835 2.98791 22.2833L3.02437 22.5283L3.06228 22.5196C3.32167 23.7312 3.91877 24.8446 4.78452 25.7311C5.65028 26.6175 6.7493 27.2408 7.95447 27.5287C9.15963 27.8166 10.4217 27.7575 11.5946 27.3581C12.7676 26.9587 13.8035 26.2354 14.5825 25.2719C15.3616 24.3083 15.8519 23.1439 15.9969 21.9133C16.1418 20.6828 15.9353 19.4363 15.4014 18.3181C14.8675 17.2 14.028 16.2558 12.9799 15.5949C11.9318 14.934 10.718 14.5832 9.47895 14.5833ZM25.5206 14.5833C25.1954 14.5833 24.8833 14.6329 24.5727 14.6781C24.6733 14.3398 24.7769 13.9956 24.9431 13.6865C25.1094 13.2373 25.369 12.8479 25.6271 12.4556C25.8429 12.0312 26.2235 11.7439 26.5035 11.3808C26.7967 11.0279 27.1962 10.7931 27.5127 10.5C27.8233 10.1937 28.2302 10.0406 28.554 9.82478C28.8923 9.63082 29.1869 9.41645 29.5019 9.31437L30.2879 8.99062L30.9792 8.70332L30.2719 5.87708L29.4012 6.08707C29.1227 6.15707 28.7829 6.23874 28.3965 6.33645C28.0012 6.40937 27.5798 6.60916 27.1102 6.79145C26.6479 6.99999 26.1098 7.13853 25.611 7.47249C25.1094 7.79041 24.5304 8.05582 24.02 8.48166C23.5256 8.92062 22.9292 9.30124 22.4887 9.85833C22.0075 10.3804 21.5321 10.9287 21.1631 11.5529C20.7358 12.1479 20.4456 12.8012 20.1394 13.4473C19.8623 14.0933 19.6392 14.754 19.4569 15.3956C19.1112 16.6819 18.9567 17.904 18.8969 18.9496C18.8473 19.9967 18.8765 20.8673 18.9377 21.4973C18.9596 21.7948 19.0004 22.0835 19.0296 22.2833L19.066 22.5283L19.104 22.5196C19.3633 23.7312 19.9604 24.8446 20.8262 25.7311C21.6919 26.6175 22.791 27.2408 23.9961 27.5287C25.2013 27.8166 26.4634 27.7575 27.6363 27.3581C28.8093 26.9587 29.8452 26.2354 30.6242 25.2719C31.4033 24.3083 31.8936 23.1439 32.0385 21.9133C32.1834 20.6828 31.977 19.4363 31.4431 18.3181C30.9092 17.2 30.0697 16.2558 29.0216 15.5949C27.9735 14.934 26.7597 14.5832 25.5206 14.5833Z"
                          fill="currentColor"
                        />
                      </svg>
                      <figure className="flex h-full flex-col justify-between pb-4">
                        <blockquote>
                          <p className="text-gray-600 text-base sm:text-lg font-medium px-4 pt-1">
                            {item.quote}
                          </p>
                        </blockquote>
                        <div className="flex items-center gap-x-4 px-4 pb-2">
                          <div className="relative cursor-pointer border border-gray-300 h-[56px] w-[56px] overflow-hidden rounded-full">
                            <Image
                              src={item.avatar}
                              alt="Testimonial user"
                              title="Testimonial user"
                              quality={100}
                              fill
                              sizes="100%"
                              priority
                            />
                          </div>
                          <div>
                            <span className="block text-gray-700 font-semibold">
                              {item.name}
                            </span>
                            <span className="block text-sky-700 font-medium text-sm mt-0.5">
                              {item.title}
                            </span>
                          </div>
                        </div>
                      </figure>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div
            className="absolute top-0 w-full h-[350px]"
            style={{
              background: "#1e293b",
            }}
          ></div>
        </section>
        <section className="pt-3 sm max-w-screen-xl mx-auto pb-2 px-4 items-center sm:justify-center lg:flex md:px-4">
          <AdSenseAd />
        </section>
        {uniqueSubCategories.length > 0 && (
          <section className="pt-10 sm max-w-screen-xl mx-auto pb-4 px-4 items-center sm:justify-center lg:flex md:px-4">
            <div className="text-gray-600 w-full md:mx-auto md:flex md:flex-col md:justify-center md:items-center">
              <div className="max-w-xl mx-auto space-y-3 sm:text-center">
                <h2
                  className="text-gray-700 text-3xl font-bold sm:text-4xl"
                  title="Explore jobs by profession"
                >
                  Explore Jobs by Profession
                </h2>
              </div>
              <div className="mt-4 sm:mx-auto grid">
                <ul className="text-gray-600 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-8 lg:gap-x-10 gap-y-2.5">
                  {uniqueSubCategories.map((subCategory) => (
                    <li key={subCategory}>
                      <Link
                        href={`/home/jobs/subcategory/${slugify(subCategory)}`}
                        title={`Open ${subCategory}`}
                        className="hover:text-blue-700 line-clamp-1 text-base duration-150"
                      >
                        {subCategory}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
