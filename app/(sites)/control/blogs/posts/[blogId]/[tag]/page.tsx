import AllWithTags from "@/app/(sites)/control/_components/Blogs/AllWithTags";
import NoTagBlogs from "@/app/(sites)/control/_components/Blogs/NoTagBlogs";
import { db } from "@/db";
import { subDays } from "date-fns";
import "@/lib/suppressHydration"

interface TagProps {
  params: {
    tag: string;
    blogId: string;
  };
}

const Page = async ({ params }: TagProps) => {
  const { tag, blogId } = params;
  const hashtag = `#${tag}`;
  const allBlogsWithThisTag = await db.blogs.findMany({
    where: {
      body: {
        search: `${tag} | ${hashtag}`,
        mode: "insensitive",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-6 text-gray-700 sm:shadow-sm sm:rounded-lg">
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
