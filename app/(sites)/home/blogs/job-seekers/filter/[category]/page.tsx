import { cache } from "react";
import AllCategoryBlogs from "../../../../_components/blogs/filter/AllCategoryBlogs";
import NoCategoryBlogs from "../../../../_components/blogs/filter/NoCategoryBlogs";
import { db } from "@/db";
import { Metadata } from "next";
import { siteConfig } from "@/lib/config";

interface CategoryProps {
  params: {
    category: string;
  };
}

const getBlog = cache(async (category: string) => {
  const allBlogsMatchingThisCategory = await db.blogs.findMany({
    where: {
      category: {
        equals: category,
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

  return allBlogsMatchingThisCategory;
});

export async function generateStaticParams() {
  const allBlogCategories = await db.blogs.findMany({
    where: {
      target: {
        in: ["Worker", "All"],
      },
    },
  });

  const convertToSlug = (text: string): string => {
    return text.toLowerCase().replace(/\s+/g, "-");
  };

  const blogCategories= allBlogCategories.map((blog) => convertToSlug(blog.category))
  return blogCategories;
}

export async function generateMetadata({
  params,
}: CategoryProps): Promise<Metadata> {
  const {category } = params;

  function convertFromSlug(slug: string): string {
    return slug.replace(/-/g, " ");
  }
  const newCategory= convertFromSlug(category)

  const capitalizeFirstLetter = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const categoryUpper= capitalizeFirstLetter(newCategory)
  const allBlogsMatchingThisCategory = await getBlog(newCategory)
  if (allBlogsMatchingThisCategory.length === 0) {
    return {
      title: "No blogs found",
      description: "There are no blogs matching this category.",
    };
  }
  return {
    title: `${categoryUpper} blogs`,
    description: "Explore the best job search tips, resume writing advice, and career insights for Kenyan job seekers. Elevate your career journey today!",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: `${categoryUpper} blogs`,
      description: "Explore the best job search tips, resume writing advice, and career insights for Kenyan job seekers. Elevate your career journey today!",
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogWorkerBlogs,
          width: 1200,
          height: 630,
          alt: `${categoryUpper} blogs`,
        },
      ],
    },
    alternates: {
      canonical: `/home/blogs/job-seekers/filter/${category}`,
      languages: {
        "en-US": "/en-US",
      },
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryUpper} blogs`,
      description: "Dive into expert insights on hiring strategies and workforce management. Enhance your recruitment process with practical tips and industry advice.",
      images: [
        {
          url: siteConfig.ogWorkerBlogs,
          width: 1200,
          height: 630,
          alt: `${categoryUpper} blogs`,
        },
      ],
      creator: "@hiredke",
      site: "@hiredke",
    },
  };
}


const Page = async ({ params }: CategoryProps) => {
  const {category } = params;

  function convertFromSlug(slug: string): string {
    return slug.replace(/-/g, " ");
  }
  const newCategory= convertFromSlug(category)

  const allBlogsMatchingThisCategory = await getBlog(newCategory)
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-70px)] mx-auto bg-white px-4 md:px-6 text-gray-700 sm:shadow-sm sm:rounded-lg">
      {allBlogsMatchingThisCategory.length === 0 ? (
        <NoCategoryBlogs  />
      ) : (
        <AllCategoryBlogs
          blogs={allBlogsMatchingThisCategory}
          category={newCategory}
        />
      )}
    </div>
  );
};

export default Page;
