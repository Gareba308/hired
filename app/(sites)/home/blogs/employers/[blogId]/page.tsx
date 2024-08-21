import { db } from "@/db";
import { redirect } from "next/navigation";
import React, { cache } from "react";
import BlogDetails from "../../../_components/employersBlogs/BlogDetails";
import { Metadata } from "next";
import { format } from "date-fns";
import { siteConfig } from "@/lib/config";

interface BlogIDProps {
  params: {
    blogId: string;
  };
}

interface CategoryCounts {
  [key: string]: number;
}


const getBlog = cache(async (blogId: string) => {
  const blogExists = await db.blogs.findFirst({
    where: {
      id: blogId,
    },
  });

  return blogExists;
});

// export async function generateStaticParams() {
//   const employerBlogs = await db.blogs.findMany({
//     where: {
//       target: {
//         in: ["Employer", "All"],
//       },
//     },
//   });

//   const blogIDs= employerBlogs.map((blog) => blog.id);
//   return blogIDs;
// }

export async function generateMetadata({
  params,
}: BlogIDProps): Promise<Metadata> {
  const { blogId } = params;

  const blog = await getBlog(blogId)

  if (!blog) {
    return {
      title: "Blog not found",
      description: "The blog you are looking for does not exist.",
    };
  }
  const keywords= blog.keywords.split(", ").map(name => name.trim()).slice(0, 10);
  return {
    title: `${blog.heading}`,
    description: `${format(blog.createdAt, "PPP")}: ${blog.blogDescription}`,
    keywords: keywords,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: `${blog.heading}`,
      description: `${format(blog.createdAt, "PPP")}: ${blog.blogDescription}`,
      siteName: siteConfig.name,
      images: [
        {
          url: blog.image,
          width: 1200,
          height: 630,
          alt: `${blog.heading}`,
        },
      ],
    },
    alternates: {
      canonical: `/home/blogs/employers/${blog.id}`,
      languages: {
        "en-US": "/en-US",
      },
    },
    authors: [
      {
        name: blog.fullName,
        url: siteConfig.url
      }
    ],
    twitter: {
      card: "summary_large_image",
      title: `${blog.heading}`,
      description: `${format(blog.createdAt, "PPP")}: ${blog.blogDescription}`,
      images: [
        {
          url: blog.image,
          width: 1200,
          height: 630,
          alt: `${blog.heading}`,
        },
      ],
      creator: "@hiredke",
      site: "@hiredke",
    },
  };
}

const Page = async ({ params }: BlogIDProps) => {
  const { blogId } = params;

  const blogExists = await getBlog(blogId)

  if (!blogExists) redirect(`/home/blogs?origin=home/blogs/${blogId}`);

  const allOtherBlogs = await db.blogs.findMany({
    where: {
      id: {
        not: blogId,
      },
      target: {
        in: ["Employer", "All"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  //Popular blogs category
  const theBlogs = await db.blogs.findMany({
    where: {
      target: {
        in: ["Employer", "All"],
      }
    }
  });
  const categoryCounts: CategoryCounts = theBlogs.reduce(
    (counts: CategoryCounts, blog) => {
      counts[blog.category] = (counts[blog.category] || 0) + 1;
      return counts;
    },
    {}
  );
  const categoryArray = Object.keys(categoryCounts).map((category) => ({
    category,
    count: categoryCounts[category],
  }));
  categoryArray.sort((a, b) => b.count - a.count);
  const topCategories = categoryArray.slice(0, 5);
  const topCategoryNames = topCategories.map((category) => category.category);

  // Find Popular Tag
  const allBlogsForTags = await db.blogs.findMany({
    where: {
      target: {
        in: ["Employer", "All"],
      }
    }
  });
  const hashtagCounts: { [key: string]: number } = {};
  allBlogsForTags.forEach((blog) => {
    const hashtags = blog.body.match(/#\w+/g);
    if (hashtags) {
      hashtags.forEach((hashtag) => {
        const cleanedHashtag = hashtag.substring(1);
        hashtagCounts[cleanedHashtag] =
          (hashtagCounts[cleanedHashtag] || 0) + 1;
      });
    }
  });
  const hashtagArray = Object.keys(hashtagCounts).map((hashtag) => ({
    hashtag,
    count: hashtagCounts[hashtag],
  }));
  hashtagArray.sort((a, b) => b.count - a.count);
  const topHashtags = hashtagArray.slice(0, 6).map((item) => item.hashtag);

  const hashtagCounts1: { [key: string]: number } = {};
  const hashtags1 = blogExists.body.match(/#\w+/g);
  if (hashtags1) {
    hashtags1.forEach((hashtag1) => {
      const cleanedHashtag1 = hashtag1.substring(1);
      hashtagCounts1[cleanedHashtag1] =
        (hashtagCounts1[cleanedHashtag1] || 0) + 1;
    });
  }
  const hashtagArray1 = Object.keys(hashtagCounts1).map((hashtag1) => ({
    hashtag1,
    count: hashtagCounts1[hashtag1],
  }));
  hashtagArray1.sort((a, b) => b.count - a.count);
  const topHashtags1 = hashtagArray1.slice(0, 4).map((item) => item.hashtag1);

  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-70px)] mx-auto bg-white px-4 md:px-6 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <BlogDetails
        blog={blogExists}
        allOtherBlogs={allOtherBlogs}
        topCategories={topCategoryNames}
        topTags={topHashtags}
        topHashtags1={topHashtags1}
      />
    </div>
  );
};

export default Page;
