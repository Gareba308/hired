"use client";

import { Blogs } from "@prisma/client";
import HeadingEdit from "./edits/HeadingEdit";
import CategoryEdit from "./edits/CategoryEdit";
import TargetEdit from "./edits/TargetEdit";
import BodyEdit from "./edits/BodyEdit";
import ImageEdit from "./edits/ImageEdit";
import CreditEdit from "./edits/CreditEdit";

interface EditBlogProps {
  blog: Blogs;
}

const EditBlog = ({ blog }: EditBlogProps) => {
  return (
    <>
      <div className="flex items-center flex-row mb-2">
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
