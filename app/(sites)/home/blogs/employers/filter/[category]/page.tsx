import { cache } from "react";
import AllCategoryBlogs from "../../../../_components/employersBlogs/filter/AllCategoryBlogs";
import NoCategoryBlogs from "../../../../_components/employersBlogs/filter/NoCategoryBlogs";
import { db } from "@/db";
import { siteConfig } from "@/lib/config";
import { Metadata } from "next";
import Footer from "@/components/Footer";

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
        in: ["Employer", "All"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return allBlogsMatchingThisCategory;
});


export async function generateMetadata({
  params,
}: CategoryProps): Promise<Metadata> {
  const { category } = params;

  function convertFromSlug(slug: string): string {
    return slug.replace(/-/g, " ");
  }
  const newCategory = convertFromSlug(category);

  const capitalizeFirstLetter = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const categoryUpper = capitalizeFirstLetter(newCategory);
  const allBlogsMatchingThisCategory = await getBlog(newCategory);
  if (allBlogsMatchingThisCategory.length === 0) {
    return {
      title: "No blogs found",
      description: "There are no blogs matching this category.",
    };
  }
  return {
    title: `${categoryUpper} blogs`,
    description:
      "Stay ahead with top recruitment insights, hiring tips, and workforce management advice for Kenyan employers. Transform your hiring process now!",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      title: `${categoryUpper} blogs`,
      description:
        "Stay ahead with top recruitment insights, hiring tips, and workforce management advice for Kenyan employers. Transform your hiring process now!",
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogEmployerBlogs,
          width: 1200,
          height: 630,
          alt: `${categoryUpper} blogs`,
        },
      ],
    },
    alternates: {
      canonical: `/home/blogs/employers/filter/${category}`,
      languages: {
        "en-US": "/en-US",
      },
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryUpper} blogs`,
      description:
        "Stay ahead with top recruitment insights, hiring tips, and workforce management advice for Kenyan employers. Transform your hiring process now!",
      images: [
        {
          url: siteConfig.ogEmployerBlogs,
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
  const { category } = params;

  function convertFromSlug(slug: string): string {
    return slug.replace(/-/g, " ");
  }
  const newCategory = convertFromSlug(category);

  const allBlogsMatchingThisCategory = await getBlog(newCategory);
  return (
    <>
      <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-70px)] mx-auto bg-white px-4 md:px-6 text-gray-700">
        {allBlogsMatchingThisCategory.length === 0 ? (
          <NoCategoryBlogs />
        ) : (
          <AllCategoryBlogs
            blogs={allBlogsMatchingThisCategory}
            category={newCategory}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default Page;
