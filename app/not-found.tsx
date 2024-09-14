import Link from "next/link";

export default function NotFound() {
  return (
    <section className="h-full min-h-full">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-primary md:text-4xl">
            Something&apos;s missing.
          </p>
          <p className="mb-4 text-lg text-gray-600">
            Sorry, we can&apos;t find that page. You&apos;ll find lots to
            explore on the home page.{" "}
          </p>
          <Link
            href="/"
            title="To homepage"
            className="inline-flex text-white bg-slate-800 hover:bg-slate-800 hover:opacity-90 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-sm text-sm px-5 py-2.5 text-center my-4"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
