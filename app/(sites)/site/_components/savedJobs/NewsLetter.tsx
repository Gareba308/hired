const NewsLetter = () => {
  return (
    <section className="mt-4 max-w-screen-xl mx-auto ">
      <div className="flex-1">
        <h3 className="text-xl text-gray-600 font-medium ">
          Subscribe to our job alerts
        </h3>
        <p className="text-gray-500 text-sm leading-tight">
          Subscribe to receive email alerts of jobs from this company.
        </p>
      </div>
      <div className="mt-4 flex-1">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="items-center justify-center"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="text-gray-500 w-full p-3 rounded-sm border outline-none focus:border-primary"
          />
          <button className="w-full mt-3 px-5 py-3 rounded-sm text-white bg-primary duration-150 outline-none focus:shadow-none focus:ring-2 ring-offset-2 ring-indigo-600 s">
            Subscribe
          </button>
        </form>
        <p className="mt-3 text-base text-gray-400">
          For job updates and announcements.
        </p>
        <p className="text-base text-gray-400">
          Read our{" "}
          <a className="text-primary underline" href="/manage">
            {" "}
            Privacy Policy{" "}
          </a>
        </p>
      </div>
    </section>
  );
};

export default NewsLetter;
