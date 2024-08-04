import Link from "next/link";

const TagButton = ({ text, blogId }: { text: string; blogId: string }) => {
  return (
    <Link
      href={`/site/blogs/${blogId}/${text.toLowerCase()}`}
      className="bg-gray-light mb-3 mr-3 inline-flex items-center capitalize justify-center rounded-sm px-4 py-2 text-sm text-black duration-300 hover:bg-primary hover:text-white dark:bg-[#2C303B] dark:text-white dark:hover:bg-primary"
    >
      {text}
    </Link>
  );
};

export default TagButton;