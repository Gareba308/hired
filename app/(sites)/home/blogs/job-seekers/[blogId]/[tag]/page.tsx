import AllWithTags from "../../../../_components/blogs/AllWithTags";
import NoTagBlogs from "../../../../_components/blogs/NoTagBlogs";
import { db } from "@/db";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { subDays } from "date-fns";
import Footer from "@/components/Footer";

interface TagProps {
  params: {
    tag: string;
    blogId: string;
  };
}

export const revalidate = 30;
export async function generateStaticParams() {
  const sixtyDaysAgo = subDays(new Date(), 60);

  const allBlogsForTags = await db.blogs.findMany({
    where: {
      createdAt: {
        gte: sixtyDaysAgo,
      },
      target: {
        in: ["Worker", "All"],
      },
    },
    select: {
      body: true
    }
  });

  const hashtagsSet = new Set<string>();

  allBlogsForTags.forEach((blog) => {
    const hashtags = blog.body.match(/#\w+/g);
    if (hashtags) {
      hashtags.forEach((hashtag) => {
        const cleanedHashtag = hashtag.substring(1).toLowerCase();
        hashtagsSet.add(cleanedHashtag);
      });
    }
  });

  const tagArrays = Array.from(hashtagsSet);

  return tagArrays.map((tag) => ({ tag }));
}

const getTagBlog = async (tag: string) => {
  const hashtag = `#${tag}`;
  const allBlogsWithThisTag = await db.blogs.findMany({
    where: {
      body: {
        search: `${tag} | ${hashtag}`,
        mode: "insensitive",
      },
      target: {
        in: ["Worker", "All"],
      },
      hide: {
        equals: true
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return allBlogsWithThisTag;
};

export async function generateMetadata({
  params,
}: TagProps): Promise<Metadata> {
  const { tag, blogId } = params;
  function reverseSlug(slug: string): string {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  const goodTag = reverseSlug(tag);
  const allBlogsWithThisTag = await getTagBlog(tag);

  const blog = await db.blogs.findFirst({
    where: {
      id: blogId,
    },
  });
  if (allBlogsWithThisTag.length === 0 || !blog) {
    return {
      title: "No blogs not found",
      description: "The blogs you are looking for does not exist.",
    };
  }
  return {
    title: {
      absolute: `${goodTag}: Proven Tips for Job Seekers to Boost Their Career Success`,
    },
    description:
      "Explore the best job search tips, resume writing advice, and career insights for Kenyan job seekers. Elevate your career journey today!",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: {
        absolute: `${goodTag}: Proven Tips for Job Seekers to Boost Their Career Success`,
      },
      description:
        "Explore the best job search tips, resume writing advice, and career insights for Kenyan job seekers. Elevate your career journey today!",
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogWorkerBlogs,
          width: 1200,
          height: 630,
          alt: `${goodTag}`,
        },
      ],
    },
    alternates: {
      canonical: `/home/blogs/job-seekers/${blogId}/${tag}`,
      languages: {
        "en-US": "/en-US",
      },
    },
    twitter: {
      card: "summary_large_image",
      title: {
        absolute: `${goodTag}: Proven Tips for Job Seekers to Boost Their Career Success`,
      },
      description:
        "Explore the best job search tips, resume writing advice, and career insights for Kenyan job seekers. Elevate your career journey today!",
      images: [
        {
          url: siteConfig.ogWorkerBlogs,
          width: 1200,
          height: 630,
          alt: `${goodTag}`,
        },
      ],
      creator: "@hiredke",
      site: "@hiredke",
    },
  };
}

const Page = async ({ params }: TagProps) => {
  const { tag, blogId } = params;
  const allBlogsWithThisTag = await getTagBlog(tag);
  return (
    <>
      <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-70px)] mx-auto bg-white px-4 md:px-6 text-gray-700">
        {allBlogsWithThisTag.length === 0 ? (
          <NoTagBlogs blogId={blogId} />
        ) : (
          <AllWithTags
            allBlogsWithThisTag={allBlogsWithThisTag}
            tag={tag}
            blogId={blogId}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default Page;
