"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Menu, Transition } from "@headlessui/react";
import { Blogs } from "@prisma/client";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronDownIcon,
  Edit,
  Eye,
  EyeOff,
  Loader2,
  MoreVertical,
  SlidersHorizontal,
  Trash,
  CornerUpLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter} from "next/navigation";
import { Fragment, useState } from "react";
import ReactPaginate from "react-paginate";
import { BlogPublicationAlertModal } from "../models/blogs/PublicationOfBlogModel";
import { DeleteBlogAlertModal } from "../models/blogs/DeleteBlogModal";
import { useToast } from "@/components/ui/use-toast";

interface AllWithTagsProps {
  allBlogsWithThisTag: Blogs[];
  tag: string;
  blogId: string;
}
const pageSize = 12;
const AllWithTags = ({
  allBlogsWithThisTag,
  tag,
  blogId,
}: AllWithTagsProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentlyPublishingId, setCurrentlyPublishingId] = useState<
    string | null
  >(null);
  const [currentlyDeletingId, setCurrentlyDeletingId] = useState<string | null>(
    null
  );
  const [isPublishOpen, setIsPublishOpen] = useState<boolean>(false);
  const publishClose = () => {
    setIsPublishOpen((prev) => !prev);
  };
  const togglePublication = (blogId: string) => {
    setCurrentlyPublishingId(blogId);
    setIsPublishOpen(true);
  };

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const deleteClose = () => {
    setIsDeleteOpen((prev) => !prev);
  };
  const toggleDelete = (blogId: string) => {
    setCurrentlyDeletingId(blogId);
    setIsDeleteOpen(true);
  };
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  function cleanHashtags(body: string): string {
    return body.replace(/#(\w+)/g, "$1");
  }

  const pageBlogs = allBlogsWithThisTag.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allBlogsWithThisTag.length / pageSize);

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };

  const { mutate: publication, isLoading } = trpc.adminPublishBlog.useMutation({
    onSuccess: (publication) => {
      const hide = publication.hide;
      const publicationDetails = hide
        ? "You have successfully published this blog"
        : "You have successfully unpublished this blog";
      toast({
        title: "Success",
        description: `${publicationDetails}`,
        variant: "default",
        duration: 3000,
      });
      setIsPublishOpen(false);
      router.refresh();
    },
    onError: (err) => {
      if (err.message) {
        toast({
          title: "Something went wrong",
          description: err.message,
          variant: "destructive",
          duration: 3000,
        });
      } else {
        toast({
          title: "Something went wrong",
          description:
            "There was a problem updating publication details of this blog.",
          variant: "destructive",
          duration: 3000,
        });
      }
      setIsPublishOpen(false);
    },
    onMutate: ({ blogId }) => {
      setCurrentlyPublishingId(blogId);
    },
    onSettled: () => {
      setCurrentlyPublishingId(null);
    },
  });

  const confirmPublication = (blog: Blogs) => {
    setCurrentlyPublishingId(blog.id);
    publication({ blogId: blog.id, hide: !blog.hide });
  };

  const { mutate: deleteBlog, isLoading: deleteBlogLoading } =
    trpc.adminDeleteBlog.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You have successfully deleted this blog",
          variant: "default",
          duration: 3000,
        });
        setIsDeleteOpen(false);
        router.refresh();
      },
      onError: (err) => {
        if (err.message) {
          toast({
            title: "Something went wrong",
            description: err.message,
            variant: "destructive",
            duration: 3000,
          });
        } else {
          toast({
            title: "Something went wrong",
            description: "There was a problem deleting this blog post.",
            variant: "destructive",
            duration: 3000,
          });
        }
        setIsDeleteOpen(false);
      },
      onMutate: ({ blogId }) => {
        setCurrentlyDeletingId(blogId);
      },
      onSettled: () => {
        setCurrentlyDeletingId(null);
      },
    });

  const deleteConfirm = (blogId: string) => {
    setCurrentlyDeletingId(blogId);
    deleteBlog({ blogId });
  };
  return (
    <div>
      <div className="flex items-center justify-between gap-x-6 border-b border-gray-200 pb-1.5">
        <div className="flex items-center gap-x-2 sm:gap-x-2.5">
          <Link
            href={`/control/blogs/posts/${blogId}`}
            className="hover:text-[#005580] text-gray-700"
          >
            <CornerUpLeft className="h-6 w-6 shrink-0" />
          </Link>
          <div className="flex flex-col">
            <h3 className="font-bold capitalize line-clamp-1 text-gray-600 tracking-tight text-xl sm:text-2xl lg:text-3xl">
              {tag} Blogs
            </h3>
          </div>
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
                href={`/control/blogs/posts/${post.id}?origin=control/blogs/posts/${blogId}/${tag}`}
                className="h-[200px] sm:h-[180px] rounded-tr-lg rounded-tl-lg w-full bg-gray-200 relative"
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
                <div className="flex items-center gap-x-4 text-xs">
                  <p className="text-gray-500 line-clamp-1">
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
                      href={`/control/blogs/posts/${post.id}?origin=control/blogs/posts/${blogId}/${tag}`}
                    >
                      <span className="absolute inset-0" />
                      {post.heading}
                    </Link>
                  </h3>
                  <div
                    onClick={() =>
                      router.push(
                        `/control/blogs/posts/${post.id}?origin=control/blogs/posts/${blogId}/${tag}`
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
                  <Menu as="div" className="relative inline-block text-left">
                    {currentlyPublishingId === post.id && (
                      <BlogPublicationAlertModal
                        isOpen={isPublishOpen}
                        onClose={publishClose}
                        loading={isLoading}
                        hide={post.hide}
                        onConfirm={() => confirmPublication(post)}
                      />
                    )}
                    {currentlyDeletingId === post.id && (
                      <DeleteBlogAlertModal
                        isOpen={isDeleteOpen}
                        onClose={deleteClose}
                        loading={deleteBlogLoading}
                        onConfirm={() => deleteConfirm(post.id)}
                      />
                    )}
                    <div>
                      <Menu.Button
                        disabled={
                          (currentlyPublishingId === post.id && isLoading) ||
                          (currentlyDeletingId === post.id && deleteBlogLoading)
                        }
                        className="inline-flex justify-center items-center gap-x-1.5 rounded-md px-1.5 py-2 text-sm font-semibold text-gray-900 hover:bg-secondary"
                      >
                        {currentlyPublishingId === post.id && isLoading ? (
                          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-gray-600" />
                        ) : currentlyDeletingId === post.id &&
                          deleteBlogLoading ? (
                          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-gray-600" />
                        ) : (
                          <MoreVertical className="h-5 w-5" />
                        )}
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
                      <Menu.Items className="absolute divide-y divide-gray-100 bottom-full z-10 mb-1 w-52 origin-bottom-left rounded-sm bg-white shadow-top-md border border-gray-300 focus:outline-none right-0">
                        <div className="bg-slate-200 rounded-tl-lg rounded-tr-lg">
                          <h2 className="px-4 font-medium text-base text-gray-600 py-2">
                            Blog Post Options
                          </h2>
                        </div>
                        <div className="pt-1">
                          <Menu.Item>
                            {({ active }) => (
                              <span
                                onClick={() => togglePublication(post.id)}
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "flex items-center cursor-pointer px-4 py-2.5 text-sm"
                                )}
                              >
                                <>
                                  {post.hide ? (
                                    <EyeOff className="h-4 w-4 mr-1.5 shrink-0 text-gray-500" />
                                  ) : (
                                    <Eye className="h-4 w-4 mr-1.5 shrink-0 text-gray-500" />
                                  )}
                                </>
                                <>{post.hide ? "Unpublish" : "Publish"}</>
                              </span>
                            )}
                          </Menu.Item>
                        </div>
                        <div>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href={`/control/blogs/posts/setting/${post.id}?origin=control/blogs/posts`}
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "px-4 py-2.5 flex items-center cursor-pointer text-sm"
                                )}
                              >
                                <Edit className="h-4 w-4 mr-1.5 shrink-0 text-gray-500" />
                                Edit Blog
                              </Link>
                            )}
                          </Menu.Item>
                        </div>
                        <div>
                          <Menu.Item>
                            {({ active }) => (
                              <span
                                onClick={() => toggleDelete(post.id)}
                                className={classNames(
                                  active
                                    ? "text-secondary-foreground bg-secondary"
                                    : "text-destructive-foreground",
                                  "flex items-center cursor-pointer font-medium hover:text-destructive-foreground hover:bg-destructive px-4 py-2.5 text-sm"
                                )}
                              >
                                <Trash className="h-4 w-4 mr-1.5 shrink-0" />
                                Delete Blog
                              </span>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6">
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

export default AllWithTags;
