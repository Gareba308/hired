"use client";

import { useEffect } from "react";
import Script from "next/script";

const AdSenseAd = () => {
  useEffect(() => {
    const initializeAds = () => {
      if (typeof window !== "undefined" && (window as any).adsbygoogle) {
        try {
          ((window as any).adsbygoogle =
            (window as any).adsbygoogle || []).push({});
        } catch (error: any) {
          console.error("AdSense script error:", error);
        }
      }
    };

    initializeAds();
  }, []);

  return (
    <>
      <div
        style={{
          maxWidth: "100%",
          overflow: "hidden",
          margin: "0 auto",
        }}
      >
        <ins
          className="adsbygoogle"
          style={{
            display: "block",
            width: "100%",
            height: "auto",
          }}
          data-ad-client="ca-pub-7434648314782318"
          data-ad-slot="5848217924"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7434648314782318"
        crossOrigin="anonymous"
        strategy="lazyOnload"
        onError={(e) => {
          console.error("Failed to load AdSense script:", e);
        }}
      />
    </>
  );
};

export default AdSenseAd;
