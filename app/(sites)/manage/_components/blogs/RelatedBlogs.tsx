import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const RelatedPost = ({
  image,
  slug,
  title,
  date,
  blogId,
}: {
  image: string;
  slug: string;
  title: string;
  date: string;
  blogId: string;
}) => {
  const router= useRouter()
  return (
    <div className="flex items-center lg:flex xl:flex">
      <div className="mr-5 lg:mb-3 xl:mb-0">
        <div onClick={()=> router.push(`${slug}?origin=manage/blogs/${blogId}`)} className="relative cursor-pointer h-[60px] w-[70px] overflow-hidden rounded-md sm:h-[75px] sm:w-[85px]">
          <Image src={image} alt={title} fill sizes="100%" priority />
        </div>
      </div>
      <div className="w-full">
        <h5>
          <Link
            href={`${slug}?origin=manage/blogs/${blogId}`}
            className="mb-[6px] block text-base font-medium leading-snug text-black hover:text-primary"
          >
            <span className="line-clamp-3">{title}</span>
          </Link>
        </h5>
        <p className="text-xs font-medium text-body-color">{date}</p>
      </div>
    </div>
  );
};

export default RelatedPost;
