"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import React from "react";

const HomePage = () => {
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
      title: "Check Qualifications Easily",
      desc: "Select a job and instantly see your qualification percentage. Ensure you're the perfect fit before applying",
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
      title: "Engage and Earn",
      desc: "Refer other job seekers and earn rewards. Our robust referral system lets you grow your network while gaining extra income",
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
      desc: "Enhance your profile with custom resumes and cover letters. Stand out to employers with professional, tailored documents",
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
      title: "Comprehensive Application Process",
      desc: "Apply for jobs effortlessly. Manage applications, view activities, and track progress with our intuitive dashboard.",
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
      title: "Assess and Select",
      desc: "Utilize our assessment services to find the right candidates based on their knowledge, skills, and experience. Ensure the perfect fit every time.",
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
      title: "Direct Communication",
      desc: "Engage with admins and candidates using our efficient messaging system. Streamline your communication process and build strong connections.",
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
      title: "Earn Job Posting Credits",
      desc: "Refer other employers and earn credits. Use these credits to post jobs and access a wider talent pool. Save on recruiting costs.",
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
      title: "Powerful Analytics Dashboard",
      desc: "Monitor applicant progress and insights with our comprehensive analytics dashboard. Make data-driven decisions effortlessly.",
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

  const footerNavs = [
    {
      label: "Job Seekers",
      items: [
        {
          href: "/home/register",
          name: "Sign Up",
        },
        {
          href: "/home/faqs/job-seekers",
          name: "FAQs",
        },
        {
          href: "/home/jobs",
          name: "All Jobs",
        },
        {
          href: "/home/blogs/job-seekers",
          name: "Candidates Blogs",
        },
      ],
    },
    {
      label: "For Employers",
      items: [
        {
          href: "/home/register",
          name: "Sign Up",
        },
        {
          href: "/home/faqs/employers",
          name: "FAQs",
        },
        {
          href: "/home/blogs/employers",
          name: "Employer Blogs",
        },
      ],
    },
    {
      label: "About Hired",
      items: [
        {
          href: "/home/terms",
          name: "Terms",
        },
        {
          href: "/home/contact",
          name: "Contact",
        },
        {
          href: "/home/privacy",
          name: "Privacy",
        },
        {
          href: "/home/about",
          name: "About US",
        },
      ],
    },
  ];

  return (
    <div className="bg-white">
      <header>
        <Navbar />
      </header>
      <section className="sm:mt-16 mt-12 mx-auto max-w-screen-xl pb-4 px-4 items-center lg:flex md:px-8">
        <div className="space-y-4 flex-1 sm:text-center lg:text-left">
          <div>
            <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20">
              Experience unmatched quality; Kenya&apos;s INDEED.
            </span>
          </div>
          <h1 className="text-gray-700 font-extrabold text-4xl xl:text-5xl">
            Where employers and job seekers
            <span className="text-sky-700"> connect</span>
          </h1>
          <p className="text-gray-700 text-base sm:text-[15px] max-w-xl leading-relaxed sm:mx-auto lg:ml-0">
            Why would you think of spending time on a boring job website with
            unattractive user interface? Don&apos;t you like good looking
            stuffs? We got you covered!
          </p>
          <div>
            <p className="text-gray-700 py-3 text-base font-medium sm:text-[15px]">
              Would you like to see how we can help you?
            </p>
            <div className="items-center w-full space-y-5 sm:justify-center sm:space-x-5 sm:space-y-0 sm:flex lg:justify-start">
              <a
                href="/home/enterprises"
                className="block py-4 px-5 text-center w-full text-white font-medium bg-primary duration-150 hover:opacity-90 rounded-sm shadow-sm hover:shadow-none"
              >
                Find your next hire
              </a>
              <a
                href="/home/candidates"
                className="flex items-center w-full justify-center bg-gray-300 gap-x-2 py-4 px-5 text-primary hover:text-sky-700 font-medium duration-150 active:bg-gray-100 border rounded-sm md:inline-flex"
              >
                Find your next job
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="flex-1 text-center mt-4 lg:mt-0 lg:ml-3">
          <Image
            src={
              "https://res.cloudinary.com/dx0i37cyd/image/upload/v1707821485/Screenshot_49_tmd0k7.png"
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
      <section className="py-14 bg-primary">
        <div className="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-primary-foreground text-3xl font-semibold sm:text-4xl">
              Our customers are always happy
            </h3>
            <p className="mt-3 text-primary-foreground">
              Employers and job seekers are consistently satisfied with reliable
              matches, a seamless user experience, and comprehensive support.
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
      <section className="pt-14 max-w-screen-xl mx-auto pb-4 px-4 items-center lg:flex md:px-8">
        <div className="text-gray-600">
          <div className="max-w-xl mx-auto space-y-3 sm:text-center">
            <div>
              <span className="inline-flex items-center rounded-sm bg-gray-200 px-2 py-1 text-base font-medium text-gray-700">
                Are you talented?
              </span>
              <p className="text-gray-700 text-3xl font-bold sm:text-4xl">
                Why job seekers love us
              </p>
            </div>
          </div>
          <div className="mt-6">
            <ul className="grid gap-y-8 gap-x-12 sm:grid-cols-2 lg:grid-cols-2">
              {features.map((item, idx) => (
                <li key={idx} className="flex gap-x-5">
                  <div className="flex-none w-12 h-12 bg-gray-100 text-primary rounded-lg flex items-center justify-center border-gray-100">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-lg text-gray-700 font-semibold">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-base sm:text-[15px]">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mx-auto mt-4 max-w-6xl">
              <div className="mt-4 flow-root sm:mt-8">
                <div className="rounded-xl bg-gray-900/5 p-2 lg:p-4 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl">
                  <Image
                    src={
                      "https://res.cloudinary.com/dx0i37cyd/image/upload/v1707821485/Screenshot_49_tmd0k7.png"
                    }
                    alt="Product preview"
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
                Do yo need talent?
              </span>
              <p className="text-gray-700 text-3xl font-bold sm:text-4xl">
                Why recruiters love us
              </p>
            </div>
          </div>
          <div className="mt-6">
            <ul className="grid gap-y-8 gap-x-12 sm:grid-cols-2 lg:grid-cols-2">
              {featuresEmployer.map((item, idx) => (
                <li key={idx} className="flex gap-x-5">
                  <div className="flex-none w-12 h-12 bg-gray-100 text-primary rounded-lg flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-lg text-gray-700 font-semibold">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-base sm:text-[15px]">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mx-auto mt-4 max-w-6xl mb-4">
              <div className="mt-4 flow-root sm:mt-8">
                <div className="rounded-xl bg-gray-900/5 ring-1  p-2 lg:p-4 ring-inset ring-gray-900/10 lg:rounded-2xl">
                  <Image
                    src={
                      "https://res.cloudinary.com/dx0i37cyd/image/upload/v1707821484/Screenshot_52_ep7tfc.png"
                    }
                    alt="Product preview"
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
      <section className="relative py-14">
        <div className="relative z-10 max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="max-w-xl sm:text-center md:mx-auto">
            <h3 className="text-gray-800 text-3xl font-semibold sm:text-4xl">
              Testimonials from Platform Users
            </h3>
            <p className="mt-2 text-gray-600">
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
                  className="bg-white rounded-xl border shadow-sm flex flex-col"
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
                        <p className="text-gray-800 text-lg font-semibold px-4 pt-1">
                          {item.quote}
                        </p>
                      </blockquote>
                      <div className="flex items-center gap-x-4 px-4 pb-2">
                        <Image
                          src={item.avatar}
                          alt="Testimonial user"
                          width={56}
                          height={56}
                          priority={true}
                          quality={100}
                          className="w-14 h-14 rounded-full border-2 border-gray-400"
                        />
                        <div>
                          <span className="block text-gray-800 font-semibold">
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
            background:
              "linear-gradient(152.92deg, rgba(107, 114, 128, 0.2) 4.54%, rgba(75, 85, 99, 0.17) 34.2%, rgba(107, 114, 128, 0.1) 77.55%)",
          }}
        ></div>
      </section>

      <footer className="text-gray-500 bg-white px-4 py-5 max-w-screen-xl mx-auto md:px-8">
        <div className="gap-6 justify-between md:flex">
          <div className="flex-1">
            <div className="max-w-xs">
              <Image
                src={
                  "https://res.cloudinary.com/dx0i37cyd/image/upload/v1722608373/Hired-_Kenya_3_tyegve.png"
                }
                height={65}
                width={65}
                alt="Logo"
                title="Logo"
                quality={100}
                className="rounded-md"
                priority={true}
              />
              <p className="leading-relaxed mt-1.5 text-[15px]">
                This is an emerging and rapidly growing employment platform in
                the country.
              </p>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <label className="block pt-2 font-medium text-[15px]">
                Sign Up for Job Alerts
              </label>
              <div className="max-w-sm flex items-center border rounded-md">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-10 outline-none rounded-sm"
                />
                <button className="h-10 rounded-sm ml-1.5 text-white bg-primary hover:opacity-90 px-3 outline-none shadow-md focus:shadow-none sm:px-5">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
          <div className="flex-1 mt-10 space-y-4 items-start justify-between sm:flex md:space-y-0 md:mt-0">
            {footerNavs.map((item, idx) => (
              <ul className="space-y-2.5" key={idx}>
                <h4 className="text-gray-600 font-medium">{item.label}</h4>
                {item.items.map((el, idx) => (
                  <li key={idx}>
                    <a
                      href={el.href}
                      className="hover:underline text-[15px] hover:text-sky-700"
                    >
                      {el.name}
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <div className="mt-8 py-6 border-t items-center justify-between sm:flex">
          <div className="mt-4 sm:mt-0 text-base">
            &copy; {new Date().getFullYear()} Hired All rights reserved.
          </div>
          <div className="mt-6 sm:mt-0">
            <ul className="flex items-center space-x-4">
              <li className="w-10 h-10 border rounded-full flex items-center justify-center">
                <a
                  href="https://www.x.com/hiredke"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="svg-icon w-6 h-6 text-blue-400"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="none"
                      d="M18.258,3.266c-0.693,0.405-1.46,0.698-2.277,0.857c-0.653-0.686-1.586-1.115-2.618-1.115c-1.98,0-3.586,1.581-3.586,3.53c0,0.276,0.031,0.545,0.092,0.805C6.888,7.195,4.245,5.79,2.476,3.654C2.167,4.176,1.99,4.781,1.99,5.429c0,1.224,0.633,2.305,1.596,2.938C2.999,8.349,2.445,8.19,1.961,7.925C1.96,7.94,1.96,7.954,1.96,7.97c0,1.71,1.237,3.138,2.877,3.462c-0.301,0.08-0.617,0.123-0.945,0.123c-0.23,0-0.456-0.021-0.674-0.062c0.456,1.402,1.781,2.422,3.35,2.451c-1.228,0.947-2.773,1.512-4.454,1.512c-0.291,0-0.575-0.016-0.855-0.049c1.588,1,3.473,1.586,5.498,1.586c6.598,0,10.205-5.379,10.205-10.045c0-0.153-0.003-0.305-0.01-0.456c0.7-0.499,1.308-1.12,1.789-1.827c-0.644,0.28-1.334,0.469-2.06,0.555C17.422,4.782,17.99,4.091,18.258,3.266"
                    ></path>
                  </svg>
                </a>
              </li>

              <li className="w-10 h-10 border rounded-full flex items-center justify-center">
                <a
                  href="https://www.facebook.com/profile.php?id=61560450684416"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="svg-icon w-6 h-6 text-blue-700"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill="none"
                      d="M11.344,5.71c0-0.73,0.074-1.122,1.199-1.122h1.502V1.871h-2.404c-2.886,0-3.903,1.36-3.903,3.646v1.765h-1.8V10h1.8v8.128h3.601V10h2.403l0.32-2.718h-2.724L11.344,5.71z"
                    ></path>
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <style jsx>{`
          .svg-icon path,
          .svg-icon polygon,
          .svg-icon rect {
            fill: currentColor;
          }
        `}</style>
      </footer>
    </div>
  );
};

export default HomePage;
