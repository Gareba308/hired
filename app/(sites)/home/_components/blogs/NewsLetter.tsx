import Link from "next/link";

const NewsLetterBox = () => {
  return (
    <section className="mt-4 max-w-screen-xl mx-auto ">
      <div className="border-b border-body-color border-opacity-10 px-5 pb-4 text-lg font-semibold text-black">
        <h3 className="text-xl text-gray-700 font-semibold ">
          Job Feedback Hub
        </h3>
      </div>
      <div className="mt-4 flex-col text-base flex flex-wrap px-5 pb-6">
        <p className="text-gray-500 text-base leading-tight">
          Do you have any feedback or would you like to report this job? Kindly
          let us know.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="items-center my-2 justify-center"
        >
          <input
            type="text"
            placeholder="Brief comment or feedback..."
            className="text-gray-500 w-full text-base p-3 rounded-sm border outline-none focus:border-primary"
          />
          <button className="w-full mt-3 px-5 py-3 sm:w-max xl:w-full rounded-sm text-white bg-primary duration-150 outline-none focus:shadow-none focus:ring-2 ring-offset-2 font-normal">
            Send Feedback
          </button>
        </form>
        <p className="text-base text-gray-400">
          Read our{" "}
          <Link className="text-primary underline" href="/home/privacy">
            {" "}
            Privacy Policy{" "}
          </Link>
        </p>
      </div>
    </section>
  );
};

export default NewsLetterBox;
