import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const RelatedPost = ({
  image,
  slug,
  title,
  date,
  company,
}: {
  image: string;
  slug: string;
  title: string;
  date: string;
  company: string;
}) => {
  const router = useRouter();

  function getInitials(fullName: string): string {
    const nameParts = fullName.split(" ");

    if (nameParts.length >= 2) {
      const initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);
      return initials.toUpperCase();
    } else if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    } else {
      return "";
    }
  }
  return (
    <div className="flex items-center lg:flex xl:flex">
      <div className="mr-5 xl:mb-0">
        {image ? (
          <div
            onClick={() => router.push(`${slug}?origin=site/career-point`)}
            className="relative cursor-pointer h-[56px] w-[56px] overflow-hidden rounded-sm sm:h-[60px] sm:w-[60px]"
          >
            <Image src={image} alt={title} fill sizes="100%" priority />
          </div>
        ) : (
          <div
            onClick={() => router.push(`${slug}?origin=site/career-point`)}
            className="sm:w-[60px] h-[56px] w-[56px] cursor-pointer py-1 px-0.5 sm:h-[60px] shrink-0 text-gray-600 border border-gray-200  bg-gray-100 rounded-sm sm:flex items-center justify-center"
          >
            <div className="flex items-center justify-center shrink-0 w-full h-full">
              <div className="text-2xl font-medium shrink-0">
                {getInitials(company as string)}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="w-full">
        <h5>
          <Link
            href={`${slug}?origin=site/career-point`}
            className="mb-[6px] block text-base font-medium leading-snug text-black hover:text-primary"
          >
            <span className="line-clamp-1">{title}</span>
          </Link>
        </h5>
        <p className="text-xs font-medium text-body-color line-clamp-1">
          {company}
        </p>
        <p className="text-xs font-normal text-body-color line-clamp-1">
          {date}
        </p>
      </div>
    </div>
  );
};

export default RelatedPost;