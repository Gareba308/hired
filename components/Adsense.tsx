"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const AdSenseAd = () => {
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setIsAdLoaded(true);
        }
      } catch (error) {
        console.error("AdSense script error:", error);
        setIsAdLoaded(false);
      }
    }
  }, []);

  return (
    <>
      {isAdLoaded && (
        <div>
          <b className="my-1">---Advertisement Starts---</b>
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-7434648314782318"
            data-ad-slot="5848217924"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
          <b className="my-1">---Advertisement Ends---</b>
        </div>
      )}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7434648314782318"
        crossOrigin="anonymous"
        strategy="lazyOnload"
        onError={(e) => {
          console.error("Failed to load AdSense script:", e);
          setIsAdLoaded(false);
        }}
      />
    </>
  );
};

export default AdSenseAd;
