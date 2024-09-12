"use client";

import RelatedPost from "./RelatedBlogs";
import SharePost from "./SharePost";
import TagButton from "./TagButton";
import NewsLetterBox from "./NewsLetter";
import Image from "next/image";
import { Blogs } from "@prisma/client";
import { ArrowRight, Camera, CornerUpLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Preview2 } from "@/components/Preview2";
import { useToast } from "@/components/ui/use-toast";
import DateDisplay from "@/lib/DateDisplay";
interface BlogDetailsProps {
  blog: Blogs;
  allOtherBlogs: Blogs[];
  topCategories: string[];
  topTags: string[];
  topHashtags1: string[];
}
const BlogDetails = ({
  blog,
  allOtherBlogs,
  topCategories,
  topTags,
  topHashtags1,
}: BlogDetailsProps) => {
  const router = useRouter();
  const { toast } = useToast();
  function countWords(text: string): number {
    const words = text.trim().split(/\s+/);
    return words.length;
  }

  function calculateReadingTime(words: number): string {
    const wordsPerMinute = 180;
    const minutes = Math.ceil(words / wordsPerMinute);
    if (minutes === 1) {
      return "1 min read";
    } else {
      return `${minutes} min read`;
    }
  }

  const blogContent = blog.body;
  const numberOfWords = countWords(blogContent);
  const readingTime = calculateReadingTime(numberOfWords);

  function cleanHashtags(body: string): string {
    return body.replace(/#(\w+)/g, "$1");
  }

  const cleanBody = cleanHashtags(blog.body);

  function convertToSlug(text: string): string {
    return text.toLowerCase().replace(/\s+/g, "-");
  }

  const profileImage = blog.publisherProfile
    ? blog.publisherProfile
    : "https://res.cloudinary.com/dx0i37cyd/image/upload/v1708947730/avatar-159236_1280_1_r7od9k.png";

  const handleCopyClick = async () => {
    const currentUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast({
        title: "Blog link copied",
        description:
          "The blog's URL link has been copied to clipboard. You may share around the article.",
        variant: "default",
        duration: 4000,
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Was unable to copy the blog's URL link",
        variant: "destructive",
        duration: 4000,
      });
    }
  };
  return (
    <>
      <section className="overflow-hidden pb-5">
        <div className="w-full mx-auto">
          <div className="flex flex-wrap">
            <div className="w-full xl:pr-4 xl:w-8/12">
              <div>
                <div className=" flex items-center flex-row">
                  <Link
                    href={"/home/blogs/job-seekers"}
                    className="hover:text-[#005580]"
                  >
                    <CornerUpLeft className="h-6 w-6 mr-2.5 shrink-0" />
                  </Link>
                  {blog.category && (
                    <span className="inline-flex items-center rounded-sm bg-green-100 px-2 py-[3px] text-[12.6px] font-medium text-green-700 ring-1 ring-inset ring-green-500/20">
                      {blog.category}
                    </span>
                  )}
                </div>
                <h1 className="mb-2 text-3xl font-bold leading-tight text-gray-700 sm:text-4xl tracking-tight">
                  {blog.heading}
                </h1>
                <div className="flex flex-wrap items-center justify-between pb-1">
                  <div className="flex flex-wrap items-center">
                    <div className="mb-4 mr-8 flex items-center">
                      <div className="mr-4">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full">
                          <Image
                            src={profileImage}
                            alt="author"
                            fill
                            priority
                            sizes="100%"
                          />
                        </div>
                      </div>
                      <div className="w-full">
                        <span className="mb-1 text-base font-medium text-body-color">
                          By <span> {blog.fullName}</span>
                        </span>
                      </div>
                    </div>
                    <div className="mb-4 flex items-center">
                      <p className="mr-5 flex items-center text-sm font-normal text-body-color">
                        <span className="mr-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-600 h-[18px] w-[18px"
                          >
                            <path d="M8 2v4" />
                            <path d="M16 2v4" />
                            <rect width="18" height="18" x="3" y="4" rx="2" />
                            <path d="M3 10h18" />
                            <path d="M8 14h.01" />
                            <path d="M12 14h.01" />
                            <path d="M16 14h.01" />
                            <path d="M8 18h.01" />
                            <path d="M12 18h.01" />
                            <path d="M16 18h.01" />
                          </svg>
                        </span>
                        <DateDisplay date={blog.createdAt} formatString="MMMM d, yyyy" />
                      </p>
                      <p className="flex mr-5 items-center text-sm font-normal text-body-color">
                        <span className="mr-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-600 h-[18px] w-18px"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        </span>
                        {readingTime}
                      </p>
                      <p
                        onClick={handleCopyClick}
                        className="flex items-center cursor-pointer text-sm font-normal text-body-color"
                      >
                        <Share2 className="text-gray-600 h-[18px] w-18px" />
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mb-5">
                    <div className="w-full overflow-hidden rounded-sm border border-gray-200">
                      <div className="relative aspect-[97/60] w-full sm:aspect-[97/44]">
                        <Image
                          src={blog.image}
                          alt="image"
                          fill
                          sizes="100%"
                          priority
                          style={{ objectFit: "cover" }}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    </div>
                    <p className="flex items-center text-gray-700 text-[13px]">
                      <span className="font-semibold mr-1 flex items-center">
                        <Camera className="h-4 w-4 mr-1 text-[#005580]" />
                        Image Credits:
                      </span>
                      {blog.credit}
                    </p>
                  </div>
                  <div className="mb-8 text-base leading-relaxed">
                    <Preview2 value={cleanBody} />
                  </div>
                  <div className="items-start gap-x-4 justify-between lg:flex">
                    <div className="mb-5">
                      <h4 className="mb-1 text-base font-medium text-body-color">
                        Mentioned Tags:
                      </h4>
                      {topHashtags1.length !== 0 && (
                        <div className="flex flex-wrap gap-y-1.5 items-center">
                          {topHashtags1.flatMap((tag, index) => (
                            <TagButton
                              key={index}
                              text={tag}
                              blogId={blog.id}
                            />
                          ))}
                        </div>
                      )}
                      {topHashtags1.length === 0 && (
                        <div className="flex items-center">
                          <p className="text-sm text-gray-500 italic">
                            There are no mentioned tags.
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="mb-5">
                      <h5 className="mb-1 text-base font-medium text-body-color lg:text-right">
                        Share this blog post:
                      </h5>
                      <div className="flex items-center lg:justify-end">
                        <SharePost blog={blog} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full xl:pl-4 xl:w-4/12">
              <div className="shadow-sm border border-gray-300 mb-4 xl:mb-10 rounded-sm bg-white">
                <h3 className="border-b border-body-color border-opacity-10 px-5 py-3 text-lg font-semibold text-primary bg-gray-200">
                  What is on your mind?
                </h3>
                <div className="px-5 py-6 leading-relaxed">
                  <p className="text-base font-normal">
                    The idea is to publish comprehensive, catchy and upto date
                    articles to help both the employers and candidates. That is
                    the main objective of this platform.
                  </p>
                  <div className="mt-4">
                    <Button
                      size="lg"
                      type="button"
                      onClick={() => router.push("/home/blogs/job-seekers")}
                      className="w-full sm:w-max xl:w-full hover:bg-primary hover:opacity-90"
                    >
                      Apply Job
                      <ArrowRight className="h-4 w-4 ml-2 shrink-0" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="shadow-sm border border-gray-300 mb-4 xl:mb-10 rounded-sm bg-white">
                <h3 className="border-b border-body-color border-opacity-10 px-5 py-3 text-lg font-semibold text-primary bg-gray-200">
                  Latest Publications
                </h3>
                {allOtherBlogs.length !== 0 ? (
                  <ul className="p-5">
                    {allOtherBlogs.flatMap((post) => (
                      <li
                        key={post.id}
                        className="mb-6 border-b border-body-color border-opacity-10 pb-4"
                      >
                        <RelatedPost
                          title={post.heading}
                          blogId={blog.id}
                          image={post.image}
                          slug={`/home/blogs/job-seekers/${post.id}`}
                          date={
                            <>
                              <DateDisplay date={blog.createdAt} formatString="MMMM d, yyyy" />
                              ,{" "}
                              <DateDisplay
                                date={blog.createdAt}
                                formatString="HH:mm"
                              />
                              h
                            </>
                          }
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm px-5 py-8 font-normal text-gray-500">
                    <h2 className="text-lg font-semibold text-gray-600 mb-1.5">
                      No other blog posts
                    </h2>
                    <p className="text-base">
                      Other latest blog publications will appear here.
                    </p>
                  </div>
                )}
              </div>
              <div className="shadow-sm border border-gray-300 mb-4 xl:mb-10 rounded-sm bg-white">
                <h3 className="border-b border-body-color border-opacity-10 px-5 py-3 text-lg font-semibold text-primary bg-gray-200">
                  Popular Category
                </h3>
                {topCategories.length !== 0 && (
                  <div className="px-5 py-6">
                    {topCategories.flatMap((category, index) => (
                      <div key={index}>
                        <Link
                          href={`/home/blogs/job-seekers/${
                            blog.id
                          }/categories/${convertToSlug(
                            category
                          )}?origin=home/blogs/job-seekers/${blog.id}`}
                          className="mb-3 inline-block text-base font-medium text-body-color hover:text-primary"
                        >
                          {category}
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
                {topCategories.length === 0 && (
                  <div className="px-5 py-6">
                    <h2 className="text-lg font-semibold text-gray-600 mb-1.5">
                      No category details
                    </h2>
                    <p className="text-base">
                      Popular categories will appear here.
                    </p>
                  </div>
                )}
              </div>
              <div className="shadow-sm border border-gray-300 mb-4 xl:mb-10 rounded-sm bg-white">
                <h3 className="border-b border-body-color border-opacity-10 px-5 py-3 text-lg font-semibold text-primary bg-gray-200">
                  Popular Tags
                </h3>
                {topTags.length !== 0 && (
                  <div className="flex flex-wrap px-5 py-6">
                    {topTags.flatMap((tag, index) => (
                      <TagButton key={index} text={tag} blogId={blog.id} />
                    ))}
                  </div>
                )}
                {topTags.length === 0 && (
                  <div className="flex flex-wrap px-5 py-6">
                    <h2 className="text-lg font-semibold text-gray-600 mb-1.5">
                      No popular blog tags
                    </h2>
                    <p className="text-base text-gray-500">
                      There are no details on popular tags yet.
                    </p>
                  </div>
                )}
              </div>

              <div className="shadow-sm border border-gray-300 mb-4 xl:mb-10 rounded-sm bg-white">
                <NewsLetterBox />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetails;
