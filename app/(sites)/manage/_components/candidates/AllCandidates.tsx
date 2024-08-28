"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  X as XMarkIcon,
  Filter as FunnelIcon,
  MinusIcon,
  PlusIcon,
  Grid2x2 as Squares2X2Icon,
  ChevronUpIcon,
  Search,
  Clock,
  SlidersHorizontalIcon,
  ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CandidateCard from "./CandidateCard";
import {
  About,
  Award,
  CertificationLicense,
  Experience,
  Language,
  ProfileView,
  SecondaryEducation,
  Skills,
  TertiaryEducation,
  WorkerBio,
  WorkerContact,
  WorkerDesires,
} from "@prisma/client";
import {
  academics,
  categories,
  counties,
  experienceRanges,
  genders,
  job_types,
  payments,
} from "../data/create-job/CreateJobData";
import NoCandidate from "./NoCandidate";
import ReactPaginate from "react-paginate";
interface AllCandidatesProps {
  workersBio: WorkerBio[];
  workersAbout: About[];
  workersDesire: WorkerDesires[];
  workersContact: WorkerContact[];
  workersSkills: Skills[];
  workersCertification: CertificationLicense[];
  workersAward: Award[];
  workersLanguage: Language[];
  workersExperience: Experience[];
  workersSecondary: SecondaryEducation[];
  workersTertiary: TertiaryEducation[];
  userId: string;
  myProfileViews: ProfileView[];
}
const pageSize = 20;

const sortByOptions = [
  { label: "Joined: Old to New", value: "createdAt_asc" },
  { label: "Joined: New to Old", value: "createdAt_desc" },
  { label: "Likes: Highest to Lowest", value: "thumbsUp_desc" },
  { label: "Likes: Lowest to Highest", value: "thumbsUp_asc" },
];

