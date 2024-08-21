import AllCategoryBlogs from "@/app/(sites)/control/_components/Blogs/AllCategoryBlogs";
import NoCategoryBlogs from "@/app/(sites)/control/_components/Blogs/NoCategoryBlogs";
import { db } from "@/db";

interface CategoryProps {
  params: {
    category: string;
    blogId: string;
  };
}
// export const revalidate = 60;

// export async function generateStaticParams() {
//   const allBlogCategories = await db.blogs.findMany({
//     select: {
//       category: true
//     }
//   });

//   const convertToSlug = (text: string): string => {
//     return text.toLowerCase().replace(/\s+/g, "-");
//   };

//   return allBlogCategories.map((blog) => ({
//     category: convertToSlug(blog.category),
//   }));
// }

const Page = async ({ params }: CategoryProps) => {
  const { blogId, category } = params;

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
