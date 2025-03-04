"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const AdSenseAd = () => {
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadAd = () => {
      if (typeof window !== "undefined" && (window as any).adsbygoogle) {
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (error: any) {
          console.error("AdSense script error:", error);
        }
      }
    };

    const checkAndReloadAd = () => {
      const adElement = document.querySelector(".adsbygoogle");
      if (adElement && adElement.childNodes.length === 0 && retryCount < 3) {
        console.warn("Ad not loaded, retrying...");
        setRetryCount((prev) => prev + 1);
        loadAd();
      }
    };

    const timeout = setTimeout(() => {
      loadAd();
    }, 500);

    const retryInterval = setInterval(() => {
      checkAndReloadAd();
    }, 2000);

    if (retryCount >= 3) {
      clearInterval(retryInterval);
    }

    return () => {
      clearTimeout(timeout);
      clearInterval(retryInterval);
    };
  }, [retryCount]);

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
        onLoad={() => {
          (window as any).adsbygoogle = (window as any).adsbygoogle || [];
          (window as any).adsbygoogle.push({
            overlays: { bottom: true, top: false },
          });
        }}
        onError={(e) => {
          console.error("Failed to load AdSense script:", e);
        }}
      />
    </>
  );
};

export default AdSenseAd;
