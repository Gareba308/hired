"use client";

import "../../../../../lib/suppressDefaultPropsWarning";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { format, subYears } from "date-fns";
import { Job } from "@prisma/client";

interface LineChartsProps {
  jobs: Job[];
}

const generateLineChartData = (
  jobs: Job[]
): { name: string; here: number; own: number }[] => {
  const data: {
    name: string;
    here: number;
    own: number;
  }[] = [];
  const currentDate = new Date();
  const firstDataDate = jobs.reduce((earliestDate, job) => {
    return job.createdAt < earliestDate ? job.createdAt : earliestDate;
  }, currentDate);

  const startMonth = subYears(firstDataDate, 1).getMonth();

  for (let i = 0; i < 12; i++) {
    const monthName = format(
      new Date(currentDate.getFullYear() - 1, (startMonth + i) % 12, 1),
      "MMM"
    );
    const hereTotal = jobs.filter(
      (job) =>
        new Date(job.createdAt).getMonth() === (startMonth + i) % 12 &&
        job.ownPlatformMethod === "here"
    ).length;
    const ownTotal = jobs.filter(
      (job) =>
        new Date(job.createdAt).getMonth() === (startMonth + i) % 12 &&
        job.ownPlatformMethod === "own"
    ).length;
    data.push({
      name: monthName,
      here: hereTotal,
      own: ownTotal,
    });
  }
  return data;
};

export function TheLineCharts({ jobs }: LineChartsProps) {
  const data = generateLineChartData(jobs);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={true}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ fill: "transparent" }}
          content={({ payload, label }) => {
            if (payload && payload.length > 0) {
              const { here, own } = payload[0].payload;
              return (
                <div
                  style={{
                    background: "#fff",
                    padding: "5px",
                    border: "1px solid #ccc",
                  }}
                  className="rounded-sm px-2"
                >
                  <p className="text-gray-600 font-bold">{`Month: ${label}`}</p>
                  <p>{`Here: ${here}`}</p>
                  <p>{`Own: ${own}`}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        <CartesianGrid
          horizontal={true}
          vertical={false}
          strokeWidth={1}
          stroke="#E2E8F0"
        />
        <Line
          type="monotone"
          dataKey="here"
          stroke="#115e59"
          dot={false}
          strokeWidth={2}
          name="Here"
        />
        <Line
          type="monotone"
          dataKey="own"
          stroke="#1e40af"
          dot={false}
          strokeWidth={2}
          name="Own"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
