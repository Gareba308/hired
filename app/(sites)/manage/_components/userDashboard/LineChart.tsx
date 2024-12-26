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
import { ApplicationStatus } from "@prisma/client";

interface MyApplicationItemsProps {
  createdAt: Date;
  id: string;
  status: ApplicationStatus;
}

interface LineChartsProps {
  applications: MyApplicationItemsProps[];
}

const generateLineChartData = (
  applications: MyApplicationItemsProps[]
): { name: string; offered: number; declined: number; active: number }[] => {
  const data: {
    name: string;
    offered: number;
    declined: number;
    active: number;
  }[] = [];
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
    const offeredTotal = applications.filter(
      (application) =>
        new Date(application.createdAt).getMonth() === (startMonth + i) % 12 &&
        application.status === ApplicationStatus.OFFERED
    ).length;
    const declinedTotal = applications.filter(
      (application) =>
        new Date(application.createdAt).getMonth() === (startMonth + i) % 12 &&
        application.status === ApplicationStatus.DECLINED
    ).length;
    const activeTotal = applications.filter(
      (application) =>
        new Date(application.createdAt).getMonth() === (startMonth + i) % 12 &&
        !(
          application.status === ApplicationStatus.OFFERED ||
          application.status === ApplicationStatus.DECLINED
        )
    ).length;
    data.push({
      name: monthName,
      offered: offeredTotal,
      declined: declinedTotal,
      active: activeTotal,
    });
  }
  return data;
};

export function TheLineCharts({ applications }: LineChartsProps) {
  const data = generateLineChartData(applications);

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
              const { offered, declined, active } = payload[0].payload;
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
                  <p>{`Active: ${active}`}</p>
                  <p>{`Offered: ${offered}`}</p>
                  <p>{`Declined: ${declined}`}</p>
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
          dataKey="active"
          stroke="#115e59"
          dot={false}
          strokeWidth={2}
          name="Active"
        />
        <Line
          type="monotone"
          dataKey="offered"
          stroke="#1e40af"
          dot={false}
          strokeWidth={2}
          name="Offered"
        />
        <Line
          type="monotone"
          dataKey="declined"
          stroke="#991b1b"
          dot={false}
          strokeWidth={2}
          name="Declined"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
