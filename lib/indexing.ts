import { db } from "@/db";
import { authorize } from "./indexAuth";

export default async function googleIndexAPI() {
  const baseUrl = "https://www.hired.co.ke";
  const currentDate = new Date();

  const jobs = await db.job.findMany({
    where: {
      deadline: {
        gte: currentDate,
      },
      published: {
        equals: true
      },
      createdAt: {
        gte: new Date(currentDate.getTime() - 6 * 60 * 60 * 1000),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const urlsToIndex = [
    ...jobs.map((job) => `${baseUrl}/home/jobs/${job.id}`),
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
