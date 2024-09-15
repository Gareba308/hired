import { cache } from "react";
import AllWithTags from "../../../../_components/employersBlogs/AllWithTags";
import NoTagBlogs from "../../../../_components/employersBlogs/NoTagBlogs";
import { db } from "@/db";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import Footer from "@/components/Footer";

interface TagProps {
  params: {
    tag: string;
    blogId: string;
  };
}

const getTagBlog = cache(async (tag: string) => {
  const hashtag = `#${tag}`;
  const allBlogsWithThisTag = await db.blogs.findMany({
    where: {
      body: {
        search: `${tag} | ${hashtag}`,
        mode: "insensitive",
      },
      target: {
        in: ["Employer", "All"],
      },
      hide: {
        equals: false
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return allBlogsWithThisTag;
});

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
      title: "No blogs found",
      description: "The blogs you are looking for does not exist.",
    };
  }
  return {
    title: {
      absolute: `${goodTag}: Hiring Strategies from ${blog.heading}`,
    },
    description:
      "Stay ahead with top recruitment insights, hiring tips, and workforce management advice for Kenyan employers. Transform your hiring process now!",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: {
        absolute: `${goodTag}: Hiring Strategies from ${blog.heading}`,
      },
      description:
        "Stay ahead with top recruitment insights, hiring tips, and workforce management advice for Kenyan employers. Transform your hiring process now!",
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogEmployerBlogs,
          width: 1200,
          height: 630,
          alt: `${goodTag} as seen in ${blog.heading}`,
        },
      ],
    },
    alternates: {
      canonical: `/home/blogs/employers/${blogId}/${tag}`,
      languages: {
        "en-US": "/en-US",
      },
    },
    twitter: {
      card: "summary_large_image",
      title: {
        absolute: `${goodTag}: Hiring Strategies from ${blog.heading}`,
      },
      description:
        "Stay ahead with top recruitment insights, hiring tips, and workforce management advice for Kenyan employers. Transform your hiring process now!",
      images: [
        {
          url: siteConfig.ogEmployerBlogs,
          width: 1200,
          height: 630,
          alt: `${goodTag} as seen in ${blog.heading}`,
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