const useScreenSize = () => {
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      const isLarge = window.innerWidth > 1024;
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
      const isSmall = window.innerWidth <= 1024;
      setIsSmallScreen(isSmall);
    };
    checkInitialScreenSize();
    const handleResize = () => {
      const isSmall = window.innerWidth <= 1024;
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

export default function AllCandidates({
  workersBio,
  workersAbout,
  workersDesire,
  workersContact,
  workersSkills,
  workersCertification,
  workersAward,
  workersLanguage,
  workersExperience,
  workersSecondary,
  workersTertiary,
  userId,
  myProfileViews,
}: AllCandidatesProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedCounties, setSelectedCounties] = useState<string[]>([]);
  const [selectedRemunerations, setSelectedRemunerations] = useState<string[]>(
    []
  );
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedAcademics, setSelectedAcademics] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState<boolean>(false);
  const [isExperienceOpen, setIsExperienceOpen] = useState<boolean>(false);
  const [isCountiesOpen, setIsCountiesOpen] = useState<boolean>(false);
  const [isJobTypesOpen, setIsJobTypesOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState(sortByOptions[0].value);
  const [isRemunerationOpen, setIsRemunerationOpen] = useState<boolean>(false);
  const [isAcademicsOpen, setIsAcademicsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showDropdown1, setShowDropdown1] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownRef1 = useRef<HTMLDivElement>(null);
  const isLargeScreen = useScreenSize();
  const isSmallScreen = useScreenSize2();

  const combinedData = workersBio.map((item) => ({
    userId: item.userId,
    bio: item,
    desire: workersDesire.find((desire) => desire.userId === item.userId),
    about: workersAbout.find((about) => about.userId === item.userId),
    experience: workersExperience.filter(
      (item2) => item2.userId === item.userId
    ),
    contact: workersContact.find((item2) => item2.userId === item.userId),
    skills: workersSkills.find((item2) => item2.userId === item.userId),
    certification: workersCertification.filter(
      (item2) => item2.userId === item.userId
    ),
    award: workersAward.filter((item2) => item2.userId === item.userId),
    language: workersLanguage.filter((item2) => item2.userId === item.userId),
    secondary: workersSecondary.find(
      (secondary) => secondary.userId === item.userId
    ),
    tertiary: workersTertiary.filter(
      (tertiary) => tertiary.userId === item.userId
    ),
    profileViews: myProfileViews.filter(
      (view) => view.workerUserID === item.userId
    ),
  }));

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

  const handleCheckboxChange = (category: string) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((item) => item !== category)
        : [...prevSelected, category]
    );
  };

  const handleJobTypeChange = (jobType: string) => {
    setSelectedJobTypes((prevSelected) =>
      prevSelected.includes(jobType)
        ? prevSelected.filter((item) => item !== jobType)
        : [...prevSelected, jobType]
    );
  };

  const handleCountyChange = (county: string) => {
    setSelectedCounties((prevSelected) =>
      prevSelected.includes(county)
        ? prevSelected.filter((item) => item !== county)
        : [...prevSelected, county]
    );
  };

  const handleExperienceChange = (experience: string) => {
    setSelectedExperience((prevSelected) =>
      prevSelected.includes(experience)
        ? prevSelected.filter((item) => item !== experience)
        : [...prevSelected, experience]
    );
  };

  const handleRemunerationChange = (remuneration: string) => {
    setSelectedRemunerations((prevSelected) =>
      prevSelected.includes(remuneration)
        ? prevSelected.filter((item) => item !== remuneration)
        : [...prevSelected, remuneration]
    );
  };

  const handleAcademicChange = (academic: string) => {
    setSelectedAcademics((prevSelected) =>
      prevSelected.includes(academic)
        ? prevSelected.filter((item) => item !== academic)
        : [...prevSelected, academic]
    );
  };

  const handleGenderChange = (gender: string) => {
    setSelectedGender((prevSelected) =>
      prevSelected.includes(gender)
        ? prevSelected.filter((item) => item !== gender)
        : [...prevSelected, gender]
    );
  };

  const filteredSuggestions = useMemo(() => {
    const uniqueSuggestions = new Set<string>();
    combinedData.forEach((candidate) => {
      const jobTitle = candidate.bio.currentJobTitle ?? "";
      uniqueSuggestions.add(jobTitle);
      candidate.skills?.skills.forEach((skill) => uniqueSuggestions.add(skill));
    });
    return Array.from(uniqueSuggestions)
      .filter((suggestion) =>
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 10);
  }, [combinedData, searchQuery]);

  useEffect(() => {
    const storedSearchHistory = localStorage.getItem(
      `candidatesHistory${userId}`
    );
    if (storedSearchHistory) {
      setSearchHistory(JSON.parse(storedSearchHistory));
    }
  }, [userId]);

  useEffect(() => {
    localStorage.setItem(
      `candidatesHistory${userId}`,
      JSON.stringify(searchHistory)
    );
  }, [searchHistory, userId]);

  const handleSuggestionClick = (suggestion: string) => {
    const matchedCandidate = combinedData.find((candidate) => {
      const currentJobTitle = candidate.bio?.currentJobTitle ?? "";
      const lowercaseSuggestion = suggestion.toLowerCase();

      return (
        currentJobTitle.toLowerCase() === lowercaseSuggestion ||
        (candidate.skills?.skills &&
          candidate.skills.skills.some(
            (skill) => skill.toLowerCase() === lowercaseSuggestion
          ))
      );
    });

    if (matchedCandidate) {
      setSearchQuery(suggestion);
      setShowDropdown(false);
      if (!searchHistory.includes(suggestion)) {
        setSearchHistory([suggestion, ...searchHistory.slice(0, 9)]);
      }
    }
  };

  const handleSuggestionClick1 = (suggestion: string) => {
    const matchedCandidate = combinedData.find((candidate) => {
      const currentJobTitle = candidate.bio?.currentJobTitle ?? "";
      const lowercaseSuggestion = suggestion.toLowerCase();

      return (
        currentJobTitle.toLowerCase() === lowercaseSuggestion ||
        (candidate.skills?.skills &&
          candidate.skills.skills.some(
            (skill) => skill.toLowerCase() === lowercaseSuggestion
          ))
      );
    });

    if (matchedCandidate) {
      setSearchQuery(suggestion);
      setShowDropdown1(false);
      if (!searchHistory.includes(suggestion)) {
        setSearchHistory([suggestion, ...searchHistory.slice(0, 9)]);
      }
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    if (value.trim() === "") {
      setShowDropdown(false);
    } else {
      setShowDropdown(true);
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

  const handleInputFocus = () => {
    if (filteredSuggestions.length > 0 && searchQuery.trim() !== "") {
      setShowDropdown(true);
    }
  };

  const handleInputFocus1 = () => {
    if (filteredSuggestions.length > 0 && searchQuery.trim() !== "") {
      setShowDropdown1(true);
    }
  };

  const handleToggleDropdown = () => {
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  };
  const handleToggleDropdown1 = () => {
    setShowDropdown1((prevShowDropdown) => !prevShowDropdown);
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

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const filteredData = combinedData
    .filter((item) => {
      const countyMatch =
        selectedCounties.length === 0 ||
        item.bio.county === null ||
        selectedCounties.includes(item.bio.county);

      const jobTypeMatch =
        selectedJobTypes.length === 0 ||
        item.bio.employmentType === null ||
        selectedJobTypes.includes(item.bio.employmentType);

      const academicMatch =
        selectedAcademics.length === 0 ||
        item.bio.highestEducation === null ||
        selectedAcademics.includes(item.bio.highestEducation);

      const genderMatch =
        selectedGender.length === 0 ||
        item.bio.gender === null ||
        selectedGender.includes(item.bio.gender);

      const category = item.desire?.category ?? "";
      const desiredRemuneration = item.desire?.desiredRemuneration ?? "";
      const experience = item.desire?.yearsOfExperience ?? "";

      const categoryMatch =
        selectedCategories.length === 0 ||
        category === "" ||
        selectedCategories.includes(category);

      const remunerationMatch =
        selectedRemunerations.length === 0 ||
        desiredRemuneration === "" ||
        selectedRemunerations.includes(desiredRemuneration);

      const experienceMatch =
        selectedExperience.length === 0 ||
        selectedExperience.every((experienceRange) => {
          const [minYears, maxYears] = experienceRange
            .split(" - ")
            .map((years) => parseInt(years, 10));
          if (isNaN(maxYears)) {
            return true;
          }
          const jobExperience = parseInt(experience.split(" ")[0] ?? "0", 10);
          return (
            isNaN(jobExperience) ||
            (jobExperience >= minYears && jobExperience <= maxYears)
          );
        });
      return (
        countyMatch &&
        jobTypeMatch &&
        categoryMatch &&
        genderMatch &&
        academicMatch &&
        remunerationMatch &&
        experienceMatch
      );
    })
    .filter((item) => {
      if (searchQuery) {
        const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const searchRegex = new RegExp(escapedQuery.toLowerCase(), "i");
        const jobTitle = item.bio.currentJobTitle ?? "";
        const hasMatchingTitle = searchRegex.test(jobTitle.toLowerCase());
        const hasMatchingSkill = item.skills?.skills.some((skill: string) =>
          searchRegex.test(skill.toLowerCase())
        );
        return hasMatchingTitle || hasMatchingSkill;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "createdAt_asc") {
        return (
          new Date(a.bio.createdAt).getTime() -
          new Date(b.bio.createdAt).getTime()
        );
      } else if (sortBy === "createdAt_desc") {
        return (
          new Date(b.bio.createdAt).getTime() -
          new Date(a.bio.createdAt).getTime()
        );
      } else if (sortBy === "thumbsUp_asc") {
        return (a.bio.thumbUp || 0) - (b.bio.thumbUp || 0);
      } else if (sortBy === "thumbsUp_desc") {
        return (b.bio.thumbUp || 0) - (a.bio.thumbUp || 0);
      }
      return 0;
    });

  // I just created a combined filtered result
  const sortedAndFilteredCandidates = filteredData.map((item) => ({
    userId: item.userId,
    bio: item.bio,
    desires: workersDesire.find((desire) => desire.userId === item.userId),
    about: workersAbout.find((about) => about.userId === item.userId),
    experience: workersExperience.filter(
      (item2) => item2.userId === item.userId
    ),
    contact: workersContact.find((item2) => item2.userId === item.userId),
    skills: workersSkills.find((item2) => item2.userId === item.userId),
    certification: workersCertification.filter(
      (item2) => item2.userId === item.userId
    ),
    award: workersAward.filter((item2) => item2.userId === item.userId),
    language: workersLanguage.filter((item2) => item2.userId === item.userId),
    secondary: workersSecondary.find(
      (secondary) => secondary.userId === item.userId
    ),
    tertiary: workersTertiary.filter(
      (tertiary) => tertiary.userId === item.userId
    ),
  }));

  const filteredJobTitles = filteredSuggestions.filter((suggestion) =>
    combinedData.some((job) => {
      const currentJobTitle = job.bio?.currentJobTitle ?? "";
      return currentJobTitle.toLowerCase().includes(suggestion.toLowerCase());
    })
  );

  const filteredSkills = filteredSuggestions.filter(
    (suggestion) =>
      !combinedData.some((job) => {
        const currentJobTitle = job.bio?.currentJobTitle ?? "";
        return currentJobTitle.toLowerCase().includes(suggestion.toLowerCase());
      })
  );

  const filteredJobTitlesFromHistory = searchHistory
    .filter((historyItem) =>
      combinedData.some((job) =>
        job.bio.currentJobTitle
          ?.toLowerCase()
          .includes(historyItem.toLowerCase())
      )
    )
    .reverse();

  const filteredSkillsFromHistory = searchHistory
    .filter((historyItem) =>
      combinedData.some(
        (job) =>
          job.skills?.skills &&
          job.skills.skills.some(
            (skill) => skill.toLowerCase() === historyItem.toLowerCase()
          )
      )
    )
    .reverse();

  const candidatesForCurrentPage = sortedAndFilteredCandidates.slice(
    startIndex,
    endIndex
  );
  const totalPages = Math.ceil(sortedAndFilteredCandidates.length / pageSize);

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };
  return (
    <>
      <>
        <div>
          <Transition.Root show={mobileFiltersOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-40 lg:hidden"
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
                  <Dialog.Panel className="relative ml-auto flex h-full px-3 w-full mt-[70px] max-w-xs flex-col overflow-y-auto bg-white py-4 pb-4 shadow-lg">
                    <div className="flex items-center justify-between px-4">
                      <h2 className="text-lg font-medium text-gray-700">
                        Candidate Filters
                      </h2>
                      <button
                        type="button"
                        className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
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
                            <h2 className="font-medium">
                              Candidate&apos;s Gender
                            </h2>
                            <div className="space-y-2 font-normal text-sm">
                              {genders.map((gender, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center -mt-2"
                                >
                                  <input
                                    type="checkbox"
                                    id={`gender-${idx}`}
                                    value={gender.value}
                                    checked={selectedGender.includes(
                                      gender.value
                                    )}
                                    onChange={() =>
                                      handleGenderChange(gender.value)
                                    }
                                  />
                                  <label
                                    htmlFor={`gender-${idx}`}
                                    className="ml-2"
                                  >
                                    {gender.label}
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
                                              handleAcademicChange(
                                                academic.value
                                              )
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
                                              handleExperienceChange(
                                                range.value
                                              )
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

          <main>
            <div className="flex items-end flex-row justify-between">
              <div className="text-2xl text-center sm:text-start sm:text-3xl font-bold tracking-tight text-gray-600">
                <h3>Candidates</h3>
              </div>
            </div>

            <section
              aria-labelledby="products-heading"
              className="mb-2.5 mt-2 lg:mt-0"
            >
              <div className="flex flex-wrap">
                <div className="w-full lg:w-2/3">
                  <div className="lg:col-span-3 lg:pb-2 lg:-mr-2 lg:pr-4">
                    <div className="items-center hidden mt-2 lg:flex lg:flex-row">
                      <div className="relative mr-2 w-full">
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
                          placeholder="Find candidates by job title or skill"
                          onChange={handleSearchChange}
                          onFocus={handleInputFocus}
                          className="w-full py-2 h-10 pl-12 placeholder:text-lg line-clamp-1 placeholder:text-gray-500 placeholder:font-normal pr-4 text-gray-500 font-normal border text-sm border-gray-200 rounded-sm outline-none focus:bg-white focus:border-primary"
                        />
                        {!searchQuery && !showDropdown && (
                          <div
                            className="absolute top-3 right-3 my-auto cursor-pointer"
                            onClick={handleToggleDropdown}
                          >
                            <ChevronDownIcon className="h-4 w-4 ml-1 text-gray-400" />
                          </div>
                        )}
                        {showDropdown && !searchQuery && (
                          <div
                            className="absolute top-3 right-3 my-auto cursor-pointer"
                            onClick={handleToggleDropdown}
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
                        {showDropdown && (
                          <div
                            ref={dropdownRef}
                            className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-b-md shadow-lg"
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
                                        {filteredJobTitles.map(
                                          (suggestion, index) => (
                                            <li
                                              key={index}
                                              className="px-4 py-2 hover:bg-secondary text-sm flex items-center shrink-0 cursor-pointer"
                                              onClick={() =>
                                                handleSuggestionClick(
                                                  suggestion
                                                )
                                              }
                                            >
                                              <Search className="h-4 w-4 text-gray-400 mr-1" />
                                              <span className="line-clamp-1">
                                                {suggestion}
                                              </span>
                                            </li>
                                          )
                                        )}
                                      </>
                                    )}
                                    {filteredSkills.length > 0 && (
                                      <>
                                        <li className="px-4 py-0 mt-2 text-xs text-gray-700 uppercase font-semibold">
                                          Skills
                                        </li>
                                        {filteredSkills.map(
                                          (suggestion, index) => (
                                            <li
                                              key={index}
                                              className="px-4 py-2 hover:bg-secondary text-sm flex items-center shrink-0 cursor-pointer"
                                              onClick={() =>
                                                handleSuggestionClick(
                                                  suggestion
                                                )
                                              }
                                            >
                                              <Search className="h-4 w-4 text-gray-400 mr-1" />
                                              <span className="line-clamp-1">
                                                {suggestion}
                                              </span>
                                            </li>
                                          )
                                        )}
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
                                    {filteredJobTitlesFromHistory.length >
                                      0 && (
                                      <ul>
                                        <li className="px-4 py-0 mt-2 text-xs text-gray-700 uppercase font-semibold">
                                          Job Titles
                                        </li>
                                        {filteredJobTitlesFromHistory.map(
                                          (suggestion, index) => (
                                            <li
                                              key={index}
                                              className="px-4 py-2 hover:bg-secondary text-sm text-gray-500 flex items-center shrink-0 cursor-pointer"
                                              onClick={() =>
                                                handleSuggestionClick(
                                                  suggestion
                                                )
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
                                    {filteredSkillsFromHistory.length > 0 && (
                                      <ul>
                                        <li className="px-4 py-0 mt-2 text-xs text-gray-700 uppercase font-semibold">
                                          Skills
                                        </li>
                                        {filteredSkillsFromHistory.map(
                                          (suggestion, index) => (
                                            <li
                                              key={index}
                                              className="px-4 py-2 hover:bg-secondary text-gray-500 text-sm flex items-center shrink-0 cursor-pointer"
                                              onClick={() =>
                                                handleSuggestionClick(
                                                  suggestion
                                                )
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

                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <div>
                          <Menu.Button className="group h-10 inline-flex hover:bg-secondary font-normal p-2 border border-gray-200 rounded-sm justify-center text-sm text-gray-600 hover:text-gray-700">
                            <ArrowUpDown className="h-5 w-5 mr-1 text-gray-500 shrink-0" />{" "}
                            Sort
                            <ChevronDownIcon
                              className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-500 group-hover:text-gray-700"
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
                          <Menu.Items className="absolute w-48 right-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              {sortByOptions.map((option) => (
                                <Menu.Item key={option.value}>
                                  {({ active }) => (
                                    <button
                                      onClick={() =>
                                        handleSortChange(option.value)
                                      }
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
                        className="p-2 lg:hidden group h-10 rounded-sm border font-normal text-sm text-gray-600 inline-flex items-center shrink-0 border-gray-200 hover:bg-secondary ml-2"
                      >
                        <span className="sr-only">Filters</span>
                        <SlidersHorizontalIcon
                          className="h-4 w-4 text-gray-500 shrink-0 mr-1"
                          aria-hidden="true"
                        />
                        Filter
                        <ChevronDownIcon
                          className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-500 group-hover:text-gray-700"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                    <div className="flex flex-row w-full justify-between items-center gap-x-2 sm:gap-x-3 mb-2.5 md:mb-3 lg:hidden">
                      <div className="relative w-full">
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
                          placeholder="Find candidates by job title or skill"
                          onChange={handleSearchChange1}
                          onFocus={handleInputFocus1}
                          className="w-full py-2 pl-12 h-10 placeholder:text-base line-clamp-1 placeholder:text-gray-500 placeholder:font-normal pr-4 text-gray-500 font-normal border text-sm border-gray-200 rounded-sm outline-none bg-white focus:bg-white focus:border-primary"
                        />
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
                            className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-b-md shadow-lg"
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
                                        {filteredJobTitles.map(
                                          (suggestion, index) => (
                                            <li
                                              key={index}
                                              className="px-4 py-2 hover:bg-secondary text-gray-500 text-sm flex items-center shrink-0 cursor-pointer"
                                              onClick={() =>
                                                handleSuggestionClick1(
                                                  suggestion
                                                )
                                              }
                                            >
                                              <Search className="h-4 w-4 text-gray-400 mr-1" />
                                              <span className="line-clamp-1">
                                                {suggestion}
                                              </span>
                                            </li>
                                          )
                                        )}
                                      </>
                                    )}
                                    {filteredSkills.length > 0 && (
                                      <>
                                        <li className="px-4 py-0 mt-2 text-xs text-gray-700 uppercase font-semibold">
                                          Skills
                                        </li>
                                        {filteredSkills.map(
                                          (suggestion, index) => (
                                            <li
                                              key={index}
                                              className="px-4 py-2 hover:bg-secondary text-gray-500 text-sm flex items-center shrink-0 cursor-pointer"
                                              onClick={() =>
                                                handleSuggestionClick1(
                                                  suggestion
                                                )
                                              }
                                            >
                                              <Search className="h-4 w-4 text-gray-400 mr-1" />
                                              <span className="line-clamp-1">
                                                {suggestion}
                                              </span>
                                            </li>
                                          )
                                        )}
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
                                    {filteredJobTitlesFromHistory.length >
                                      0 && (
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
                                                handleSuggestionClick1(
                                                  suggestion
                                                )
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
                                                handleSuggestionClick1(
                                                  suggestion
                                                )
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

                      <div className="flex items-center flex-row">
                        <Menu
                          as="div"
                          className="relative inline-block text-left"
                        >
                          <div>
                            <Menu.Button className="group h-10 inline-flex hover:bg-secondary font-normal p-2 border border-gray-200 hover:rounded-sm rounded-sm justify-center text-sm text-gray-600 hover:text-gray-700">
                              <ArrowUpDown className="h-5 w-5 text-gray-500 shrink-0" />{" "}
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
                            <Menu.Items className="absolute w-48 right-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div className="py-1">
                                {sortByOptions.map((option) => (
                                  <Menu.Item key={option.value}>
                                    {({ active }) => (
                                      <button
                                        onClick={() =>
                                          handleSortChange(option.value)
                                        }
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
                          className="p-2 h-10 lg:hidden group rounded-sm border font-normal text-sm text-gray-600 inline-flex items-center shrink-0 border-gray-200 hover:bg-secondary ml-2"
                        >
                          <span className="sr-only">Filters</span>
                          <SlidersHorizontalIcon
                            className="h-4 w-4 text-gray-500 shrink-0"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      {sortedAndFilteredCandidates.length !== 0 ? (
                        <>
                          <CandidateCard
                            combinedData={candidatesForCurrentPage as []}
                            profileViews={myProfileViews}
                            userId={userId}
                          />
                        </>
                      ) : (
                        <>
                          <NoCandidate />
                        </>
                      )}
                      <div className="mt-6">
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
                            disabledClassName={
                              "text-gray-400 cursor-not-allowed"
                            }
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={2}
                            breakLabel={"..."}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full hidden lg:flex lg:w-1/3 lg:pl-4 lg:sticky lg:top-[65px]">
                  <div className="flex flex-col w-full h-full">
                    <form className="lg:border lg:rounded-lg lg:border-gray-200 lg:sticky lg:top-0 z-10 mt-2 mb-2">
                      <h3 className="text-[17.2px] h-10 pt-1.5 px-4 lg:rounded-t-lg font-medium mb-3 text-slate-600 bg-slate-200 border-b border-gray-200 pb-1.5">
                        Candidates Filter
                      </h3>

                      {!isAcademicsOpen &&
                        !isExperienceOpen &&
                        !isJobTypesOpen &&
                        !isCountiesOpen &&
                        isLargeScreen &&
                        !isRemunerationOpen &&
                        !isCategoriesOpen && (
                          <ul
                            role="list"
                            className="space-y-4 px-4 border-b pb-3 border-gray-200 text-gray-600"
                          >
                            <h2 className="text-base font-medium">
                              Candidate&apos;s Gender
                            </h2>
                            <div className="space-y-2 font-normal text-sm">
                              {genders.map((gender, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center -mt-2"
                                >
                                  <input
                                    type="checkbox"
                                    id={`gender-${idx}`}
                                    value={gender.value}
                                    checked={selectedGender.includes(
                                      gender.value
                                    )}
                                    onChange={() =>
                                      handleGenderChange(gender.value)
                                    }
                                  />
                                  <label
                                    htmlFor={`gender-${idx}`}
                                    className="ml-2"
                                  >
                                    {gender.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </ul>
                        )}

                      {!isAcademicsOpen &&
                        !isExperienceOpen &&
                        !isJobTypesOpen &&
                        isLargeScreen &&
                        !isCountiesOpen &&
                        !isRemunerationOpen && (
                          <Disclosure
                            as="div"
                            className={cn(
                              "border-b px-4 border-gray-200 py-5",
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
                                <Disclosure.Panel className="pt-2 px-1.5 pb-1.5 overflow-y-auto max-h-[calc(100vh-17.5rem)] text-sm">
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
                        isLargeScreen &&
                        !isCategoriesOpen &&
                        !isCountiesOpen &&
                        !isRemunerationOpen && (
                          <Disclosure
                            as="div"
                            className={cn(
                              "border-b px-4 border-gray-200 py-5",
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
                        isLargeScreen &&
                        !isCategoriesOpen &&
                        !isJobTypesOpen &&
                        !isRemunerationOpen && (
                          <Disclosure
                            as="div"
                            className={cn(
                              "border-b px-4 border-gray-200 py-5",
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
                                <Disclosure.Panel className="pt-2 px-1.5 pb-1.5 overflow-y-auto max-h-[calc(100vh-17.5rem)] text-sm">
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
                        isLargeScreen &&
                        !isCategoriesOpen &&
                        !isJobTypesOpen &&
                        !isCountiesOpen && (
                          <Disclosure
                            as="div"
                            className={cn(
                              "border-b px-4 border-gray-200 py-5",
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
                                <Disclosure.Panel className="pt-2 px-1.5 pb-1.5 overflow-y-auto max-h-[calc(100vh-17.5rem)] text-sm">
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
                        isLargeScreen &&
                        !isRemunerationOpen &&
                        !isJobTypesOpen &&
                        !isCountiesOpen && (
                          <Disclosure
                            as="div"
                            className={cn(
                              "border-b px-4 border-gray-200 py-5",
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
                                <Disclosure.Panel className="pt-2 px-1.5 pb-1.5 overflow-y-auto max-h-[calc(100vh-17.5rem)] text-sm">
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
                                              handleAcademicChange(
                                                academic.value
                                              )
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
                        isLargeScreen &&
                        !isRemunerationOpen &&
                        !isJobTypesOpen &&
                        !isCountiesOpen && (
                          <Disclosure
                            as="div"
                            className={cn(
                              "py-5 px-4",
                              isExperienceOpen && "-mt-5"
                            )}
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
                                <Disclosure.Panel className="pt-2 px-1.5 pb-1.5 overflow-y-auto max-h-[calc(100vh-17.5rem)] text-sm">
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
                                              handleExperienceChange(
                                                range.value
                                              )
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
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </>
    </>
  );
}
