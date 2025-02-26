import Navbar from "@/components/Navbar";
import { GoogleAnalytics } from "@next/third-parties/google";
import { PropsWithChildren } from "react";
import Script from "next/script";

const HomeLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="bg-white pb-0.5">
      <Navbar />
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
            scroll: false,
            bottom: true
          }
        });
      `}
      </Script>
      {children}
      <GoogleAnalytics gaId="G-D94MPR6B9P" />
    </div>
  );
};

export default HomeLayout;
