import { useEffect, useState } from "react";
import { formatInTimeZone } from "date-fns-tz";

interface DateDisplayProps {
  date: string;
  format: string;
}

export const DateDisplay = ({ date, format }: DateDisplayProps) => {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const formatted = formatInTimeZone(new Date(date), userTimeZone, format);
    setFormattedDate(formatted);
  }, [date, format]);

  if (!formattedDate) return null;

  return (
    <time dateTime={new Date(date).toISOString()}>{formattedDate}</time>
  );
};



// <DateDisplay date="2024-09-11T12:00:00Z" format="PPP" />
// <DateDisplay date="2024-09-11T12:00:00Z" format="HHmm" />
