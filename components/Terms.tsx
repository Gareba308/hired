import React from "react";
import Footer from "./Footer";

const Terms = () => {
  return (
    <>
    <div className="px-4 md:px-8 pb-6 pt-4 sm:pt-6 max-w-screen-xl mx-auto text-sm sm:text-[15px] text-gray-700">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-2">
        Terms & Conditions
      </h1>

      <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-2">
        Introduction
      </h2>
      <p className="text-gray-700 mb-2">
        Please read these Terms & Conditions carefully before using Hired. Hired
        reserves the right to modify these Terms & Conditions at any time.
      </p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-2">
        Services Provided
      </h2>
      <p className="text-gray-700 mb-2">
        Hired provides a service to bring Job Seekers and Employers together.
        Job Seekers and Employers can register, create profiles/job posts, and
        search for jobs and resumes.
      </p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-2">
        Privacy Policy
      </h2>
      <p className="text-gray-700 mb-2">
        Job Seeker personal data will be available to Employers visiting Hired.
        Personal data includes a Name, which is mandatory, an email Address,
        which is mandatory, and a Telephone Number, which is optional.
      </p>
      <p className="text-gray-700 mb-2">
        Personal data provided by the user may be used by Hired to notify the
        user of any news, and/or promotional offers relating only to the Hired
        website. The user can unsubscribe from these notifications at any time.
      </p>
      <p className="text-gray-700 mb-2">
        Hired will not disclose user personal data to any third party.
      </p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-2">
        Website Use
      </h2>
      <p className="text-gray-700 mb-2">
        Hired may not be used for any of the following purposes:
      </p>
      <ul className="list-disc list-inside text-gray-700 mb-2">
        <li>
          To contact Hired users regarding any issue apart from the purpose of
          recruitment.
        </li>
        <li>
          To contact Hired users to offer any services from a 3rd party company.
        </li>
        <li>To post any illegal content.</li>
      </ul>
      <p className="text-gray-700 mb-2">
        The user is required to provide truthful information in their profile or
        job post.
      </p>
      <p className="text-gray-700 mb-2">
        It is prohibited to use any text or images from Hired for personal or
        commercial use.
      </p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-2">
        User Information
      </h2>
      <p className="text-gray-700 mb-2">
        Hired does not hold responsibility for any untruthful and/or inaccurate
        information included in job posts and profiles.
      </p>
      <p className="text-gray-700 mb-2">
        Hired reserves the right to edit or delete any information submitted by
        the user to the website.
      </p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-2">
        Liability
      </h2>
      <p className="text-gray-700 mb-2">
        Hired will not be responsible for any loss or damage the user may
        encounter from using the website.
      </p>

      <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-2">
        Cookies Policy
      </h2>
      <p className="text-gray-700 mb-2">Our website uses cookies.</p>
      <p className="text-gray-700 mb-2">
        A cookie is a file containing an identifier (a string of letters and
        numbers) that is sent by a web server to a web browser and is stored by
        the browser. The identifier is then sent back to the server each time
        the browser requests a page from the server.
      </p>
      <p className="text-gray-700 mb-2">
        We use Google Analytics to analyze the use of our website. Our analytics
        service provider generates statistical and other information about
        website use by means of cookies.
      </p>
      <p className="text-gray-700 mb-2">
        You can delete cookies already stored on your computer. Please visit the
        &apos;Help&apos; option in your browser menu to learn how to do this.
        Deleting cookies will have a negative impact on the usability of this
        website.
      </p>
    </div>
    <Footer />
    </>
  );
};

export default Terms;
