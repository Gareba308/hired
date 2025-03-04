import Navbar from "@/components/Navbar";
import { GoogleAnalytics } from "@next/third-parties/google";
import { PropsWithChildren, useEffect, useState } from "react";
import Script from "next/script";

const HomeLayout = ({ children }: PropsWithChildren) => {
  const [adsLoaded, setAdsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).adsbygoogle && !adsLoaded) {
      (window as any).adsbygoogle.push({
        google_ad_client: "ca-pub-7434648314782318",
        enable_page_level_ads: true,
        overlays: { bottom: true, top: false },
      });
      setAdsLoaded(true);
    }
  }, [adsLoaded]);

  return (
    <div className="bg-white pb-0.5">
      <Navbar />
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7434648314782318"
        crossOrigin="anonymous"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== "undefined") {
            (window as any).adsbygoogle = (window as any).adsbygoogle || [];
            (window as any).adsbygoogle.push({
              google_ad_client: "ca-pub-7434648314782318",
              enable_page_level_ads: true,
              overlays: { bottom: true, top: false },
            });
          }
        }}
      />
      {children}
      <GoogleAnalytics gaId="G-D94MPR6B9P" />
    </div>
  );
};

export default HomeLayout;
