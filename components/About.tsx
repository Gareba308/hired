import React from "react";
import Footer from "./Footer";

const About = () => {
  return (
    <>
      <div className="px-4 md:px-8 pb-6 pt-4 sm:pt-6 min-h-[calc(100vh-70px)] max-w-screen-xl mx-auto text-sm sm:text-[15px] text-gray-700">
        <h1 className="text-3xl font-bold text-gray-700 mb-4">About Hired</h1>

        <p className="text-gray-700 mb-4">
          At Hired, we believe that talent is everywhere, and we&apos;re
          committed to connecting job seekers with opportunities that match
          their skills and ambitions, right here in Kenya. Unlike generalist job
          boards that often limit your reach, Hired offers a platform where
          employers can connect with a broader pool of candidates, ensuring the
          right fit for the right job.
        </p>

        <p className="text-gray-700 mb-4">
          Founded by <b>Jack Wareba</b> (founder&apos;s codename), a Kenyan
          public health graduate with a passion for coding, Hired was created
          with one goal in mind: to make job searching and recruitment easier
          and more efficient. Although his background is in public health, his
          love for technology and its potential to make a difference led to the
          development of Hired, a platform designed to streamline the job search
          process for both candidates and employers.
        </p>

        <p className="text-gray-700 mb-4">
          At Hired, we are dedicated to continuously improving our platform to
          better serve our users. We understand the challenges that job seekers
          and employers face, and we&apos;re committed to providing the tools
          and resources necessary to overcome those challenges.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-3">
          Why Choose Hired?
        </h2>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Access to a diverse and larger candidate pool</li>
          <li>Streamlined recruitment processes for employers</li>
          <li>Enhanced visibility for job postings</li>
          <li>Support for job seekers in finding the right opportunities</li>
          <li>A growing community of forward-thinking employers</li>
        </ul>

        <p className="text-gray-700 mb-4">
          Whether you&apos;re an employer looking to attract top talent or a job
          seeker searching for the perfect opportunity, Hired is here to help
          you succeed. We are continuously innovating and refining our platform
          to ensure that it meets the evolving needs of our users.
        </p>

        <p className="text-gray-700 mb-4">
          Thank you for choosing Hired. We look forward to being a part of your
          journey.
        </p>

        <p className="text-gray-700 font-semibold">
          Enjoy,
          <br />
          The Hired Team
        </p>
      </div>
      <Footer />
    </>
  );
};

export default About;
