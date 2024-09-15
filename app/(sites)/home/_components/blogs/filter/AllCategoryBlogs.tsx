"use client";

import { Menu, Transition } from "@headlessui/react";
import { Blogs } from "@prisma/client";
import { format } from "date-fns";
import { ChevronDownIcon, CornerUpLeft, SlidersHorizontal} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter} from "next/navigation";
import { Fragment, useState } from "react";
import ReactPaginate from "react-paginate";
import { categories } from "../../data/create-job/BlogData";

interface AllCategoryBlogsProps {
  blogs: Blogs[];
  category: string;
}
const pageSize = 12;
const AllCategoryBlogs = ({ blogs, category }: AllCategoryBlogsProps) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const pageBlogs = blogs.slice(startIndex, endIndex);
  const totalPages = Math.ceil(blogs.length / pageSize);

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };

  function convertToSlug(text: string): string {
    return text.toLowerCase().replace(/\s+/g, "-");
  }
  return (
    <div>
      <div className="flex items-center justify-between gap-x-6 border-b border-gray-200 pb-1.5">
        <div className="flex items-center gap-x-2 sm:gap-x-2.5">
          <Link
            href={`/home/blogs/job-seekers`}
            className="hover:text-[#005580] text-gray-700"
          >
            <CornerUpLeft className="h-6 w-6 shrink-0" />
          </Link>
          <div className="flex flex-col">
            <h3 className="font-bold capitalize line-clamp-1 text-gray-600 tracking-tight text-xl sm:text-2xl lg:text-3xl">
              {category} Blogs
            </h3>
          </div>
        </div>
        <div>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="flex items-center w-full justify-center gap-x-1.5 rounded-sm bg-white px-3 py-1.5 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                <SlidersHorizontal className="h-4 w-4 mr-0.5" />
                Filter
                <ChevronDownIcon
                  className="-mr-1 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-1 w-56 max-h-[400px] overflow-y-auto origin-top-right divide-y divide-gray-100 rounded-sm bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {categories.flatMap((category, index) => (
                  <div key={index}>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href={`/home/blogs/job-seekers/filter/${convertToSlug(
                            category.value
                          )}`}
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          {category.label}
                        </Link>
                      )}
                    </Menu.Item>
                  </div>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
      <div className="mx-auto max-w-7xl relative">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-6 mt-2 lg:mx-0 lg:max-w-none sm:grid-cols-2 lg:grid-cols-3">
          {pageBlogs.map((post) => (
            <article
              key={post.id}
              className="flex max-w-xl flex-col border border-gray-300 rounded-lg items-start"
            >
              <Link
                href={`/home/blogs/job-seekers/${
                  post.id
                }?origin=home/blogs/job-seekers/filter/${convertToSlug(category)}`}
                className="h-[200px] sm:h-[180px] w-full bg-gray-200 relative"
              >
                <Image
                  src={post.image}
                  alt="Blog Image"
                  fill
                  sizes="100%"
                  priority
                  style={{ objectFit: "cover" }}
                  className="rounded-tr-lg rounded-tl-lg"
                />
              </Link>
              <div className="px-2.5 pb-3 pt-1 w-full  border-t border-gray-200">
                <div className="flex items-center justify-between gap-x-4 text-xs">
                  <p suppressHydrationWarning className="text-gray-500 line-clamp-1">
                    {format(post.createdAt, "PPP")},{" "}
                    {format(post.createdAt, "HH:mm")}h
                  </p>
                  <div className="relative rounded-sm bg-gray-100 border-gray-200 px-2 py-[5px] font-medium text-gray-600 hover:bg-gray-100">
                    <span className="line-clamp-1">{post.category}</span>
                  </div>
                </div>
                <div className="group relative">
                  <h3 className="mt-1 text-lg font-semibold text-gray-800 hover:underline leading-tight group-hover:text-gray-700">
                    <Link
                      href={`/home/blogs/job-seekers/${
                        post.id
                      }?origin=home/blogs/job-seekers/filter/${convertToSlug(category)}`}
                    >
                      <span className="absolute inset-0" />
                      {post.heading}
                    </Link>
                  </h3>
                  <div
                    onClick={() =>
                      router.push(
                        `/home/blogs/job-seekers/${
                          post.id
                        }?origin=home/blogs/job-seekers/filter/${convertToSlug(category)}`
                      )
                    }
                    className="line-clamp-3 mt-1 text-sm text-gray-700"
                  >
                    {post.blogDescription}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-x-4 mt-2 w-full relative">
                  <div className="flex items-center gap-x-3">
                    <div className="relative h-9 w-9 overflow-hidden">
                    {!post.publisherProfile ? (
                        <Image
                          src="https://res.cloudinary.com/dx0i37cyd/image/upload/v1708947730/avatar-159236_1280_1_r7od9k.png"
                          alt="author"
                          fill
                          sizes="100%"
                          className="rounded-full"
                        />
                      ) : (
                        <Image
                          src={post.publisherProfile}
                          alt="author"
                          fill
                          sizes="100%"
                          className="rounded-full"
                        />
                      )}
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold text-gray-700">
                        {post.fullName}
                      </p>
                      <p className="text-gray-600">{post.position}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 pb-4">
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              onPageChange={({ selected }) => handlePageChange(selected + 1)}
              containerClassName={"pagination flex"}
              previousLabel={"Previous"}
              nextLabel={"Next"}
              activeClassName={"active"}
              pageClassName={"mx-0.5 sm:mx-1  cursor-pointer"}
              breakClassName={"mx-0.5 sm:mx-1"}
              previousClassName={"mx-0.5 sm:mx-1"}
              nextClassName={"mx-0.5 sm:mx-1"}
              pageLinkClassName={
                "py-1.5 px-2.5 rounded-sm border border-gray-200 hover:bg-secondary text-gray-600"
              }
              activeLinkClassName={
                "bg-primary text-white border-transparent hover:text-gray-600 hover:border hover:border-gray-200"
              }
              previousLinkClassName={
                "py-1.5 px-2.5 rounded-sm border border-gray-300 hover:bg-secondary"
              }
              nextLinkClassName={
                "py-1.5 px-2.5 rounded-sm border border-gray-300 hover:bg-secondary"
              }
              disabledClassName={"text-gray-400 cursor-not-allowed"}
              marginPagesDisplayed={1}
              pageRangeDisplayed={2}
              breakLabel={"..."}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AllCategoryBlogs;
