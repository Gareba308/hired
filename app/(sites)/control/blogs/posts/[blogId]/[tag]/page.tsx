import AllWithTags from "@/app/(sites)/control/_components/Blogs/AllWithTags";
import NoTagBlogs from "@/app/(sites)/control/_components/Blogs/NoTagBlogs";
import { db } from "@/db";

interface TagProps {
  params: {
    tag: string;
    blogId: string;
  };
}

export async function generateStaticParams({ params }: TagProps) {
  const { blogId } = params;

  const blogExists = await db.blogs.findFirst({
    where: {
      id: blogId,
    },
  });

  const allBlogsForTags = await db.blogs.findMany();

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
  const combinedHashtags = Array.from(new Set([...topHashtags, ...topHashtags1]));

  return combinedHashtags;
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
