import { cache } from "react";
import AllWithTags from "../../../../_components/blogs/AllWithTags";
import NoTagBlogs from "../../../../_components/blogs/NoTagBlogs";
import { db } from "@/db";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";

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
        in: ["Worker", "All"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return allBlogsWithThisTag;
});

export async function generateStaticParams({ params }: TagProps) {
  const { blogId } = params;

  const blogExists = await db.blogs.findFirst({
    where: {
      id: blogId,
    },
  });

  const allBlogsForTags = await db.blogs.findMany({
    where: {
      target: {
        in: ["Worker", "All"],
      },
    },
  });

  const hashtagsSet = new Set<string>();
  const hashtagsSet1 = new Set<string>();

  allBlogsForTags.forEach((blog) => {
    const hashtags = blog.body.match(/#\w+/g);
    if (hashtags) {
      hashtags.forEach((hashtag) => {
        const cleanedHashtag = hashtag.substring(1).toLowerCase();
        hashtagsSet.add(cleanedHashtag);
      });
    }
  });

  const topHashtags = Array.from(hashtagsSet).slice(0, 6);

  if (blogExists) {
    const hashtags1 = blogExists.body.match(/#\w+/g);
    if (hashtags1) {
      hashtags1.forEach((hashtag1) => {
        const cleanedHashtag1 = hashtag1.substring(1).toLowerCase();
        hashtagsSet1.add(cleanedHashtag1);
      });
    }
  }

  const topHashtags1 = Array.from(hashtagsSet1);

  const combinedHashtags = [...topHashtags, ...topHashtags1];

  return combinedHashtags;
}

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

  if (allBlogsWithThisTag.length === 0) {
    return {
      title: "No blogs not found",
      description: "The blogs you are looking for does not exist.",
    };
  }
  return {
    title: `${goodTag} blogs`,
    description:
      "Explore the best job search tips, resume writing advice, and career insights for Kenyan job seekers. Elevate your career journey today!",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: goodTag,
      description:
        "Explore the best job search tips, resume writing advice, and career insights for Kenyan job seekers. Elevate your career journey today!",
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogWorkerBlogs,
          width: 1200,
          height: 630,
          alt: goodTag,
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
      title: `${goodTag} blogs`,
      description:
        "Explore the best job search tips, resume writing advice, and career insights for Kenyan job seekers. Elevate your career journey today!",
      images: [
        {
          url: siteConfig.ogWorkerBlogs,
          width: 1200,
          height: 630,
          alt: goodTag,
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
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-70px)] mx-auto bg-white px-4 md:px-6 text-gray-700 sm:shadow-sm sm:rounded-lg">
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
  );
};

export default Page;
