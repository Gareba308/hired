"use client";
import { useRef, useState } from "react";
import Footer from "./Footer";

interface FAQ {
  q: string;
  a: string;
}

interface FaqsCardProps {
  faqsList: FAQ;
}

const FaqsCard: React.FC<FaqsCardProps> = ({ faqsList }) => {
  const answerElRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [answerHeight, setAnswerHeight] = useState<string>("0px");

  const toggleAnswer = () => {
    if (answerElRef.current) {
      const answerHeightValue = answerElRef.current.scrollHeight;
      setIsOpen((prevState) => !prevState);
      setAnswerHeight(`${answerHeightValue}px`);
    }
  };

  return (
    <div
      className="space-y-3 mt-5 overflow-hidden border-b"
      onClick={toggleAnswer}
    >
      <h4 className="cursor-pointer pb-5 flex items-center justify-between text-sm sm:text-lg text-gray-700 font-medium">
        {faqsList.q}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-500 ml-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          )}
        </svg>
      </h4>
      <div
        ref={answerElRef}
        className="duration-300 transition-all"
        style={{ height: isOpen ? answerHeight : "0px" }}
      >
        <div>
          <p className="text-gray-500 text-sm sm:text-lg">{faqsList.a}</p>
        </div>
      </div>
    </div>
  );
};

const FAQsJobSeekers: React.FC = () => {
  const faqsList: FAQ[] = [
    {
      q: "What is Hired and how does it work?",
      a: "Hired is a job board based in Nairobi, Kenya, designed to connect job seekers with employers. Job seekers can sign up, create profiles, view and apply for jobs, track their applications, and earn credits through referrals. Hired simplifies the job search process with features like Career Wizard, portfolio-based resume creation, and assessments.",
    },
    {
      q: "How do I create an account on Hired?",
      a: "Creating an account on Hired is simple. You can sign up using your Google account or your email address. Once registered, you can set up your job seeker profile, fill in your portfolio, and start exploring job opportunities.",
    },
    {
      q: "What is the User Profile section for?",
      a: "The User Profile section allows you to create a detailed job seeker profile. You can add your personal details, professional experience, skills, and other information that will help employers find you. A complete profile improves your chances of matching with relevant job opportunities.",
    },
    {
      q: "What is the Portfolio section and how is it used?",
      a: "The Portfolio section allows you to showcase your work, projects, and achievements. The information you provide can be used to automatically generate a resume if you haven’t uploaded one. This makes it easier for employers to review your qualifications.",
    },
    {
      q: "How do I apply for jobs on Hired?",
      a: "You can apply for jobs by visiting the All Jobs section. There, you can browse available job listings, view job details, and submit your application directly through the platform. Some jobs may require you to complete an assessment before submitting your application.",
    },
    {
      q: "Is using Hired free of charge for job seekers?",
      a: "Yes, using Hired as a job seeker is completely free of charge. You will not be required to pay anything to use the platform or to apply for jobs. Please be cautious and do not pay anyone for job applications, as all services on Hired are provided at no cost to job seekers.",
    },
    {
      q: "How can I track the progress of my job applications?",
      a: "You can monitor the progress of your job applications in the Dashboard section. It provides real-time updates on your applications, such as whether you've been shortlisted for interviews or received feedback from employers.",
    },
    {
      q: "What is the Refer & Earn program?",
      a: "The Refer & Earn program allows you to refer other job seekers to Hired. For every successful referral, you earn credits that can be redeemed for cash once you accumulate a minimum of 200 points. The points are converted to Kenya Shillings and transferred to your M-Pesa account.",
    },
    {
      q: "What is the Career Wizard and how does it work?",
      a: "The Career Wizard is a tool that helps you assess your qualifications for specific job roles. It evaluates your experience, skills, and qualifications, often using data from your portfolio, to give you a score based on job requirements. This helps you understand your suitability for a particular role before applying.",
    },
    {
      q: "Do I need to take an assessment before applying for a job?",
      a: "Some jobs may require you to complete an assessment before you can submit your application. These assessments are designed to evaluate your skills and qualifications for the role. You can take these assessments in the Assessments section of the platform.",
    },
    {
      q: "Can I save jobs I'm interested in?",
      a: "Yes, you can save jobs that interest you in the Saved Jobs section. This allows you to easily return to them later and apply when you're ready.",
    },
    {
      q: "How do I redeem my referral credits?",
      a: "Once you accumulate 200 referral points, you can redeem them for cash. The equivalent value in Kenya Shillings will be sent to you. The minimum redeemable point threshold is 200.",
    },
    {
      q: "How can I communicate with employers or administrators?",
      a: "You can have professional conversations with employers and platform administrators through the Messages section. This allows you to ask questions, follow up on applications, or discuss job-related matters.",
    },
    {
      q: "Can I upload my own resume?",
      a: "Yes, you can upload your own resume directly to your profile. If you choose not to upload one, Hired will generate a resume for you based on the information in your portfolio.",
    },
    {
      q: "What should I do if I have trouble using the platform?",
      a: "If you encounter any issues or have questions about using the platform, please visit our Help section or contact our support team. We are here to assist you with any concerns you may have.",
    },
    {
      q: "What happens after I apply for a job?",
      a: "After you apply for a job, you can track the status of your application in the Dashboard. If you are shortlisted for an interview or if the employer provides feedback, you will receive updates through the platform.",
    },
  ];

  return (
    <>
      <section className="leading-relaxed max-w-screen-xl min-h-[calc(100vh-70px)] pb-10 mt-6 mx-auto px-4 md:px-8">
        <div className="space-y-2">
          <h1 className="text-3xl text-gray-700 text-center font-semibold">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto text-start sm:text-center text-base sm:text-lg">
            We have answered some of{" "}
            <b className="text-[#005580]">Job Seeker&apos;s</b> frequently asked
            questions. Still confused? Feel free to contact us.
          </p>
        </div>
        <div className="mt-6 sm:mt-8 max-w-2xl mx-auto">
          {faqsList.map((item, idx) => (
            <FaqsCard key={idx} faqsList={item} />
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default FAQsJobSeekers;
