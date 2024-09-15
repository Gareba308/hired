import AllCategoryBlogs from "../../../_components/blogs/filter/AllCategoryBlogs";
import NoCategoryBlogs from "../../../_components/blogs/filter/NoCategoryBlogs";
import { db } from "@/db";

interface CategoryProps {
  params: {
    category: string;
  };
}

const Page = async ({ params }: CategoryProps) => {
  const { category } = params;

  function convertFromSlug(slug: string): string {
    return slug.replace(/-/g, " ");
  }
  const newCategory = convertFromSlug(category);

  const allBlogsMatchingThisCategory = await db.blogs.findMany({
    where: {
      category: {
        equals: newCategory,
        mode: "insensitive",
      },
      target: {
        in: ["Worker", "All"],
      },
      hide: {
        equals: false
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-6 text-gray-700 sm:shadow-sm sm:rounded-lg">
      {allBlogsMatchingThisCategory.length === 0 ? (
        <NoCategoryBlogs />
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
