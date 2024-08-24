"use client"
import Image from "next/image";
import React from "react";

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
        href: "/home/register/enterprises",
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
const Footer = () => {
  return (
    <div className="border-t mt-4">
      <footer className="text-gray-500 bg-white px-4 pb-5 pt-2 md:py-5 max-w-screen-xl mx-auto md:px-8">
        <div className="gap-6 justify-between md:flex">
          <div className="flex-1">
            <div className="max-w-xs">
              <Image
                src={
                  "https://res.cloudinary.com/dx0i37cyd/image/upload/v1723627737/veryHired_lo5n1w.png"
                }
                height={56}
                width={66}
                alt="Logo"
                title="Logo"
                quality={100}
                className="rounded-sm"
                priority={true}
              />
              <p className="leading-relaxed mt-1.5 text-sm">
                This is an emerging and rapidly growing employment platform in
                the country.
              </p>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <label className="block pt-2 font-medium text-sm">
                Sign Up for Job Alerts
              </label>
              <div className="max-w-sm flex items-center rounded-md">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-10 outline-none border placeholder:text-sm placeholder:sm:text-[15px] placeholder:gray-500 border-gray-300 rounded-sm"
                />
                <button className="h-10 rounded-sm ml-1.5 text-[15px] text-white bg-primary hover:opacity-90 px-3 outline-none shadow-md focus:shadow-none sm:px-5">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
          <div className="flex-1 mt-10 space-y-4 items-start justify-between sm:flex md:space-y-0 md:mt-0">
            {footerNavs.map((item, idx) => (
              <ul className="space-y-2.5" key={idx}>
                <h4 className="text-gray-700 font-medium">{item.label}</h4>
                {item.items.map((el, idx) => (
                  <li key={idx}>
                    <a
                      href={el.href}
                      className="hover:underline text-sm text-[15px] hover:text-sky-700"
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
          <div className="text-base">
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

export default Footer;
