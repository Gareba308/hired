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
    default: "Discover the Latest Job Vacancies in Kenya Today | Hired",
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Discover top job opportunities in Kenya with Hired. Find your perfect job, apply easily, and advance your career. Start your job search today with Hired!",
  metadataBase: new URL(siteConfig.url),
  keywords: [
    "jobs in Kenya",
    "Kenya job vacancies",
    "career opportunities Kenya",
    "Hired job board",
    "Kenya employment",
    "find jobs Kenya",
    "apply for jobs Kenya",
    "Kenya job search",
    "professional jobs Kenya",
    "latest jobs Kenya",
    "jobs in Nairobi",
    "jobs",
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
