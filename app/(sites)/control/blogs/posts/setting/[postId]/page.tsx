import EditBlog from "@/app/(sites)/control/_components/Blogs/EditBlog";
import { db } from "@/db";
import { redirect } from "next/navigation";

interface SettingsProps {
  params: {
    postId: string;
  };
}

export async function generateStaticParams() {
  const employerBlogs = await db.blogs.findMany();

  const blogIDs= employerBlogs.map((blog) => blog.id);
  return blogIDs;
}

const Page = async ({ params }: SettingsProps) => {
  const { postId } = params;
  const blog= await db.blogs.findFirst({
    where: {
      id: postId
    }
  })

  if(!blog) redirect('/control/blogs/posts')
  return (
    <div className="pb-5 pt-2 max-w-7xl min-h-[calc(100vh-90px)] mx-auto bg-white px-4 md:px-6 text-gray-700 sm:shadow-sm sm:rounded-lg">
      <EditBlog blog={blog}/>
    </div>
  );
};

export default Page;
