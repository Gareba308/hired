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
import "@/lib/suppressHydration"
import { User } from "@prisma/client";

interface LineChartsProps {
  employers: User[];
}

const generateLineChartData = (
  employers: User[]
): { name: string; referred: number; special: number; suspended: number }[] => {
  const data: {
    name: string;
    referred: number;
    special: number;
    suspended: number;
  }[] = [];
  const currentDate = new Date();
  const firstDataDate = employers.reduce((earliestDate, employer) => {
    return employer.createdAt < earliestDate
      ? employer.createdAt
      : earliestDate;
  }, currentDate);

  const startMonth = subYears(firstDataDate, 1).getMonth();

  for (let i = 0; i < 12; i++) {
    const monthName = format(
      new Date(currentDate.getFullYear() - 1, (startMonth + i) % 12, 1),
      "MMM"
    );
    const referredTotal = employers.filter(
      (employer) =>
        new Date(employer.createdAt).getMonth() === (startMonth + i) % 12 &&
        employer.referred === true
    ).length;
    const specialTotal = employers.filter(
      (employer) =>
        new Date(employer.createdAt).getMonth() === (startMonth + i) % 12 &&
        employer.special === true
    ).length;
    const suspendedTotal = employers.filter(
      (employer) =>
        new Date(employer.createdAt).getMonth() === (startMonth + i) % 12 &&
        employer.suspended === true
    ).length;
    data.push({
      name: monthName,
      referred: referredTotal,
      special: specialTotal,
      suspended: suspendedTotal,
    });
  }
  return data;
};

export function TheLineCharts({ employers }: LineChartsProps) {
  const data = generateLineChartData(employers);

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
              const { referred, special, suspended } = payload[0].payload;
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
                  <p>{`Referred: ${referred}`}</p>
                  <p>{`Special: ${special}`}</p>
                  <p>{`Suspended: ${suspended}`}</p>
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
          dataKey="referred"
          stroke="#1e40af"
          dot={false}
          strokeWidth={2}
          name="Referred"
        />
        <Line
          type="monotone"
          dataKey="special"
          stroke="#115e59"
          dot={false}
          strokeWidth={2}
          name="Special"
        />
        <Line
          type="monotone"
          dataKey="suspended"
          stroke="#b91c1c"
          dot={false}
          strokeWidth={2}
          name="Suspended"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
