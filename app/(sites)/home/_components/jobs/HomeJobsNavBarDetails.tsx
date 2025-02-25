"use client";

import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import ControlledDisclosure from "./ControlledDisclosure";
import {
  ChevronDownIcon,
  X as XMarkIcon,
  ChevronUpIcon,
  Clock,
  Search,
  SlidersHorizontalIcon,
  ArrowUpDown,
} from "lucide-react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { cn } from "@/lib/utils";
import { Job} from "@prisma/client";
import {
  academics,
  categories,
  counties,
  experienceRanges,
  job_types,
  payments,
  platforms,
} from "../data/create-job/CreateJobData";
import React from "react";
import NoSearchResult from "./NoSearchResults";
import MaxWidthWrapper1 from "@/components/MaxWidthWrapper1";
import JobDetails from "./JobDetails";
import NoHomeDetailJob from "./NoHomeDetailJob";
import JobCard2 from "./JobCard2";

const useScreenSize = () => {
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth > 768;
      if (isLarge !== isLargeScreen) {
        setIsLargeScreen(isLarge);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isLargeScreen]);

  return isLargeScreen;
};

const useScreenSize2 = () => {
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(true);

  useEffect(() => {
    const checkInitialScreenSize = () => {
      const isSmall = window.innerWidth <= 768;
      setIsSmallScreen(isSmall);
    };
    checkInitialScreenSize();
    const handleResize = () => {
      const isSmall = window.innerWidth <= 768;
      if (isSmall !== isSmallScreen) {
        setIsSmallScreen(isSmall);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isSmallScreen]);

  return isSmallScreen;
};

const pageSize = 20;
const sortByOptions = [
  {label: "Rank: Top to Bottom", value: "Rank: Top to Bottom"},
  { label: "Posted: New to Old", value: "createdAt_desc" },
  { label: "Posted: Old to New", value: "createdAt_asc" },
  { label: "Deadline: Later to Sooner", value: "deadline_desc" },
  { label: "Deadline: Sooner to Later", value: "deadline_asc" },
];

interface JobItems {
  id: string,
  job_title: string,
  personal_skills: string[],
  category: string | null,
  job_type: string | null,
  deadline: Date | null,
  county: string | null,
  possible_pay: string | null,
  academic: string | null,
  ownPlatformMethod: string | null,
  experience: string | null,
  companyLogo: string | null,
  companyId: string,
  company_name: string,
  rankTop: boolean,
  createdAt: Date,
}

interface PopularJob {
  id: string,
  job_title: string,
  company_name: string,
  companyLogo: string | null,
  createdAt: Date,
}
interface HomeJobsNavBarDetailsProps {
  jobs: JobItems[];
  viewID: string;
  popular: PopularJob[];
  job: Job;
  similarJobs: PopularJob[];
}

const HomeJobsNavBarDetails = ({
  jobs,
  viewID,
  popular,
  job,
  similarJobs,
}: HomeJobsNavBarDetailsProps) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isAnyCategorySelected, setIsAnyCategorySelected] = useState(false);

  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [isAnyJobTypeSelected, setIsAnyJobTypeSelected] = useState(false);

  const [selectedCounties, setSelectedCounties] = useState<string[]>([]);
  const [isAnyCountySelected, setIsAnyCountySelected] = useState(false);

  const [selectedRemunerations, setSelectedRemunerations] = useState<string[]>(
    []
  );
  const [isAnyRemunerationSelected, setIsAnyRemunerationSelected] =
    useState(false);

  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [isAnyExperienceSelected, setIsAnyExperienceSelected] = useState(false);

  const [selectedAcademics, setSelectedAcademics] = useState<string[]>([]);
  const [isAnyAcademicSelected, setIsAnyAcademicSelected] = useState(false);

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isAnyPlatformSelected, setIsAnyPlatformSelected] = useState(false);
  const [sortBy, setSortBy] = useState(sortByOptions[0].value);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showDropdown1, setShowDropdown1] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownRef1 = useRef<HTMLDivElement>(null);

  const [isExperienceOpen, setIsExperienceOpen] = useState<boolean>(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState<boolean>(false);
  const [isCountiesOpen, setIsCountiesOpen] = useState<boolean>(false);
  const [isJobTypesOpen, setIsJobTypesOpen] = useState<boolean>(false);
  const [isRemunerationOpen, setIsRemunerationOpen] = useState<boolean>(false);
  const [isAcademicsOpen, setIsAcademicsOpen] = useState<boolean>(false);
  const isLargeScreen = useScreenSize();
  const isSmallScreen = useScreenSize2();

  useEffect(() => {
    if (isLargeScreen) {
      setIsExperienceOpen(false);
      setIsCategoriesOpen(false);
      setIsCountiesOpen(false);
      setIsJobTypesOpen(false);
      setIsRemunerationOpen(false);
      setIsAcademicsOpen(false);
    }
  }, [isLargeScreen]);

  useEffect(() => {
    if (isSmallScreen) {
      setIsExperienceOpen(false);
      setIsCategoriesOpen(false);
      setIsCountiesOpen(false);
      setIsJobTypesOpen(false);
      setIsRemunerationOpen(false);
      setIsAcademicsOpen(false);
    }
  }, [isSmallScreen]);

  const toggleAcademicsPanel = () => {
    setIsAcademicsOpen((prev) => !prev);
    setIsCategoriesOpen(false);
    setIsExperienceOpen(false);
    setIsJobTypesOpen(false);
    setIsRemunerationOpen(false);
    setIsCountiesOpen(false);
  };
  const toggleExperiencePanel = () => {
    setIsExperienceOpen((prev) => !prev);
    setIsCategoriesOpen(false);
    setIsAcademicsOpen(false);
    setIsJobTypesOpen(false);
    setIsRemunerationOpen(false);
    setIsCountiesOpen(false);
  };

  const toggleCategoriesPanel = () => {
    setIsCategoriesOpen((prev) => !prev);
    setIsExperienceOpen(false);
    setIsAcademicsOpen(false);
    setIsJobTypesOpen(false);
    setIsRemunerationOpen(false);
    setIsCountiesOpen(false);
  };

  const toggleCountiesPanel = () => {
    setIsCountiesOpen((prev) => !prev);
    setIsExperienceOpen(false);
    setIsAcademicsOpen(false);
    setIsJobTypesOpen(false);
    setIsRemunerationOpen(false);
    setIsCategoriesOpen(false);
  };

  const toggleJobTypesPanel = () => {
    setIsJobTypesOpen((prev) => !prev);
    setIsExperienceOpen(false);
    setIsAcademicsOpen(false);
    setIsCountiesOpen(false);
    setIsRemunerationOpen(false);
    setIsCategoriesOpen(false);
  };

  const toggleRemunerationPanel = () => {
    setIsRemunerationOpen((prev) => !prev);
    setIsExperienceOpen(false);
    setIsAcademicsOpen(false);
    setIsCountiesOpen(false);
    setIsJobTypesOpen(false);
    setIsCategoriesOpen(false);
  };

  const filteredSuggestions = useMemo(() => {
    const uniqueSuggestions = new Set<string>();
    jobs.forEach((job) => {
      uniqueSuggestions.add(job.job_title);
      job.personal_skills.forEach((skill) => uniqueSuggestions.add(skill));
    });
    return Array.from(uniqueSuggestions)
      .filter((suggestion) =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 10);
  }, [jobs, searchQuery]);

  useEffect(() => {
    const storedSearchHistory = localStorage.getItem(`searchHistory${viewID}`);
    if (storedSearchHistory) {
      setSearchHistory(JSON.parse(storedSearchHistory));
    }
  }, [viewID]);

  useEffect(() => {
    localStorage.setItem(
      `searchHistory${viewID}`,
      JSON.stringify(searchHistory)
    );
  }, [searchHistory, viewID]);

  const handleSuggestionClick1 = (suggestion: string) => {
    const matchedJob = jobs.find(
      (job) =>
        job.job_title.toLowerCase() === suggestion.toLowerCase() ||
        (job.personal_skills &&
          job.personal_skills.some(
            (skill) => skill.toLowerCase() === suggestion.toLowerCase()
          ))
    );

    if (matchedJob) {
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

  const handleCheckboxChange = (value: string) => {
    let newSelectedCategories: string[];
    if (selectedCategories.includes(value)) {
      newSelectedCategories = selectedCategories.filter(
        (category) => category !== value
      );
    } else {
      newSelectedCategories = [...selectedCategories, value];
    }
    setSelectedCategories(newSelectedCategories);
    setIsAnyCategorySelected(newSelectedCategories.length > 0);
  };
  const handleCheckboxChange2 = (
    value: string,
    closeDisclosure: () => void
  ) => {
    let newSelectedCategories: string[];
    if (selectedCategories.includes(value)) {
      newSelectedCategories = selectedCategories.filter(
        (category) => category !== value
      );
    } else {
      newSelectedCategories = [...selectedCategories, value];
    }
    setSelectedCategories(newSelectedCategories);
    setIsAnyCategorySelected(newSelectedCategories.length > 0);

    closeDisclosure();
  };

  const handleJobTypeChange = (value: string) => {
    let newSelectedJobTypes: string[];
    if (selectedJobTypes.includes(value)) {
      newSelectedJobTypes = selectedJobTypes.filter(
        (jobType) => jobType !== value
      );
    } else {
      newSelectedJobTypes = [...selectedJobTypes, value];
    }
    setSelectedJobTypes(newSelectedJobTypes);
    setIsAnyJobTypeSelected(newSelectedJobTypes.length > 0);
  };

  const handleJobTypeChange2 = (value: string, closeDisclosure: () => void) => {
    let newSelectedJobTypes: string[];
    if (selectedJobTypes.includes(value)) {
      newSelectedJobTypes = selectedJobTypes.filter(
        (jobType) => jobType !== value
      );
    } else {
      newSelectedJobTypes = [...selectedJobTypes, value];
    }
    setSelectedJobTypes(newSelectedJobTypes);
    setIsAnyJobTypeSelected(newSelectedJobTypes.length > 0);

    closeDisclosure();
  };

  const handleCountyChange = (value: string) => {
    let newSelectedCounties: string[];
    if (selectedCounties.includes(value)) {
      newSelectedCounties = selectedCounties.filter(
        (county) => county !== value
      );
    } else {
      newSelectedCounties = [...selectedCounties, value];
    }
    setSelectedCounties(newSelectedCounties);
    setIsAnyCountySelected(newSelectedCounties.length > 0);
  };
  const handleCountyChange2 = (value: string, closeDisclosure: () => void) => {
    let newSelectedCounties: string[];
    if (selectedCounties.includes(value)) {
      newSelectedCounties = selectedCounties.filter(
        (county) => county !== value
      );
    } else {
      newSelectedCounties = [...selectedCounties, value];
    }
    setSelectedCounties(newSelectedCounties);
    setIsAnyCountySelected(newSelectedCounties.length > 0);

    closeDisclosure();
  };

  const handleExperienceChange = (value: string) => {
    let newSelectedExperience: string[];
    if (selectedExperience.includes(value)) {
      newSelectedExperience = selectedExperience.filter(
        (experience) => experience !== value
      );
    } else {
      newSelectedExperience = [...selectedExperience, value];
    }
    setSelectedExperience(newSelectedExperience);
    setIsAnyExperienceSelected(newSelectedExperience.length > 0);
  };
  const handleExperienceChange2 = (
    value: string,
    closeDisclosure: () => void
  ) => {
    let newSelectedExperience: string[];
    if (selectedExperience.includes(value)) {
      newSelectedExperience = selectedExperience.filter(
        (experience) => experience !== value
      );
    } else {
      newSelectedExperience = [...selectedExperience, value];
    }
    setSelectedExperience(newSelectedExperience);
    setIsAnyExperienceSelected(newSelectedExperience.length > 0);

    closeDisclosure();
  };

  const handleRemunerationChange = (value: string) => {
    let newSelectedRemunerations: string[];
    if (selectedRemunerations.includes(value)) {
      newSelectedRemunerations = selectedRemunerations.filter(
        (remuneration) => remuneration !== value
      );
    } else {
      newSelectedRemunerations = [...selectedRemunerations, value];
    }
    setSelectedRemunerations(newSelectedRemunerations);
    setIsAnyRemunerationSelected(newSelectedRemunerations.length > 0);
  };
  const handleRemunerationChange2 = (
    value: string,
    closeDisclosure: () => void
  ) => {
    let newSelectedRemunerations: string[];
    if (selectedRemunerations.includes(value)) {
      newSelectedRemunerations = selectedRemunerations.filter(
        (remuneration) => remuneration !== value
      );
    } else {
      newSelectedRemunerations = [...selectedRemunerations, value];
    }
    setSelectedRemunerations(newSelectedRemunerations);
    setIsAnyRemunerationSelected(newSelectedRemunerations.length > 0);

    closeDisclosure();
  };

  const handleAcademicChange = (value: string) => {
    let newSelectedAcademics: string[];
    if (selectedAcademics.includes(value)) {
      newSelectedAcademics = selectedAcademics.filter(
        (academic) => academic !== value
      );
    } else {
      newSelectedAcademics = [...selectedAcademics, value];
    }
    setSelectedAcademics(newSelectedAcademics);
    setIsAnyAcademicSelected(newSelectedAcademics.length > 0);
  };
  const handleAcademicChange2 = (
    value: string,
    closeDisclosure: () => void
  ) => {
    let newSelectedAcademics: string[];
    if (selectedAcademics.includes(value)) {
      newSelectedAcademics = selectedAcademics.filter(
        (academic) => academic !== value
      );
    } else {
      newSelectedAcademics = [...selectedAcademics, value];
    }
    setSelectedAcademics(newSelectedAcademics);
    setIsAnyAcademicSelected(newSelectedAcademics.length > 0);

    closeDisclosure();
  };

  const handlePlatformChange = (value: string) => {
    let newSelectedPlatforms: string[];
    if (selectedPlatforms.includes(value)) {
      newSelectedPlatforms = selectedPlatforms.filter(
        (platform) => platform !== value
      );
    } else {
      newSelectedPlatforms = [...selectedPlatforms, value];
    }
    setSelectedPlatforms(newSelectedPlatforms);
    setIsAnyPlatformSelected(newSelectedPlatforms.length > 0);
  };

  const handlePlatformChange2 = (
    value: string,
    closeDisclosure: () => void
  ) => {
    let newSelectedPlatforms: string[];
    if (selectedPlatforms.includes(value)) {
      newSelectedPlatforms = selectedPlatforms.filter(
        (platform) => platform !== value
      );
    } else {
      newSelectedPlatforms = [...selectedPlatforms, value];
    }
    setSelectedPlatforms(newSelectedPlatforms);
    setIsAnyPlatformSelected(newSelectedPlatforms.length > 0);

    closeDisclosure();
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const sortedAndFilteredJobs = jobs
    .filter((job) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        job.category === null ||
        selectedCategories.includes(job.category);

      const jobTypeMatch =
        selectedJobTypes.length === 0 ||
        job.job_type === null ||
        selectedJobTypes.includes(job.job_type);

      const countyMatch =
        selectedCounties.length === 0 ||
        job.county === null ||
        selectedCounties.includes(job.county);

      const remunerationMatch =
        selectedRemunerations.length === 0 ||
        job.possible_pay === null ||
        selectedRemunerations.includes(job.possible_pay);

      const academicMatch =
        selectedAcademics.length === 0 ||
        job.academic === null ||
        selectedAcademics.includes(job.academic);

      const platformMatch =
        selectedPlatforms.length === 0 ||
        job.ownPlatformMethod === null ||
        selectedPlatforms.includes(job.ownPlatformMethod);

      const experienceMatch =
        selectedExperience.length === 0 ||
        selectedExperience.every((experienceRange) => {
          const [minYears, maxYears] = experienceRange
            .split(" - ")
            .map((years) => parseInt(years, 10));
          if (isNaN(maxYears)) {
            return true;
          }
          const jobExperience = parseInt(
            job.experience?.split(" ")[0] ?? "0",
            10
          );
          return (
            isNaN(jobExperience) ||
            (jobExperience >= minYears && jobExperience <= maxYears)
          );
        });

      return (
        categoryMatch &&
        jobTypeMatch &&
        countyMatch &&
        remunerationMatch &&
        academicMatch &&
        platformMatch &&
        experienceMatch
      );
    })
    .filter((job) => {
      if (searchQuery) {
        const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const searchRegex = new RegExp(escapedQuery.toLowerCase(), "i");
        const hasMatchingTitle = searchRegex.test(job.job_title.toLowerCase());
        const hasMatchingSkill = job.personal_skills.some((skill: string) =>
          searchRegex.test(skill.toLowerCase())
        );
        return hasMatchingTitle || hasMatchingSkill;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "Rank: Top to Bottom") {
        if (a.rankTop === b.rankTop) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return a.rankTop ? -1 : 1;
      } else if (sortBy === "createdAt_asc") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else if (sortBy === "createdAt_desc") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sortBy === "deadline_asc") {
        return (
          (a.deadline ? new Date(a.deadline).getTime() : Infinity) -
          (b.deadline ? new Date(b.deadline).getTime() : Infinity)
        );
      } else if (sortBy === "deadline_desc") {
        return (
          (b.deadline ? new Date(b.deadline).getTime() : Infinity) -
          (a.deadline ? new Date(a.deadline).getTime() : Infinity)
        );
      }
      return 0;
    });

  const jobsForCurrentPage = sortedAndFilteredJobs.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedAndFilteredJobs.length / pageSize);

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };

  const filteredJobTitles = filteredSuggestions.filter((suggestion) =>
    jobs.some((job) =>
      job.job_title.toLowerCase().includes(suggestion.toLowerCase())
    )
  );

  const filteredSkills = filteredSuggestions.filter(
    (suggestion) =>
      !jobs.some((job) =>
        job.job_title.toLowerCase().includes(suggestion.toLowerCase())
      )
  );

  const filteredJobTitlesFromHistory = searchHistory
    .filter((historyItem) =>
      jobs.some((job) =>
        job.job_title.toLowerCase().includes(historyItem.toLowerCase())
      )
    )
    .reverse();

  const filteredSkillsFromHistory = searchHistory
    .filter((historyItem) =>
      jobs.some(
        (job) =>
          job.personal_skills &&
          job.personal_skills.some(
            (skill) => skill.toLowerCase() === historyItem.toLowerCase()
          )
      )
    )
    .reverse();
  return (
    <>
      <div className="md:border-b border-gray-200 md:pb-6">
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-40" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full px-3 w-full pt-[30px] max-w-xs flex-col overflow-y-auto bg-white py-4 pb-4 shadow-lg">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-700">
                      Job Filters
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-sm bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <form className="mt-4 border-t border-gray-200 px-4 pt-2">
                    {!isAcademicsOpen &&
                      !isExperienceOpen &&
                      !isJobTypesOpen &&
                      isSmallScreen &&
                      !isCountiesOpen &&
                      !isRemunerationOpen &&
                      !isCategoriesOpen && (
                        <ul
                          role="list"
                          className="space-y-4 border-b pb-3 border-gray-200 text-gray-600"
                        >
                          <h2 className="font-medium">Application Platform</h2>
                          <div className="space-y-2 font-normal text-sm">
                            {platforms.map((platform, idx) => (
                              <div key={idx} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`platform-${idx}`}
                                  value={platform.value}
                                  checked={selectedPlatforms.includes(
                                    platform.value
                                  )}
                                  onChange={() =>
                                    handlePlatformChange(platform.value)
                                  }
                                />
                                <label
                                  htmlFor={`platform-${idx}`}
                                  className="ml-2"
                                >
                                  {platform.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </ul>
                      )}

                    {!isAcademicsOpen &&
                      !isExperienceOpen &&
                      !isJobTypesOpen &&
                      isSmallScreen &&
                      !isCountiesOpen &&
                      !isRemunerationOpen && (
                        <Disclosure
                          as="div"
                          className={cn(
                            "border-b border-gray-200 py-5",
                            isCategoriesOpen && "-mt-5 border-none"
                          )}
                        >
                          {({ open }) => (
                            <>
                              <h3 className="-my-2 flow-root">
                                <Disclosure.Button
                                  className="flex w-full items-center justify-between bg-white py-2.5 text-gray-400 hover:text-gray-500"
                                  onClick={toggleCategoriesPanel}
                                >
                                  <span
                                    className={cn(
                                      "font-medium pb-1 text-gray-600 text-base",
                                      isCategoriesOpen && "lg:text-lg"
                                    )}
                                  >
                                    Categories
                                  </span>
                                  <span className="ml-6 flex items-center">
                                    {open ? (
                                      <ChevronUpIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <ChevronDownIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </span>
                                </Disclosure.Button>
                              </h3>
                              <Disclosure.Panel className="pt-2 px-1.5 pb-1.5 overflow-y-auto max-h-[calc(100vh-13rem)] text-sm">
                                <div className="space-y-4">
                                  {open &&
                                    categories
                                      .sort((a, b) =>
                                        a.label.localeCompare(b.label)
                                      )
                                      .map((category, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-center"
                                        >
                                          <input
                                            type="checkbox"
                                            id={`category-${idx}`}
                                            value={category.value}
                                            checked={selectedCategories.includes(
                                              category.value
                                            )}
                                            onChange={() =>
                                              handleCheckboxChange(
                                                category.value
                                              )
                                            }
                                          />
                                          <label
                                            htmlFor={`category-${idx}`}
                                            className="ml-2"
                                          >
                                            {category.label}
                                          </label>
                                        </div>
                                      ))}
                                </div>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      )}

                    {!isAcademicsOpen &&
                      !isExperienceOpen &&
                      isSmallScreen &&
                      !isCategoriesOpen &&
                      !isCountiesOpen &&
                      !isRemunerationOpen && (
                        <Disclosure
                          as="div"
                          className={cn(
                            "border-b border-gray-200 py-5",
                            isJobTypesOpen && "-mt-5 border-none"
                          )}
                        >
                          {({ open }) => (
                            <>
                              <h3 className="-my-2 flow-root">
                                <Disclosure.Button
                                  onClick={toggleJobTypesPanel}
                                  className="flex w-full items-center justify-between bg-white py-2.5 text-gray-400 hover:text-gray-500"
                                >
                                  <span
                                    className={cn(
                                      "font-medium pb-1 text-gray-600 text-base",
                                      isJobTypesOpen && "lg:text-lg"
                                    )}
                                  >
                                    Job Type
                                  </span>
                                  <span className="ml-6 flex items-center">
                                    {open ? (
                                      <ChevronUpIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <ChevronDownIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </span>
                                </Disclosure.Button>
                              </h3>
                              <Disclosure.Panel className="pt-2 px-1.5 pb-1.5 text-sm">
                                <div className="space-y-4">
                                  {open &&
                                    job_types.map((jobType, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center"
                                      >
                                        <input
                                          type="checkbox"
                                          id={`jobType-${idx}`}
                                          value={jobType.value}
                                          checked={selectedJobTypes.includes(
                                            jobType.value
                                          )}
                                          onChange={() =>
                                            handleJobTypeChange(jobType.value)
                                          }
                                        />
                                        <label
                                          htmlFor={`jobType-${idx}`}
                                          className="ml-2"
                                        >
                                          {jobType.label}
                                        </label>
                                      </div>
                                    ))}
                                </div>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      )}

                    {!isAcademicsOpen &&
                      !isExperienceOpen &&
                      isSmallScreen &&
                      !isCategoriesOpen &&
                      !isJobTypesOpen &&
                      !isRemunerationOpen && (
                        <Disclosure
                          as="div"
                          className={cn(
                            "border-b border-gray-200 py-5",
                            isCountiesOpen && "-mt-5 border-none"
                          )}
                        >
                          {({ open }) => (
                            <>
                              <h3 className="-my-2 flow-root">
                                <Disclosure.Button
                                  onClick={toggleCountiesPanel}
                                  className="flex w-full items-center justify-between bg-white py-2.5 text-gray-400 hover:text-gray-500"
                                >
                                  <span
                                    className={cn(
                                      "font-medium pb-1 text-gray-600 text-base",
                                      isCountiesOpen && "lg:text-lg"
                                    )}
                                  >
                                    Counties
                                  </span>
                                  <span className="ml-6 flex items-center">
                                    {open ? (
                                      <ChevronUpIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <ChevronDownIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </span>
                                </Disclosure.Button>
                              </h3>
                              <Disclosure.Panel className="pt-2 px-1.5 pb-1.5 overflow-y-auto max-h-[calc(100vh-13rem)] text-sm">
                                <div className="space-y-4">
                                  {open &&
                                    counties
                                      .sort((a, b) =>
                                        a.label.localeCompare(b.label)
                                      )
                                      .map((county, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-center"
                                        >
                                          <input
                                            type="checkbox"
                                            id={`county-${idx}`}
                                            value={county.value}
                                            checked={selectedCounties.includes(
                                              county.value
                                            )}
                                            onChange={() =>
                                              handleCountyChange(county.value)
                                            }
                                          />
                                          <label
                                            htmlFor={`county-${idx}`}
                                            className="ml-2"
                                          >
                                            {county.label}
                                          </label>
                                        </div>
                                      ))}
                                </div>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      )}

                    {!isAcademicsOpen &&
                      !isExperienceOpen &&
                      isSmallScreen &&
                      !isCategoriesOpen &&
                      !isJobTypesOpen &&
                      !isCountiesOpen && (
                        <Disclosure
                          as="div"
                          className={cn(
                            "border-b border-gray-200 py-5",
                            isRemunerationOpen && "-mt-5 border-none"
                          )}
                        >
                          {({ open }) => (
                            <>
                              <h3 className="-my-2 flow-root">
                                <Disclosure.Button
                                  onClick={toggleRemunerationPanel}
                                  className="flex w-full items-center justify-between bg-white py-2.5 text-gray-400 hover:text-gray-500"
                                >
                                  <span
                                    className={cn(
                                      "font-medium pb-1 text-gray-600 text-base",
                                      isRemunerationOpen && "lg:text-lg"
                                    )}
                                  >
                                    Remunerations
                                  </span>
                                  <span className="ml-6 flex items-center">
                                    {open ? (
                                      <ChevronUpIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <ChevronDownIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </span>
                                </Disclosure.Button>
                              </h3>
                              <Disclosure.Panel className="pt-2 px-1.5 pb-1.5 overflow-y-auto max-h-[calc(100vh-13rem)] text-sm">
                                <div className="space-y-4">
                                  {open &&
                                    payments.map((remuneration, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center"
                                      >
                                        <input
                                          type="checkbox"
                                          id={`remuneration-${idx}`}
                                          value={remuneration.value}
                                          checked={selectedRemunerations.includes(
                                            remuneration.value
                                          )}
                                          onChange={() =>
                                            handleRemunerationChange(
                                              remuneration.value
                                            )
                                          }
                                        />
                                        <label
                                          htmlFor={`remuneration-${idx}`}
                                          className="ml-2"
                                        >
                                          {remuneration.label}
                                        </label>
                                      </div>
                                    ))}
                                </div>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      )}

                    {!isCategoriesOpen &&
                      !isExperienceOpen &&
                      isSmallScreen &&
                      !isRemunerationOpen &&
                      !isJobTypesOpen &&
                      !isCountiesOpen && (
                        <Disclosure
                          as="div"
                          className={cn(
                            "border-b border-gray-200 py-5",
                            isAcademicsOpen && "-mt-5 border-none"
                          )}
                        >
                          {({ open }) => (
                            <>
                              <h3 className="-my-2 flow-root">
                                <Disclosure.Button
                                  onClick={toggleAcademicsPanel}
                                  className="flex w-full items-center justify-between bg-white py-2.5 text-gray-400 hover:text-gray-500"
                                >
                                  <span
                                    className={cn(
                                      "font-medium pb-1 text-gray-600 text-base",
                                      isAcademicsOpen && "lg:text-lg"
                                    )}
                                  >
                                    Academics
                                  </span>
                                  <span className="ml-6 flex items-center">
                                    {open ? (
                                      <ChevronUpIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <ChevronDownIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </span>
                                </Disclosure.Button>
                              </h3>
                              <Disclosure.Panel className="pt-2 px-1.5 pb-1.5 overflow-y-auto max-h-[calc(100vh-13rem)] text-sm">
                                <div className="space-y-4">
                                  {open &&
                                    academics.map((academic, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center"
                                      >
                                        <input
                                          type="checkbox"
                                          id={`academic-${idx}`}
                                          value={academic.value}
                                          checked={selectedAcademics.includes(
                                            academic.value
                                          )}
                                          onChange={() =>
                                            handleAcademicChange(academic.value)
                                          }
                                        />
                                        <label
                                          htmlFor={`academic-${idx}`}
                                          className="ml-2"
                                        >
                                          {academic.label}
                                        </label>
                                      </div>
                                    ))}
                                </div>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      )}

                    {!isCategoriesOpen &&
                      !isAcademicsOpen &&
                      isSmallScreen &&
                      !isRemunerationOpen &&
                      !isJobTypesOpen &&
                      !isCountiesOpen && (
                        <Disclosure
                          as="div"
                          className={cn("py-5", isExperienceOpen && "-mt-5")}
                        >
                          {({ open }) => (
                            <>
                              <h3 className="-my-2 flow-root">
                                <Disclosure.Button
                                  className="flex w-full items-center justify-between bg-white py-2.5 text-gray-400 hover:text-gray-500"
                                  onClick={toggleExperiencePanel}
                                >
                                  <span
                                    className={cn(
                                      "font-medium pb-1 text-gray-600 text-base",
                                      isExperienceOpen && "lg:text-lg"
                                    )}
                                  >
                                    Experience
                                  </span>
                                  <span className="ml-6 flex items-center">
                                    {open ? (
                                      <ChevronUpIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <ChevronDownIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </span>
                                </Disclosure.Button>
                              </h3>
                              <Disclosure.Panel className="pt-2 px-1.5 pb-1.5 overflow-y-auto max-h-[calc(100vh-13rem)] text-sm">
                                <div className="space-y-4">
                                  {open &&
                                    experienceRanges.map((range, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center"
                                      >
                                        <input
                                          type="checkbox"
                                          id={`experience-${idx}`}
                                          value={range.value}
                                          checked={selectedExperience.includes(
                                            range.value
                                          )}
                                          onChange={() =>
                                            handleExperienceChange(range.value)
                                          }
                                        />
                                        <label
                                          htmlFor={`experience-${idx}`}
                                          className="ml-2"
                                        >
                                          {range.label}
                                        </label>
                                      </div>
                                    ))}
                                </div>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      )}
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
        <MaxWidthWrapper1>
          {!isSmallScreen && (
            <div className="flex flex-row items-center w-full justify-center gap-x-2 sm:gap-x-3 mb-1.5 md:mb-3">
              <div className="relative w-full max-w-3xl">
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
                  placeholder={
                    isSmallScreen
                      ? "Search by job title or skill"
                      : "Search for a job by job title or skill"
                  }
                  onChange={handleSearchChange1}
                  onFocus={handleInputFocus1}
                  className="w-full py-2 md:py-3.5 h-10 md:h-full md:shadow-md bg-white pl-10 sm:pl-12 placeholder:text-base line-clamp-1 placeholder:text-gray-500 placeholder:font-normal pr-4 text-gray-500 font-normal border text-base border-gray-300 rounded-sm outline-none focus:bg-white focus:border-indigo-600"
                />
                {!searchQuery && !showDropdown1 && (
                  <div
                    className="absolute top-3 md:top-4 right-3 my-auto cursor-pointer"
                    onClick={handleToggleDropdown1}
                  >
                    <ChevronDownIcon className="h-4 w-4 ml-1 text-gray-400" />
                  </div>
                )}
                {showDropdown1 && !searchQuery && (
                  <div
                    className="absolute top-3 md:top-4 right-3 my-auto cursor-pointer"
                    onClick={handleToggleDropdown1}
                  >
                    <ChevronUpIcon className="h-4 w-4 ml-1 text-gray-400" />
                  </div>
                )}
                {searchQuery && (
                  <div
                    className="absolute top-3 bottom-0 right-3 my-auto cursor-pointer"
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
                {showDropdown1 && (
                  <div
                    ref={dropdownRef1}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 z-10 mt-1 w-full max-w-4xl bg-white border border-gray-200 rounded-b-md shadow-lg"
                  >
                    {searchQuery && (
                      <ul>
                        <li className="px-4 py-0 mt-2 text-xs text-primary uppercase font-semibold">
                          Search Suggestions
                        </li>
                        {filteredSuggestions.length !== 0 ? (
                          <>
                            {filteredJobTitles.length > 0 && (
                              <>
                                <li className="px-4 py-0 mt-2 text-xs text-gray-700 uppercase font-semibold">
                                  Job Titles
                                </li>
                                {filteredJobTitles.map((suggestion, index) => (
                                  <li
                                    key={index}
                                    className="px-4 py-2 hover:bg-secondary text-gray-500 text-sm flex items-center shrink-0 cursor-pointer"
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
                            {filteredSkills.length > 0 && (
                              <>
                                <li className="px-4 py-0 mt-2 text-xs text-gray-700 uppercase font-semibold">
                                  Skills
                                </li>
                                {filteredSkills.map((suggestion, index) => (
                                  <li
                                    key={index}
                                    className="px-4 py-2 hover:bg-secondary text-gray-500 text-sm flex items-center shrink-0 cursor-pointer"
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
                            {filteredJobTitlesFromHistory.length > 0 && (
                              <ul>
                                <li className="px-4 py-0 mt-2 text-xs text-gray-700 uppercase font-semibold">
                                  Job Titles
                                </li>
                                {filteredJobTitlesFromHistory.map(
                                  (suggestion, index) => (
                                    <li
                                      key={index}
                                      className="px-4 py-2 hover:bg-secondary text-sm flex items-center shrink-0 cursor-pointer"
                                      onClick={() =>
                                        handleSuggestionClick1(suggestion)
                                      }
                                    >
                                      <Clock className="h-4 w-4 text-gray-400 shrink-0 mr-1" />
                                      <span className="line-clamp-1">
                                        {suggestion}
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            )}
                            {filteredSkillsFromHistory.length > 0 && (
                              <ul>
                                <li className="px-4 py-0 mt-2 text-xs text-gray-700 uppercase font-semibold">
                                  Skills
                                </li>
                                {filteredSkillsFromHistory.map(
                                  (suggestion, index) => (
                                    <li
                                      key={index}
                                      className="px-4 py-2 hover:bg-secondary text-sm flex items-center shrink-0 cursor-pointer"
                                      onClick={() =>
                                        handleSuggestionClick1(suggestion)
                                      }
                                    >
                                      <Clock className="h-4 w-4 text-gray-400 shrink-0 mr-1" />
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
              <Menu
                as="div"
                className="md:hidden relative inline-block text-left"
              >
                <div>
                  <Menu.Button className="group h-10 inline-flex hover:bg-secondary font-normal p-2 border border-gray-300 hover:rounded-sm rounded-sm justify-center text-sm text-gray-600 hover:text-gray-700">
                    <ArrowUpDown className="h-5 w-5 sm:mr-1 text-gray-400 shrink-0" />{" "}
                    <span className="hidden sm:flex">Sort</span>
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 hidden sm:flex flex-shrink-0 text-gray-500 group-hover:text-gray-700"
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
                  <Menu.Items className="absolute w-48 right-0 z-10 mt-2 origin-top-right rounded-sm bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortByOptions.map((option) => (
                        <Menu.Item key={option.value}>
                          {({ active }) => (
                            <button
                              onClick={() => handleSortChange(option.value)}
                              className={cn(
                                "block w-full text-start px-2.5 py-2 text-sm",
                                sortBy === option.value
                                  ? "font-medium text-gray-700"
                                  : "text-gray-500",
                                active ? "bg-gray-100" : ""
                              )}
                            >
                              {option.label}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="p-2 h-10 md:hidden group rounded-sm border font-normal text-sm text-gray-600 inline-flex items-center shrink-0 border-gray-300 hover:bg-secondary"
              >
                <span className="sr-only">Filters</span>
                <SlidersHorizontalIcon
                  className="h-4 w-4 text-gray-500 shrink-0 sm:mr-1"
                  aria-hidden="true"
                />
                <span className="hidden sm:flex">Filter</span>
                <ChevronDownIcon
                  className="-mr-1 ml-1 hidden sm:flex h-5 w-5 flex-shrink-0 text-gray-500 group-hover:text-gray-700"
                  aria-hidden="true"
                />
              </button>
            </div>
          )}

          <div className="md:flex justify-center hidden">
            <div className="flex flex-row flex-wrap gap-x-2 md:gap-x-4 gap-y-2">
              <div className="relative inline-block text-left">
                <ControlledDisclosure
                  buttonClassName={`group inline-flex hover:bg-zinc-300 ${
                    isAnyPlatformSelected
                      ? "bg-slate-600 text-white"
                      : "bg-zinc-200 text-gray-500"
                  } font-normal p-[9px] border border-gray-200 hover:rounded-sm rounded-sm justify-center text-sm hover:text-gray-600`}
                  buttonContent={(open) => (
                    <>
                      Platform
                      <span className="ml-3 flex items-center">
                        {open ? (
                          <ChevronUpIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        ) : (
                          <ChevronDownIcon
                            className={`h-5 w-5 ${
                              isAnyPlatformSelected
                                ? "text-white"
                                : "text-gray-400"
                            } group-hover:text-gray-700`}
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    </>
                  )}
                  panelClassName="absolute left-1/2 transform -translate-x-1/2 z-10 mt-1 w-48 origin-top divide-y divide-gray-100 rounded-sm bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  {({ closeDisclosure }) => (
                    <>
                      <h2 className="text-gray-700 text-base font-medium py-1 px-4">
                        Application Platform
                      </h2>
                      <div className="py-1">
                        {platforms.map((range, idx) => (
                          <div
                            key={idx}
                            className="flex items-center px-4 py-2 text-sm"
                          >
                            <input
                              type="checkbox"
                              id={`platform-${idx}`}
                              value={range.value}
                              checked={selectedPlatforms.includes(range.value)}
                              onChange={() =>
                                handlePlatformChange2(
                                  range.value,
                                  closeDisclosure
                                )
                              }
                              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            />
                            <label
                              htmlFor={`platform-${idx}`}
                              className="ml-2 text-gray-700"
                            >
                              {range.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </ControlledDisclosure>
              </div>

              <div className="relative inline-block text-left">
                <ControlledDisclosure
                  buttonClassName={`group inline-flex hover:bg-zinc-300 ${
                    isAnyJobTypeSelected
                      ? "bg-slate-600 text-white"
                      : "bg-zinc-200 text-gray-500"
                  } font-normal p-[9px] border border-gray-200 hover:rounded-sm rounded-sm justify-center text-sm hover:text-gray-600`}
                  buttonContent={(open) => (
                    <>
                      Job Type
                      <span className="ml-3 flex items-center">
                        {open ? (
                          <ChevronUpIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        ) : (
                          <ChevronDownIcon
                            className={`h-5 w-5 ${
                              isAnyJobTypeSelected
                                ? "text-white"
                                : "text-gray-400"
                            } group-hover:text-gray-700`}
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    </>
                  )}
                  panelClassName="absolute left-1/2 transform -translate-x-1/2 z-10 mt-1 w-48 origin-top divide-y divide-gray-100 rounded-sm bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  {({ closeDisclosure }) => (
                    <>
                      <h2 className="text-gray-700 text-base font-medium py-1 px-4">
                        Employment Type
                      </h2>
                      <div className="py-1">
                        {job_types.map((range, idx) => (
                          <div
                            key={idx}
                            className="flex items-center px-4 py-2 text-sm"
                          >
                            <input
                              type="checkbox"
                              id={`job_type-${idx}`}
                              value={range.value}
                              checked={selectedJobTypes.includes(range.value)}
                              onChange={() =>
                                handleJobTypeChange2(
                                  range.value,
                                  closeDisclosure
                                )
                              }
                              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            />
                            <label
                              htmlFor={`job_type-${idx}`}
                              className="ml-2 text-gray-700"
                            >
                              {range.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </ControlledDisclosure>
              </div>

              <div className="relative inline-block text-left">
                <ControlledDisclosure
                  buttonClassName={`group inline-flex hover:bg-zinc-300 ${
                    isAnyExperienceSelected
                      ? "bg-slate-600 text-white"
                      : "bg-zinc-200 text-gray-500"
                  } font-normal p-[9px] border border-gray-200 hover:rounded-sm rounded-sm justify-center text-sm hover:text-gray-600`}
                  buttonContent={(open) => (
                    <>
                      Experience
                      <span className="ml-3 flex items-center">
                        {open ? (
                          <ChevronUpIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        ) : (
                          <ChevronDownIcon
                            className={`h-5 w-5 ${
                              isAnyExperienceSelected
                                ? "text-white"
                                : "text-gray-400"
                            } group-hover:text-gray-700`}
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    </>
                  )}
                  panelClassName="absolute left-1/2 transform -translate-x-1/2 z-10 mt-1 w-48 origin-top divide-y divide-gray-100 rounded-sm bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  {({ closeDisclosure }) => (
                    <>
                      <h2 className="text-gray-700 text-base font-medium py-1 px-4">
                        Experience Level
                      </h2>
                      <div className="py-1">
                        {experienceRanges.map((range, idx) => (
                          <div
                            key={idx}
                            className="flex items-center px-4 py-2 text-sm"
                          >
                            <input
                              type="checkbox"
                              id={`experience-${idx}`}
                              value={range.value}
                              checked={selectedExperience.includes(range.value)}
                              onChange={() =>
                                handleExperienceChange2(
                                  range.value,
                                  closeDisclosure
                                )
                              }
                              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            />
                            <label
                              htmlFor={`experience-${idx}`}
                              className="ml-2 text-gray-700"
                            >
                              {range.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </ControlledDisclosure>
              </div>

              <div className="relative inline-block text-left">
                <ControlledDisclosure
                  buttonClassName={`group inline-flex hover:bg-zinc-300 ${
                    isAnyCountySelected
                      ? "bg-slate-600 text-white"
                      : "bg-zinc-200 text-gray-500"
                  } font-normal p-[9px] border border-gray-200 hover:rounded-sm rounded-sm justify-center text-sm hover:text-gray-600`}
                  buttonContent={(open) => (
                    <>
                      County
                      <span className="ml-3 flex items-center">
                        {open ? (
                          <ChevronUpIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        ) : (
                          <ChevronDownIcon
                            className={`h-5 w-5 ${
                              isAnyCountySelected
                                ? "text-white"
                                : "text-gray-400"
                            } group-hover:text-gray-700`}
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    </>
                  )}
                  panelClassName="absolute left-1/2 transform -translate-x-1/2 z-10 mt-1  max-h-[calc(100vh-30vh)] overflow-y-scroll mt-1 w-52 origin-top divide-y divide-gray-100 rounded-sm bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  {({ closeDisclosure }) => (
                    <>
                      <h2 className="text-gray-700 text-base font-medium py-1 px-4">
                        Job Location
                      </h2>
                      <div className="py-1">
                        {counties
                          .sort((a, b) => a.label.localeCompare(b.label))
                          .map((range, idx) => (
                            <div
                              key={idx}
                              className="flex items-center px-4 py-2 text-sm"
                            >
                              <input
                                type="checkbox"
                                id={`county-${idx}`}
                                value={range.value}
                                checked={selectedCounties.includes(range.value)}
                                onChange={() =>
                                  handleCountyChange2(
                                    range.value,
                                    closeDisclosure
                                  )
                                }
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                              />
                              <label
                                htmlFor={`county-${idx}`}
                                className="ml-2 text-gray-700"
                              >
                                {range.label}
                              </label>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </ControlledDisclosure>
              </div>

              <div className="relative inline-block text-left">
                <ControlledDisclosure
                  buttonClassName={`group inline-flex hover:bg-zinc-300 ${
                    isAnyCategorySelected
                      ? "bg-slate-600 text-white"
                      : "bg-zinc-200 text-gray-500"
                  } font-normal p-[9px] border border-gray-200 hover:rounded-sm rounded-sm justify-center text-sm hover:text-gray-600`}
                  buttonContent={(open) => (
                    <>
                      Category
                      <span className="ml-3 flex items-center">
                        {open ? (
                          <ChevronUpIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        ) : (
                          <ChevronDownIcon
                            className={`h-5 w-5 ${
                              isAnyCategorySelected
                                ? "text-white"
                                : "text-gray-400"
                            } group-hover:text-gray-700`}
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    </>
                  )}
                  panelClassName="absolute left-1/2 transform -translate-x-1/2 z-10 max-h-[calc(100vh-30vh)] overflow-y-scroll mt-1 w-72 origin-top divide-y divide-gray-100 rounded-sm bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  {({ closeDisclosure }) => (
                    <>
                      <h2 className="text-gray-700 text-base font-medium py-1 px-4">
                        Job Category
                      </h2>
                      <div className="py-1">
                        {categories
                          .sort((a, b) => a.label.localeCompare(b.label))
                          .map((range, idx) => (
                            <div
                              key={idx}
                              className="flex items-center px-4 py-2 text-sm"
                            >
                              <input
                                type="checkbox"
                                id={`category-${idx}`}
                                value={range.value}
                                checked={selectedCategories.includes(
                                  range.value
                                )}
                                onChange={() =>
                                  handleCheckboxChange2(
                                    range.value,
                                    closeDisclosure
                                  )
                                }
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                              />
                              <label
                                htmlFor={`category-${idx}`}
                                className="ml-2 text-gray-700"
                              >
                                {range.label}
                              </label>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </ControlledDisclosure>
              </div>

              <div className="relative inline-block text-left">
                <ControlledDisclosure
                  buttonClassName={`group inline-flex hover:bg-zinc-300 ${
                    isAnyRemunerationSelected
                      ? "bg-slate-600 text-white"
                      : "bg-zinc-200 text-gray-500"
                  } font-normal p-[9px] border border-gray-200 hover:rounded-sm rounded-sm justify-center text-sm hover:text-gray-600`}
                  buttonContent={(open) => (
                    <>
                      Remuneration
                      <span className="ml-3 flex items-center">
                        {open ? (
                          <ChevronUpIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        ) : (
                          <ChevronDownIcon
                            className={`h-5 w-5 ${
                              isAnyRemunerationSelected
                                ? "text-white"
                                : "text-gray-400"
                            } group-hover:text-gray-700`}
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    </>
                  )}
                  panelClassName="absolute left-1/2 transform -translate-x-1/2 z-10 max-h-[calc(100vh-30vh)] overflow-y-scroll mt-1 w-72 origin-top divide-y divide-gray-100 rounded-sm bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  {({ closeDisclosure }) => (
                    <>
                      <h2 className="text-gray-700 text-base font-medium py-1 px-4">
                        Job Compensation
                      </h2>
                      <div className="py-1">
                        {payments.map((range, idx) => (
                          <div
                            key={idx}
                            className="flex items-center px-4 py-2 text-sm"
                          >
                            <input
                              type="checkbox"
                              id={`payment-${idx}`}
                              value={range.value}
                              checked={selectedRemunerations.includes(
                                range.value
                              )}
                              onChange={() =>
                                handleRemunerationChange2(
                                  range.value,
                                  closeDisclosure
                                )
                              }
                              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            />
                            <label
                              htmlFor={`payment-${idx}`}
                              className="ml-2 text-gray-700"
                            >
                              {range.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </ControlledDisclosure>
              </div>

              <div className="relative inline-block text-left">
                <ControlledDisclosure
                  buttonClassName={`group inline-flex hover:bg-zinc-300 ${
                    isAnyAcademicSelected
                      ? "bg-slate-600 text-white"
                      : "bg-zinc-200 text-gray-500"
                  } font-normal p-[9px] border border-gray-200 hover:rounded-sm rounded-sm justify-center text-sm hover:text-gray-600`}
                  buttonContent={(open) => (
                    <>
                      Academics
                      <span className="ml-3 flex items-center">
                        {open ? (
                          <ChevronUpIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        ) : (
                          <ChevronDownIcon
                            className={`h-5 w-5 ${
                              isAnyAcademicSelected
                                ? "text-white"
                                : "text-gray-400"
                            } group-hover:text-gray-700`}
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    </>
                  )}
                  panelClassName="absolute left-1/2 transform -translate-x-1/2 z-10 max-h-[calc(100vh-30vh)] overflow-y-scroll mt-1 w-72 origin-top divide-y divide-gray-100 rounded-sm bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  {({ closeDisclosure }) => (
                    <>
                      <h2 className="text-gray-700 text-base font-medium py-1 px-4">
                        Required Academics
                      </h2>
                      <div className="py-1">
                        {academics.map((range, idx) => (
                          <div
                            key={idx}
                            className="flex items-center px-4 py-2 text-sm"
                          >
                            <input
                              type="checkbox"
                              id={`academic-${idx}`}
                              value={range.value}
                              checked={selectedAcademics.includes(range.value)}
                              onChange={() =>
                                handleAcademicChange2(
                                  range.value,
                                  closeDisclosure
                                )
                              }
                              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            />
                            <label
                              htmlFor={`academic-${idx}`}
                              className="ml-2 text-gray-700"
                            >
                              {range.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </ControlledDisclosure>
              </div>

              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex hover:bg-zinc-300 font-normal p-[9px] border bg-zinc-200 border-gray-200 hover:rounded-sm rounded-sm justify-center text-sm text-gray-500 hover:text-gray-600">
                    <ArrowUpDown className="h-5 w-5 mr-1 text-gray-400 shrink-0" />{" "}
                    Sort
                    <ChevronDownIcon
                      className="-mr-1 ml-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-700"
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
                  <Menu.Items className="absolute w-48 right-0 z-10 mt-2 origin-top-right rounded-sm bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortByOptions.map((option) => (
                        <Menu.Item key={option.value}>
                          {({ active }) => (
                            <button
                              onClick={() => handleSortChange(option.value)}
                              className={cn(
                                "block w-full text-start px-2.5 py-2 text-sm",
                                sortBy === option.value
                                  ? "font-medium text-gray-700"
                                  : "text-gray-500",
                                active ? "bg-gray-100" : ""
                              )}
                            >
                              {option.label}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </MaxWidthWrapper1>
      </div>

      <div className="mt-3 md:mt-6 w-full mb-3 md:mb-6">
        <MaxWidthWrapper1>
          <div className="md:grid md:gap-x-5 mx-auto w-full h-full lg:gap-x-6 md:grid-cols-2">
            <div className="hidden md:block md:w-full md:mx-auto">
              {sortedAndFilteredJobs && sortedAndFilteredJobs.length !== 0 ? (
                <JobCard2 allJobs={jobsForCurrentPage} popular={popular} />
              ) : (
                <>
                  <NoSearchResult />
                </>
              )}
              <div className="mt-6 pb-4">
                {totalPages > 1 && (
                  <ReactPaginate
                    pageCount={totalPages}
                    onPageChange={({ selected }) =>
                      handlePageChange(selected + 1)
                    }
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
            <div className="md:sticky md:top-2 mx-auto w-full md:border md:shadow-sm md:border-gray-200 md:rounded-lg  md:max-h-[calc(100vh-2rem)]">
              {job ? (
                  <JobDetails
                  job={job}
                  viewID={viewID}
                  similarJobs={similarJobs}
                  popularJobs={popular}
                  allJobs={jobs}
                />
              ) : (
                <NoHomeDetailJob />
              )}
            </div>
          </div>
        </MaxWidthWrapper1>
      </div>
    </>
  );
};

export default HomeJobsNavBarDetails;
