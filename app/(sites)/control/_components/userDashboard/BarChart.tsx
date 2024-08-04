"use client";

import "../../../../../lib/suppressDefaultPropsWarning";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { format, subYears } from "date-fns";
import { Application } from "@prisma/client";

interface BarChartsProps {
  applications: Application[];
}
const generateBarChartData = (
  applications: Application[]
): { name: string; total: number }[] => {
  const data: { name: string; total: number }[] = [];
  const currentDate = new Date();
  const firstDataDate = applications.reduce((earliestDate, application) => {
    return application.createdAt < earliestDate
      ? application.createdAt
      : earliestDate;
  }, currentDate);
  const startMonth = subYears(firstDataDate, 1).getMonth();

  for (let i = 0; i < 12; i++) {
    const monthName = format(
      new Date(currentDate.getFullYear() - 1, (startMonth + i) % 12, 1),
      "MMM"
    );
    const total = applications.filter(
      (application) =>
        new Date(application.createdAt).getMonth() === (startMonth + i) % 12
    ).length;
    data.push({ name: monthName, total });
  }
  return data;
};

export function BarCharts({ applications }: BarChartsProps) {
  const data = generateBarChartData(applications);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
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
              const { total } = payload[0].payload;
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
                  <p>{`Applications: ${total}`}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <CartesianGrid
          horizontal={true}
          vertical={false}
          strokeWidth={1}
          stroke="#E2E8F0"
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
