"use client";
import { trpc } from "@/app/_trpc/client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useToast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";

const internship= "internship"
const nairobi= "nairobi"
const mombasa= "mombasa"
const latest= "latest"
const footerNavs = [
  {
    label: "Popular Searches",
    items: [
      {
        href: `/home/jobs/in/${internship}`,
        name: "Internships",
      },
      {
        href: `/home/jobs/in/${nairobi}`,
        name: "Jobs in Nairobi",
      },
      {
        href: `/home/jobs/in/${mombasa}`,
        name: "Jobs in Mombasa",
      },
      {
        href: `/home/jobs/in/${latest}`,
        name: "New Jobs in Kenya",
      },
      {
        href: `/home/jobs/in/kenya`,
        name: "All Jobs in Kenya",
      },
    ],
  },
  {
    label: "Browse Shortcuts",
    items: [
      {
        href: "/home/faqs/job-seekers",
        name: "Job Seekers FAQs",
      },
      {
        href: "/home/faqs/employers",
        name: "Employers FAQs",
      },
      {
        href: "/home/blogs/employers",
        name: "Employer Blogs",
      },
      {
        href: "/home/blogs/job-seekers",
        name: "Job Seekers Blogs",
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
  const [data, setData] = useState({
    email: "",
  });
  const { toast } = useToast();
  const { mutate: subscribe, isLoading } = trpc.homePageSubscribe.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'You have successfully subscribed to Hired\'s job alert.',
        variant: 'default',
        duration: 3000,
      });
      setData({ email: '' });
    },
    onError: (err) => {
      const errorMessage =
        err.message || 
        (err.data?.code === 'BAD_REQUEST' ? 
           'This email has already subscribed to our job alerts.' : 
           'There was a problem subscribing you to job alerts services.');
  
      toast({
        title: 'Something went wrong',
        description: errorMessage,
        variant: 'destructive',
        duration: 3000,
      });
      setData({ email: '' });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!data.email) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    subscribe({ email: data.email });
  };
  return (
    <div className="border-t border-gray-300 mt-4">
      <footer className="text-gray-600 bg-white px-4 pb-5 pt-2 md:py-5 max-w-screen-xl mx-auto md:px-8">
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
            <form onSubmit={handleSubmit}>
              <label className="block pt-2 font-medium text-sm">
                Sign Up for Job Alerts
              </label>
              <div className="max-w-sm flex items-center rounded-md">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={data.email}
                  onChange={handleChange}
                  className="w-full h-10 outline-none border placeholder:text-sm placeholder:gray-500 border-gray-300 rounded-sm"
                />
                <button
                  type="submit"
                  className="h-10 rounded-sm items-center ml-1.5 text-sm sm:text-[15px] text-white bg-primary hover:opacity-90 px-3 outline-none shadow-md focus:shadow-none sm:px-5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <Loader2 className="h-4 w-4 shrink-0 mr-1.5 animate-spin" />{" "}
                      Wait...
                    </span>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>
            </form>
          </div>
          <div className="flex-1 mt-5 space-y-2.5 items-start justify-between sm:flex md:space-y-0 md:mt-0">
            {footerNavs.map((item, idx) => (
              <ul className="space-y-1" key={idx}>
                <h4 className="text-gray-700 text-[15px] font-medium">
                  {item.label}
                </h4>
                {item.items.map((el, idx) => (
                  <li key={idx}>
                    <Link
                      href={el.href}
                      title={`Open ${el.name}`}
                      className="hover:underline text-sm text-[15px] hover:text-sky-700"
                    >
                      {el.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <div className="mt-5 py-3 border-t items-center justify-between sm:flex">
          <div className="text-base">
          &copy; {new Date().getFullYear()}. All rights reserved.{" "}
            <a
              href="https://www.remoseal.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 hover:underline"
            >
              Jobs Radar
            </a>
          </div>
          <div className="mt-5 sm:mt-0">
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
