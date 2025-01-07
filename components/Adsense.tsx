"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const AdSenseAd = () => {
  const [isAdLoaded, setIsAdLoaded] = useState(false); // State to track if ad is loaded

  useEffect(() => {
    if (typeof window !== "undefined" && window.adsbygoogle) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setIsAdLoaded(true);
    }
  }, []);

  return (
    <>
      {isAdLoaded && (
        <div>
          <p className="my-1 px-4">--Advertisement--</p>
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-7434648314782318"
            data-ad-slot="5848217924"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
        </div>
      )}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7434648314782318"
        crossOrigin="anonymous"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== "undefined" && window.adsbygoogle) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            setIsAdLoaded(true);
          }
        }}
        onError={(e) => {
          console.error("Failed to load AdSense script:", e);
          setIsAdLoaded(false);
        }}
      />
    </>
  );
};

export default AdSenseAd;
