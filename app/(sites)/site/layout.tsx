import { PropsWithChildren } from "react";
import Sidebar from "./_components/sidebar/Sidebar";
import { GoogleAnalytics } from "@next/third-parties/google";
import DashNavbar from "./_components/dashboard/DashNavbar";
import Script from "next/script";

const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <div className="h-[70px] md:pl-56 fixed inset-y-0 w-full z-50 ">
        <DashNavbar />
      </div>

      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-60 my-0 sm:my-2.5 pt-[70px] min-h-[calc(100vh-120px)] no-scrollbar px-0 w-full sm:px-4 mx-auto">
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7434648314782318"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        <Script strategy="lazyOnload" id="adsense-config">
          {`
            (adsbygoogle = window.adsbygoogle || []).push({
            google_ad_client: "ca-pub-7434648314782318",
            enable_page_level_ads: true,
            overlays: {
              scroll: false, // Disable top anchor ads
              bottom: true   // Enable bottom anchor ads
            }
          });
          `}
        </Script>
        {children}
      </main>
      <GoogleAnalytics gaId="G-D94MPR6B9P" />
    </div>
  );
};

export default DashboardLayout;
