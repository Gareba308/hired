"use client";

import QuillPreview from "@/components/QuillPreview";
import { Assessment, User } from "@prisma/client";
import { Menu, Transition } from "@headlessui/react";
import {
  Award,
  ChevronDownIcon,
  ChevronUpIcon,
  Clock,
  Edit,
  Loader2,
  MoreVertical,
  Search,
  Trash,
} from "lucide-react";
import React, { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter} from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import { DeleteQuestionAlertModal } from "../models/assessments/DeleteQuestion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ReactPaginate from "react-paginate";
import NoAssessments from "./NoAssessments";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface AllAssessmentsInBannerProps {
  assessments: Assessment[];
  userId: string;
  assessmentID: string;
}
const AllAssessmentsInBanner = ({
  assessments,
  userId,
  assessmentID,
}: AllAssessmentsInBannerProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const pageSize = 10;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showDropdown1, setShowDropdown1] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const dropdownRef1 = useRef<HTMLDivElement>(null);
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  useEffect(() => {
    const uniqueSuggestions = new Set<string>();
    assessments.forEach((assessment) => {
      uniqueSuggestions.add(assessment.question);
    });
    const suggestionsArray = Array.from(uniqueSuggestions)
      .filter((suggestion) =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 10);

    setFilteredSuggestions(suggestionsArray);
  }, [assessments, searchQuery]);

  useEffect(() => {
    const storedSearchHistory = localStorage.getItem(`searchQuestion${userId}`);
    if (storedSearchHistory) {
      setSearchHistory(JSON.parse(storedSearchHistory));
    }
  }, [userId]);

  useEffect(() => {
    localStorage.setItem(
      `searchQuestion${userId}`,
      JSON.stringify(searchHistory)
    );
  }, [searchHistory, userId]);

  const handleSuggestionClick1 = (suggestion: string) => {
    const matchedQuestion = assessments.find(
      (assessment) =>
        assessment.question.toLowerCase() === suggestion.toLowerCase()
    );

    if (matchedQuestion) {
      setSearchQuery(suggestion);
      setShowDropdown1(false);
      if (!searchHistory.includes(suggestion)) {
        setSearchHistory([suggestion, ...searchHistory.slice(0, 9)]);
      }
    }
  };

  const handleSearchChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    if (value.trim() === "") {
      setShowDropdown1(false);
    } else {
      setShowDropdown1(true);
    }
  };

  const handleInputFocus1 = () => {
    if (filteredSuggestions.length > 0 && searchQuery.trim() !== "") {
      setShowDropdown1(true);
    }
  };
  const handleToggleDropdown1 = () => {
    setShowDropdown1((prevShowDropdown) => !prevShowDropdown);
  };
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef1.current &&
        !dropdownRef1.current.contains(event.target as Node)
      ) {
        setShowDropdown1(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const sortedAndFilteredQuestions = assessments.filter((assessment) => {
    if (searchQuery) {
      const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(escapedQuery.toLowerCase(), "i");
      const hasMatchingQuestion = searchRegex.test(
        assessment.question.toLowerCase()
      );
      return hasMatchingQuestion;
    }
    return true;
  });

  const QuestionsForCurrentPage = sortedAndFilteredQuestions.slice(
    startIndex,
    endIndex
  );
  const totalPages = Math.ceil(sortedAndFilteredQuestions.length / pageSize);

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };

  const filteredQuestion = filteredSuggestions.filter((suggestion) =>
    assessments.some((assessment) =>
      assessment.question.toLowerCase().includes(suggestion.toLowerCase())
    )
  );

  const filteredQuestionsFromHistory = searchHistory
    .filter((historyItem) =>
      assessments.some((assessment) =>
        assessment.question.toLowerCase().includes(historyItem.toLowerCase())
      )
    )
    .reverse();

  const [currentlyDeletingID, setCurrentlyDeletingID] = useState<null | string>(
    null
  );

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

  const deleteClose = () => {
    setDeleteOpen((prev) => !prev);
    setCurrentlyDeletingID(null);
  };

  const toggleDelete = (questionID: string) => {
    setDeleteOpen(true);
    setCurrentlyDeletingID(questionID);
  };

  const { mutate: deleteContent, isLoading: deleteLoading } =
    trpc.adminDeleteAssessmentQuestion.useMutation({
      onSuccess: () => {
        toast({
          title: "Success",
          description: "You have successfully deleted this assessment question",
          variant: "default",
          duration: 3000,
        });
        deleteClose();
        router.refresh();
      },
      onError: (err) => {
        toast({
          title: "Something went wrong",
          description:
            err.message || "There was a problem deleting this question",
          variant: "destructive",
          duration: 3000,
        });
        deleteClose();
      },

      onMutate: ({ questionID }) => {
        setCurrentlyDeletingID(questionID);
      },
      onSettled: () => {
        setCurrentlyDeletingID(null);
      },
    });

  const deleteConfirm = (questionID: string) => {
    setCurrentlyDeletingID(questionID);
    deleteContent({ questionID });
  };

  const pathname = usePathname();
  const isActive = pathname === `/control/assessments/${assessmentID}`;
  return (
    <div>
      <div className="sm:border-b sm:border-gray-300">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/control/jobs">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={"/control/assessments"}
              >
                Tests
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Questions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col sm:flex-row gap-y-2 sm:items-end sm:justify-between sm:gap-x-3">
          <div className="flex flex-row justify-start mt-2 gap-x-4 border-b sm:border-b-0 border-gray-300">
            <Link
              href={`/control/assessments/${assessmentID}`}
              className={cn(
                "border-b-[3px] text-lg border-transparent pb-0.5 transition-all duration-300",
                isActive &&
                  "border-b-[3px] border-sky-800 font-medium hover:border-[#005580]"
              )}
            >
              Questions
            </Link>
            <Link
              href={`/control/assessments/${assessmentID}/results`}
              className="border-b-[3px] border-transparent text-lg pb-0.5 transition-all duration-300"
            >
              Results
            </Link>
          </div>

          <div className="relative pb-1.5 sm:pb-0.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              placeholder="Search for a question"
              onChange={handleSearchChange1}
              onFocus={handleInputFocus1}
              className="w-full lg:w-[320px] sm:shadow-sm py-2 pl-12 placeholder:text-base line-clamp-1 placeholder:text-gray-400 placeholder:font-normal pr-12 text-gray-500 font-normal border text-sm border-gray-200 rounded-sm outline-none bg-white focus:bg-white focus:border-gray-600"
              style={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            />
            {searchQuery && (
              <div
                className="absolute top-3 right-3 my-auto cursor-pointer"
                onClick={() => setSearchQuery("")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
            {!searchQuery && !showDropdown1 && (
              <div
                className="absolute top-3 right-3 my-auto cursor-pointer"
                onClick={handleToggleDropdown1}
              >
                <ChevronDownIcon className="h-4 w-4 ml-1 text-gray-400" />
              </div>
            )}
            {showDropdown1 && !searchQuery && (
              <div
                className="absolute top-3 right-3 my-auto cursor-pointer"
                onClick={handleToggleDropdown1}
              >
                <ChevronUpIcon className="h-4 w-4 ml-1 text-gray-400" />
              </div>
            )}
            {showDropdown1 && (
              <div
                ref={dropdownRef1}
                className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-b-md shadow-lg"
              >
                {searchQuery && (
                  <ul>
                    <li className="px-4 py-0 mt-2 text-xs text-primary uppercase font-semibold">
                      Search Suggestions
                    </li>
                    {filteredSuggestions.length !== 0 ? (
                      <>
                        {filteredQuestion.length > 0 && (
                          <>
                            {filteredQuestion.map((suggestion, index) => (
                              <li
                                key={index}
                                className="px-4 py-2 hover:bg-secondary text-sm flex items-center shrink-0 cursor-pointer"
                                onClick={() =>
                                  handleSuggestionClick1(suggestion)
                                }
                              >
                                <Search className="h-4 w-4 text-gray-400 mr-1" />
                                <span className="line-clamp-1">
                                  {suggestion}
                                </span>
                              </li>
                            ))}
                          </>
                        )}
                      </>
                    ) : (
                      <p className="px-4 py-2 text-sm text-gray-500">
                        No results found
                      </p>
                    )}
                  </ul>
                )}
                {!searchQuery && (
                  <div>
                    <ul>
                      <li className="px-4 py-0 mt-2 text-xs text-primary uppercase font-semibold">
                        Search History
                      </li>
                    </ul>
                    {searchHistory.length > 0 ? (
                      <>
                        {filteredQuestionsFromHistory.length > 0 && (
                          <ul>
                            {filteredQuestionsFromHistory.map(
                              (suggestion, index) => (
                                <li
                                  key={index}
                                  className="px-4 py-2 hover:bg-secondary text-sm text-gray-500 flex items-center shrink-0 cursor-pointer"
                                  onClick={() =>
                                    handleSuggestionClick1(suggestion)
                                  }
                                >
                                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                                  <span className="line-clamp-1">
                                    {suggestion}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        )}
                      </>
                    ) : (
                      <p className="px-4 py-2 text-sm text-gray-500">
                        No history found
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl relative">
        {QuestionsForCurrentPage.length !== 0 ? (
          <div className="mx-auto grid grid-cols-1 gap-x-3 lg:gap-x-4 gap-y-4 pt-1 sm:mt-1 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            {QuestionsForCurrentPage.flatMap((assessment) => (
              <div
                key={assessment.id}
                className="flex flex-col border border-gray-200 text-gray-700 tracking-wide rounded-sm w-full items-start"
              >
                <div className="flex items-center justify-between gap-x-4 px-3 py-2 rounded-t-sm bg-primary w-full text-primary-foreground text-lg">
                  <div className="text-lg line-clamp-1 capitalize font-bold">
                    {assessment.category}
                  </div>
                  <div>
                    <Award className="h-5 w-5" />
                  </div>
                </div>

                {assessment.scenarioExplanation && (
                  <div className="px-3 mt-1">
                    <h2 className="flex-wrap text-base font-medium">
                      {assessment.scenarioExplanation}
                    </h2>
                  </div>
                )}
                {assessment.scenario && (
                  <div className="px-3 mt-0.5 w-full italic text-base line-clamp-3">
                    <QuillPreview htmlContent={assessment.scenario as string} />
                  </div>
                )}

                {assessment.question && (
                  <div className="px-3 mt-3">
                    <h2 className="flex-wrap text-base font-medium">
                      <span className="font-bold">Question: </span>
                      {assessment.question}
                    </h2>
                  </div>
                )}

                {assessment.answer && (
                  <div className="px-3 mt-2">
                    <h2 className="flex-wrap text-base font-normal">
                      <span className="font-bold text-base">Answer: </span>
                      {assessment.answer}
                    </h2>
                  </div>
                )}

                <div className="flex flex-col justify-start items-start w-full">
                  <div className="px-3 mb-1 w-full items-center font-medium flex flex-row justify-between gap-x-3">
                    <h3 className="text-base">
                      <span className='font-bold'>Published: </span> {format(assessment.createdAt, "PPP")}
                    </h3>
                    <div>
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        {currentlyDeletingID === assessment.id && (
                          <DeleteQuestionAlertModal
                            onClose={deleteClose}
                            onConfirm={() => deleteConfirm(assessment.id)}
                            isOpen={deleteOpen}
                            loading={deleteLoading}
                          />
                        )}
                        <div>
                          <Menu.Button
                            disabled={
                              currentlyDeletingID === assessment.id &&
                              deleteLoading
                            }
                            className="inline-flex justify-center items-center gap-x-1.5 rounded-md px-1.5 py-2 text-sm font-semibold text-gray-900 hover:bg-secondary"
                          >
                            {currentlyDeletingID === assessment.id &&
                            deleteLoading ? (
                              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
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
                          <Menu.Items className="absolute divide-y divide-gray-100 bottom-full z-10 mb-1 w-48 origin-bottom-left rounded-sm bg-white shadow-top-md border border-gray-300 focus:outline-none right-0">
                            <div className="bg-slate-200 rounded-tl-sm rounded-tr-sm">
                              <h2 className="px-4 font-medium text-base text-gray-600 py-2">
                                Assessment Options
                              </h2>
                            </div>
                            <div>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    href={`/control/assessments/${assessment.bannerID}/settings/${assessment.id}?origin=control/assessments/${assessment.bannerID}`}
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "px-4 py-2.5 flex items-center cursor-pointer text-sm"
                                    )}
                                  >
                                    <Edit className="h-4 w-4 mr-1.5 shrink-0 text-gray-500" />
                                    Edit Question
                                  </Link>
                                )}
                              </Menu.Item>
                            </div>
                            <div>
                              <Menu.Item>
                                {({ active }) => (
                                  <span
                                    onClick={() => toggleDelete(assessment.id)}
                                    className={classNames(
                                      active
                                        ? "text-secondary-foreground bg-secondary"
                                        : "text-destructive-foreground",
                                      "flex items-center cursor-pointer font-medium hover:text-destructive-foreground hover:bg-destructive px-4 py-2.5 text-sm"
                                    )}
                                  >
                                    <Trash className="h-4 w-4 mr-1.5 shrink-0" />
                                    Delete Question
                                  </span>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <NoAssessments />
        )}

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

export default AllAssessmentsInBanner;