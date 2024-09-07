import { db } from "@/db";
import { authorize } from "./indexAuth";

const convertToSlug = (text: string): string => {
  return text.toLowerCase().replace(/\s+/g, "-");
};

export default async function googleIndexAPI() {
  const baseUrl = "https://www.hired.co.ke";
  const currentDate = new Date();

  const jobs = await db.job.findMany({
    where: {
      deadline: {
        gte: currentDate,
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 4 * 24 * 60 * 60 * 1000),
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
      createdAt: {
        gte: new Date(currentDate.getTime() - 4 * 24 * 60 * 60 * 1000),
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
      createdAt: {
        gte: new Date(currentDate.getTime() - 6 * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const workerCategories = workerBlogs
    .map((blog) => blog.category)
    .filter((category, index, self) => category && self.indexOf(category) === index);

  const employerCategories = employerBlogs
    .map((blog) => blog.category)
    .filter((category, index, self) => category && self.indexOf(category) === index);

  const allBlogsForWorkerTags = await db.blogs.findMany({
    where: {
      target: {
        in: ["Worker", "All"],
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 6 * 24 * 60 * 60 * 1000),
      },
    },
  });

  const allBlogsForEmployerTags = await db.blogs.findMany({
    where: {
      target: {
        in: ["Employer", "All"],
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 6 * 24 * 60 * 60 * 1000),
      },
    },
  });

  const urlsToIndex = [
    ...jobs.map((job) => `${baseUrl}/home/jobs/${job.id}`),
    ...workerBlogs.map((blog) => `${baseUrl}/home/blogs/job-seekers/${blog.id}`),
    ...workerBlogs.flatMap((blog) =>
      workerCategories.map((category) => {
        const categorySlug = convertToSlug(category);
        return `${baseUrl}/home/blogs/job-seekers/${blog.id}/categories/${categorySlug}`;
      })
    ),
    ...employerBlogs.map((blog) => `${baseUrl}/home/blogs/employers/${blog.id}`),
    ...employerBlogs.flatMap((blog) =>
      employerCategories.map((category) => {
        const categorySlug = convertToSlug(category);
        return `${baseUrl}/home/blogs/employers/${blog.id}/categories/${categorySlug}`;
      })
    ),
    ...allBlogsForWorkerTags.flatMap((blog) => {
      const tags = blog.body.match(/#\w+/g);
      if (tags) {
        return tags.map((tag) => {
          const tagSlug = convertToSlug(tag.replace("#", ""));
          return `${baseUrl}/home/blogs/job-seekers/${blog.id}/${tagSlug}`;
        });
      }
      return [];
    }),
    ...allBlogsForEmployerTags.flatMap((blog) => {
      const tags = blog.body.match(/#\w+/g);
      if (tags) {
        return tags.map((tag) => {
          const tagSlug = convertToSlug(tag.replace("#", ""));
          return `${baseUrl}/home/blogs/employers/${blog.id}/${tagSlug}`;
        });
      }
      return [];
    }),
  ];

  const token = await authorize();

  for await (const url of urlsToIndex) {
    await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        url,
        type: "URL_UPDATED",
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log({ response }, "indexed url");
      })
      .catch((err) => {
        console.log({ err }, "failed to index");
      });
  }
}
