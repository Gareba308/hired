import Image from "next/image";
import { useRouter } from "next/navigation";

const JobsSide = ({
  image,
  slug,
  title,
  date,
  company,
  jobID,
  detailJobID,
}: {
  image: string;
  slug: string;
  title: string;
  date: string;
  company: string;
  jobID: string;
  detailJobID: string;
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
    <div className="flex items-center lg:flex lg:flex-row lg:items-center">
      <div className="mr-4 md:mr-3">
        {image ? (
          <div
            onClick={() => router.push(`${slug}`)}
            className="relative cursor-pointer h-[52px] w-[56px] overflow-hidden rounded-sm md:h-[56px] md:w-[60px]"
          >
            <Image
              src={image}
              alt={title}
              title={title}
              fill
              sizes="100%"
              priority
            />
          </div>
        ) : (
          <div
            onClick={() => router.push(`${slug}`)}
            className="md:w-[56px] h-[52px] w-[52px] cursor-pointer py-1 px-0.5 md:h-[56px] shrink-0 text-gray-600 border border-gray-200  bg-gray-100 hover:bg-secondary rounded-sm sm:flex items-center justify-center"
          >
            <div className="flex items-center justify-center shrink-0 w-full h-full">
              <div className="text-2xl sm:text-2xl font-medium shrink-0">
                {getInitials(company as string)}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="w-full">
        <h5
          onClick={() => router.push(`${slug}`)}
          className="mb-[4px] block text-base cursor-pointer font-medium leading-snug text-primary hover:text-[#005580]"
        >
          <span className="line-clamp-1">{title}</span>
        </h5>
        <p className="text-xs font-medium text-body-color line-clamp-1">
          {company}
        </p>
        <p suppressHydrationWarning className="text-xs font-normal text-body-color line-clamp-1">
          {date}
        </p>
      </div>
    </div>
  );
};

export default JobsSide;
