"use client";

import { Blogs } from "@prisma/client";
import { CornerUpLeft} from "lucide-react";
import HeadingEdit from "./edits/HeadingEdit";
import CategoryEdit from "./edits/CategoryEdit";
import TargetEdit from "./edits/TargetEdit";
import BodyEdit from "./edits/BodyEdit";
import ImageEdit from "./edits/ImageEdit";
import CreditEdit from "./edits/CreditEdit";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface EditBlogProps {
  blog: Blogs;
}

const EditBlog = ({ blog }: EditBlogProps) => {
  const searchParams = useSearchParams();
  const origin = searchParams?.get("origin");
  return (
    <>
      <div className="flex items-center flex-row mb-2">
        <Link href={origin ? `/${origin}` : "/control/blogs/posts"} className="hover:text-[#005580]">
          <CornerUpLeft className="h-6 w-6 mr-2.5" />
        </Link>
        <h3 className="font-bold text-gray-600 tracking-tight text-2xl sm:text-3xl">
          Blog Settings
        </h3>
      </div>
      <fieldset className=" border border-gray-200 rounded-lg px-2.5 lg:px-3">
        <legend className="text-lg sm:text-xl font-semibold text-gray-600">
          Edit Blog Post
        </legend>
        <dl className="divide-y divide-gray-100">
          <HeadingEdit blog={blog} />
          <CategoryEdit blog={blog} />
          <TargetEdit blog={blog} />
          <BodyEdit blog={blog} />
          <ImageEdit blog={blog} />
          <CreditEdit blog={blog} />
        </dl>
      </fieldset>
    </>
  );
};

export default EditBlog;
