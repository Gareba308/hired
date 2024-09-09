import "./globals.css";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import Providers from "@/components/Provider";
import { Toaster } from "@/components/ui/toaster";
import ContextProvider from "@/context/ContextProviders";
import "simplebar-react/dist/simplebar.min.css";
import "react-loading-skeleton/dist/skeleton.css";
import { Roboto } from "next/font/google";
import ScrollToTop from "../components/common/ScrollToTop";
import { siteConfig } from "@/lib/config";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Find Top Job Vacancies & Opportunities in Kenya | Hired - Your Career Starts Here",
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Find the latest job vacancies and opportunities in Kenya with Hired! Explore personalized jobs listing from top companies, startups, and more. Get expert tips and connect with employers across Nairobi and Kenya.",
  metadataBase: new URL(siteConfig.url),
  keywords: [
    "jobs in Kenya",
    "Kenya job vacancies",
    "career opportunities in Kenya",
    "Hired jobs in Kenya",
    "Kenya employment",
    "find jobs in Kenya",
    "apply for jobs in Kenya",
    "Kenya job search",
    "professional jobs in Kenya",
    "latest jobs in Kenya",
    "jobs in Nairobi",
    "Hired",
  ],
  authors: [
    {
      name: "Hired",
      url: "https://www.hired.co.ke",
    },
  ],
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  creator: "Hired",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    creator: "@hiredke",
    site: "@hiredke",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <Providers>
        <ContextProvider>
          <body
            className={cn(
              "min-h-[calc(100vh-120px)] bg-gray-100 font-sans antialiased",
              roboto.className
            )}
          >
            {children}
            <Toaster />
            <ScrollToTop />
          </body>
        </ContextProvider>
      </Providers>
    </html>
  );
}
