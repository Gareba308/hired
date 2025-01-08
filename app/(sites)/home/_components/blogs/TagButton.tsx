import Link from "next/link";

const TagButton = ({ text, blogId }: { text: string; blogId: string }) => {
  return (
    <Link
      href={`/home/blogs/job-seekers/${blogId}/${text.toLowerCase()}`}
      className="bg-primary mb-3 mr-3 inline-flex items-center capitalize justify-center rounded-sm px-4 py-2 text-sm text-white duration-300 hover:bg-primary hover:text-white dark:hover:bg-primary hover:opacity-90"
    >
      {text}
    </Link>
  );
};

export default TagButton;
