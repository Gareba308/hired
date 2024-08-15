import AllCategoryBlogs from "@/app/(sites)/site/_components/blogs/AllCategoryBlogs";
import NoCategoryBlogs from "@/app/(sites)/site/_components/blogs/NoCategoryBlogs";
import { db } from "@/db";

interface CategoryProps {
  params: {
    category: string;
    blogId: string;
  };
}

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

  const blogSlugs= allBlogCategories.map((blog) => convertToSlug(blog.category))
  return blogSlugs;
}

const Page = async ({ params }: CategoryProps) => {
  const { blogId, category } = params;

  function convertFromSlug(slug: string): string {
    return slug.replace(/-/g, " ");
  }
  const newCategory= convertFromSlug(category)

  const allBlogsMatchingThisCategory = await db.blogs.findMany({
    where: {
      category: {
        equals: newCategory,
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
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-6 text-gray-700 sm:shadow-sm sm:rounded-lg">
      {allBlogsMatchingThisCategory.length === 0 ? (
        <NoCategoryBlogs blogId={blogId} />
      ) : (
        <AllCategoryBlogs
          blogs={allBlogsMatchingThisCategory}
          blogId={blogId}
          category={newCategory}
        />
      )}
    </div>
  );
};

export default Page;
