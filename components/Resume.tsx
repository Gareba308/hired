import React from "react";
import Footer from "./Footer";

const Resume = () => {
  return (
    <>
      <div className="px-4 md:px-8 pb-6 pt-4 sm:pt-6 min-h-[calc(100vh-70px)] max-w-screen-xl mx-auto text-sm sm:text-[15px] text-gray-700">
        <div className="flex flex-col items-center justify-center space-y-3 max-w-md">
          <h1 className="text-2xl md:text-3xl text-gray-700">
            🚨 Exciting News Coming Soon! 🚨
          </h1>
          <p className="text-gray-700 text-base">
            In less than 48 hours from the time you are seeing this, Hired will
            be launching a brand-new feature just for you! You&apos;ll be able
            to create a high-quality PDF resume for FREE, right from our
            platform. Stay tuned for more updates, and get ready to create your
            perfect resume!
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Resume;
