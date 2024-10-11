import React from "react";
import Footer from "./Footer";

const Resume = () => {
  return (
    <>
      <div className="px-4 md:px-8 pb-6 pt-4 sm:pt-6 min-h-[calc(100vh-70px)] flex flex-col items-center sm:justify-center justify-start space-y-3 max-w-xl mx-auto text-sm sm:text-[15px] text-gray-700">
        <h1 className="text-2xl md:text-3xl text-gray-700 font-bold">
          Exciting News Coming Soon!
        </h1>
        <div>
          <p className="text-gray-700 text-base sm:text-[15px]">
            In less than 48 hours from the time you are seeing this, Hired will
            be launching a brand-new feature we&apos;ve been working on just for you!
          </p>
          <br/>
          <p className="text-gray-700 text-base sm:text-[15px]">
            You&apos;ll be able to create a high-quality, downloadable PDF resume for FREE,
            right from our platform.
          </p>
          <br/>
          <p className="text-gray-700 text-base sm:text-[15px]">
            Stay tuned for more updates, and get ready to create your perfect
            resume!
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Resume;
