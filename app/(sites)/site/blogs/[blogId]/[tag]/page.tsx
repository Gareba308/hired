import AllWithTags from "../../../_components/blogs/AllWithTags";
import NoTagBlogs from "../../../_components/blogs/NoTagBlogs";
import { db } from "@/db";

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
