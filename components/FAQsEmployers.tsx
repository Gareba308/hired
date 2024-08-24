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
      <h4 className="cursor-pointer pb-5 flex items-center justify-between text-lg text-gray-700 font-medium">
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
          <p className="text-gray-500 text-lg">{faqsList.a}</p>
        </div>
      </div>
    </div>
  );
};

const FAQsEmployers: React.FC = () => {
  const faqsList: FAQ[] = [
    {
      q: "How do I create an employer account on Hired?",
      a: "Employers can sign up using their email address to ensure secure and verified accounts. Social sign-ups like Google are not available for employers to prevent scam registrations. After signing up, you'll be directed to create your company profile in the User Profile section.",
    },
    {
      q: "What information is required in the User Profile section?",
      a: "In the User Profile section, you will be asked to provide key details about your company, including your company name, location, contact information, and a brief description of your business.",
    },
    {
      q: "How do I post a job on Hired?",
      a: "You can post a job through the Post Job section in your account. Fill in the required job details, and once submitted, your job will be reviewed and published by our admin within an hour. The job will be live on the platform for a maximum of 30 days unless you specify an earlier deadline.",
    },
    {
      q: "Can I edit a job posting after it goes live?",
      a: "Yes, you can edit your job posting at any time. Simply go to the My Jobs section, open the job details, and click on 'Job Settings' to make the necessary changes.",
    },
    {
      q: "How long will my job posting remain online?",
      a: "A job posting will remain live on the platform for up to 30 days unless you provide a specific deadline that is shorter. Once the job reaches its deadline, it will no longer be visible online but will still be stored in our database.",
    },
    {
      q: "What is the cost of posting a job on Hired?",
      a: "Posting a single job on Hired costs Ksh.1500. However, if you plan to post multiple jobs, we offer discounted pricing packages that can be purchased through the Pricing section.",
    },
    {
      q: "Can I add assessments to my job postings?",
      a: "Yes, you can add mandatory assessments to your job postings. These assessments will need to be completed by job seekers before they can submit their applications. You can select and purchase assessments in the Assessments section.",
    },
    {
      q: "What is the cost of an assessment on Hired?",
      a: "Each assessment costs Ksh.10,000. The assessment can be used across multiple job postings within 30 days of purchase. When you purchase a skill assessment, a Language Test is included as a bonus.",
    },
    {
      q: "How do I preview or demo the assessments available on Hired?",
      a: "In the Assessments section, you can view demos of available assessments. These demos allow you to experience how assessments are administered, ensuring you select the right one for your job posting.",
    },
    {
      q: "Where can I view applications and track their progress?",
      a: "You can view and track job applications in the Dashboard section. Here, you'll see a table with all your job postings and the associated applications, along with key analytics to help manage the recruitment process effectively.",
    },
    {
      q: "How can I view and manage applicant resumes and cover letters?",
      a: "Applicant resumes will be autogenerated by our system based on their portfolio data, but employers also have the option to download uploaded resumes. Cover letters will follow a structured format, but the content will be provided by the applicant.",
    },
    {
      q: "How do I make payments for job postings or assessments?",
      a: "Payments for job postings, assessments, and packages are made via M-Pesa in the Pricing section. Once you choose the amount to top up, the system will prompt you to confirm the payment on your mobile phone using your registered number.",
    },
    {
      q: "Are payments refundable?",
      a: "No, payments made through Hired are non-refundable. Please ensure you review your purchases carefully before confirming them in the Pricing section.",
    },
    {
      q: "How does the referral program work for employers?",
      a: "Employers can refer other employers to Hired. For every successful referral, you will receive Ksh.500, which can be used to post a job. New employer sign-ups also receive Ksh.500 as a bonus to help them get started.",
    },
    {
      q: "Can I communicate with job seekers or the admin team?",
      a: "Yes, you can communicate directly with job seekers and the Hired admin team through the Messages section. This allows for professional interaction regarding job postings, applications, or other inquiries.",
    },
  ];

  return (
    <>
      <section className="leading-relaxed max-w-screen-xl min-h-[calc(100vh-70px)] pb-10 mt-6 mx-auto px-4 md:px-8">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl text-gray-700 font-semibold">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto text-lg">
            Here are some of the{" "}
            <b className="text-[#005580]">Employer&apos;s</b> frequently asked
            questions. Still confused? Feel free to contact us.
          </p>
        </div>
        <div className="mt-8 max-w-2xl mx-auto">
          {faqsList.map((item, idx) => (
            <FaqsCard key={idx} faqsList={item} />
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default FAQsEmployers;
