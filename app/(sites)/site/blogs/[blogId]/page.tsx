import { db } from "@/db";
import { redirect } from "next/navigation";
import React from "react";
import BlogDetails from "../../_components/blogs/BlogDetails";

interface BlogIDProps {
  params: {
    blogId: string;
  };
}

interface CategoryCounts {
  [key: string]: number;
}

export const revalidate = 60;
export async function generateStaticParams() {
  const workerBlogs = await db.blogs.findMany({
    select: {
      id: true,
    },
  });

  return workerBlogs.map((blog) => ({ blogId: blog.id }));
}

const Page = async ({ params }: BlogIDProps) => {
  const { blogId } = params;

  const blogExists = await db.blogs.findFirst({
    where: {
      id: blogId,
    },
  });

  if (!blogExists) redirect(`/site/blogs?origin=site/blogs/${blogId}`);

  const allOtherBlogs = await db.blogs.findMany({
    where: {
      id: {
        not: blogId,
      },
      target: {
        in: ["Worker", "All"],
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
        in: ["Worker", "All"],
      },
    },
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
        in: ["Worker", "All"],
      },
    },
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
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-6 text-gray-700 sm:shadow-sm sm:rounded-lg">
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
