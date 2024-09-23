import { db } from "@/db";
import { MetadataRoute } from "next";

const convertToSlug = (text: string): string => {
  return text.toLowerCase().replace(/\s+/g, "-");
};

const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, (char) => encodeURIComponent(char))
    .replace(/\s+/g, "_")
    .replace(/__+/g, "_");
};

const slugMapping = {
  internship: "internship",
  nairobi: "nairobi",
  mombasa: "mombasa",
  latest: "latest",
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.hired.co.ke";

  const currentDate = new Date();
  const jobs = await db.job.findMany({
    where: {
      deadline: {
        gte: currentDate,
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const workerBlogs = await db.blogs.findMany({
    where: {
      target: {
        in: ["Worker", "All"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const employerBlogs = await db.blogs.findMany({
    where: {
      target: {
        in: ["Employer", "All"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const allBlogsForWorkerTags = await db.blogs.findMany({
    where: {
      target: {
        in: ["Worker", "All"],
      },
    },
  });

  const allBlogsForEmployerTags = await db.blogs.findMany({
    where: {
      target: {
        in: ["Employer", "All"],
      },
    },
  });
  const workerCategories = workerBlogs
    .map((blog) => blog.category)
    .filter(
      (category, index, self) => category && self.indexOf(category) === index
    );
  const employerCategories = employerBlogs
    .map((blog) => blog.category)
    .filter(
      (category, index, self) => category && self.indexOf(category) === index
    );

  const companyUrls = Array.from(
    new Set(
      jobs.map((job) => {
        const companySlug = slugify(job.company_name);
        return {
          url: `${baseUrl}/home/companies/${companySlug}`,
          lastModified: new Date(job.updatedAt),
          changeFreq: "daily",
          priority: 0.8,
        };
      })
    )
  );

  const subCategoryUrls = Array.from(
    new Set(
      jobs
        .filter((job) => job.subCategory !== null)
        .map((job) => {
          const subCategorySlug = convertToSlug(job.subCategory as string);
          return {
            url: `${baseUrl}/home/jobs/subcategory/${subCategorySlug}`,
            lastModified: new Date(job.updatedAt),
            changeFreq: "daily",
            priority: 0.8,
          };
        })
    )
  );

  const popularUrls = Array.from(
    new Set(
      jobs.flatMap((job) => {
        const urls = [];
        if (job.job_type === slugMapping.internship) {
          urls.push({
            url: `${baseUrl}/home/jobs/popular/${slugMapping.internship}`,
            lastModified: new Date(job.updatedAt),
            changeFreq: "daily",
            priority: 0.8,
          });
        }
        if (job.county === slugMapping.nairobi) {
          urls.push({
            url: `${baseUrl}/home/jobs/popular/${slugMapping.nairobi}`,
            lastModified: new Date(job.updatedAt),
            changeFreq: "daily",
            priority: 0.8,
          });
        } else if (job.county === slugMapping.mombasa) {
          urls.push({
            url: `${baseUrl}/home/jobs/popular/${slugMapping.mombasa}`,
            lastModified: new Date(job.updatedAt),
            changeFreq: "daily",
            priority: 0.8,
          });
        }
        if (
          job.createdAt >= new Date(currentDate.getTime() - 24 * 60 * 60 * 1000)
        ) {
          urls.push({
            url: `${baseUrl}/home/jobs/popular/${slugMapping.latest}`,
            lastModified: new Date(job.updatedAt),
            changeFreq: "hourly",
            priority: 0.9,
          });
        }
        return urls;
      })
    )
  );

  const jobsUrls = jobs.map((job) => {
    return {
      url: `${baseUrl}/home/jobs/${job.id}`,
      lastModified: new Date(job.updatedAt),
      changeFreq: "daily",
      priority: 0.9,
    };
  });

  const workersBlogsDetailUrls = workerBlogs.map((blog) => {
    return {
      url: `${baseUrl}/home/blogs/job-seekers/${blog.id}`,
      lastModified: new Date(blog.updatedAt),
      changeFreq: "daily",
      priority: 0.7,
    };
  });

  const workerBlogsDetailCategoriesURL = workerBlogs.flatMap(
    (
      blog
    ): Array<{
      url: string;
      lastModified: Date;
      changeFreq: string;
      priority: number;
    }> => {
      const urls: Array<{
        url: string;
        lastModified: Date;
        changeFreq: string;
        priority: number;
      }> = [];
      workerCategories.forEach((category) => {
        if (
          blog.category &&
          blog.category.toLowerCase() === category.toLowerCase()
        ) {
          const categorySlug = convertToSlug(category);
          urls.push({
            url: `${baseUrl}/home/blogs/job-seekers/${blog.id}/categories/${categorySlug}`,
            lastModified: new Date(blog.updatedAt),
            changeFreq: "daily",
            priority: 0.7,
          });
        }
      });
      return urls;
    }
  );

  const employersBlogsDetailUrls = employerBlogs.map((blog) => {
    return {
      url: `${baseUrl}/home/blogs/employers/${blog.id}`,
      lastModified: new Date(blog.updatedAt),
      changeFreq: "daily",
      priority: 0.7,
    };
  });

  const employerBlogsDetailCategoriesURL = employerBlogs.flatMap(
    (
      blog
    ): Array<{
      url: string;
      lastModified: Date;
      changeFreq: string;
      priority: number;
    }> => {
      const urls: Array<{
        url: string;
        lastModified: Date;
        changeFreq: string;
        priority: number;
      }> = [];
      employerCategories.forEach((category) => {
        if (
          blog.category &&
          blog.category.toLowerCase() === category.toLowerCase()
        ) {
          const categorySlug = convertToSlug(category);
          urls.push({
            url: `${baseUrl}/home/blogs/employers/${blog.id}/categories/${categorySlug}`,
            lastModified: new Date(blog.updatedAt),
            changeFreq: "daily",
            priority: 0.7,
          });
        }
      });
      return urls;
    }
  );

  const workerBlogsTagsUrls = allBlogsForWorkerTags.flatMap(
    (
      blog
    ): Array<{
      url: string;
      lastModified: Date;
      changeFreq: string;
      priority: number;
    }> => {
      const tags = blog.body.match(/#\w+/g);
      if (tags) {
        return tags.map((tag) => {
          const tagSlug = convertToSlug(tag.replace("#", ""));
          return {
            url: `${baseUrl}/home/blogs/job-seekers/${blog.id}/${tagSlug}`,
            lastModified: new Date(blog.updatedAt),
            changeFreq: "daily",
            priority: 0.7,
          };
        });
      }
      return [];
    }
  );

  const employerBlogsTagsUrls = allBlogsForEmployerTags.flatMap(
    (
      blog
    ): Array<{
      url: string;
      lastModified: Date;
      changeFreq: string;
      priority: number;
    }> => {
      const tags = blog.body.match(/#\w+/g);
      if (tags) {
        return tags.map((tag) => {
          const tagSlug = convertToSlug(tag.replace("#", ""));
          return {
            url: `${baseUrl}/home/blogs/employers/${blog.id}/${tagSlug}`,
            lastModified: new Date(blog.updatedAt),
            changeFreq: "daily",
            priority: 0.7,
          };
        });
      }
      return [];
    }
  );

  const workerBlogsFiltersCategoryUrls = workerCategories.map((category) => {
    const categorySlug = convertToSlug(category);
    return {
      url: `${baseUrl}/home/blogs/job-seekers/filter/${categorySlug}`,
      lastModified: new Date(),
      changeFreq: "daily",
      priority: 0.7,
    };
  });

  const employerBlogsFiltersCategoryUrls = employerCategories.map(
    (category) => {
      const categorySlug = convertToSlug(category);
      return {
        url: `${baseUrl}/home/blogs/employers/filter/${categorySlug}`,
        lastModified: new Date(),
        changeFreq: "daily",
        priority: 0.7,
      };
    }
  );

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/home/jobs`,
    },
    {
      url: `${baseUrl}/home/login`,
    },
    {
      url: `${baseUrl}/home/companies`,
    },
    {
      url: `${baseUrl}/home/register`,
    },
    {
      url: `${baseUrl}/home/login/enterprises`,
    },
    {
      url: `${baseUrl}/home/register/enterprises`,
    },
    {
      url: `${baseUrl}/home/blogs/job-seekers`,
    },
    {
      url: `${baseUrl}/home/blogs/employers`,
    },
    {
      url: `${baseUrl}/home/faqs/employers`,
    },
    {
      url: `${baseUrl}/home/faqs/job-seekers`,
    },
    {
      url: `${baseUrl}/home/privacy`,
    },
    {
      url: `${baseUrl}/home/terms`,
    },

    {
      url: `${baseUrl}/home/about`,
    },
    {
      url: `${baseUrl}/home/contact`,
    },
    {
      url: `${baseUrl}/home/security/email`,
    },
    {
      url: `${baseUrl}/home/security/password`,
    },
    {
      url: `${baseUrl}/home/forgot-password`,
    },
    ...jobsUrls,
    ...companyUrls,
    ...subCategoryUrls,
    ...popularUrls,
    ...workersBlogsDetailUrls,
    ...workerBlogsDetailCategoriesURL,
    ...employersBlogsDetailUrls,
    ...employerBlogsDetailCategoriesURL,
    ...workerBlogsTagsUrls,
    ...employerBlogsTagsUrls,
    ...workerBlogsFiltersCategoryUrls,
    ...employerBlogsFiltersCategoryUrls,
  ];
}
