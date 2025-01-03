"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const AdSenseAd = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); 
    if (typeof window !== "undefined" && window.adsbygoogle) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);

  if (!isClient) return null;

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
        strategy="afterInteractive"
      />
    </>
  );
};

export default AdSenseAd;

