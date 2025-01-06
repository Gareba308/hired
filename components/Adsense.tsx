"use client";

import { useEffect } from "react";
import Script from "next/script";

const AdSenseAd = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (error) {
        console.error("AdSense script error:", error);
      }
    }
  }, []);

  return (
    <>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-7434648314782318"
        data-ad-slot="5848217924"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
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