import { useEffect, useState } from "react";
import { formatInTimeZone } from "date-fns-tz";

interface DateDisplayProps {
  date: string | Date;
  format: string;
}

export const DateDisplay = ({ date, format }: DateDisplayProps) => {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const formatted = formatInTimeZone(dateObj, userTimeZone, format);
    setFormattedDate(formatted);
  }, [date, format]);

  if (!formattedDate) return null;

  return (
    <time dateTime={new Date(date).toISOString()}>{formattedDate}</time>
  );
};



// <DateDisplay date="2024-09-11T12:00:00Z" format="PPP" />
// <DateDisplay date="2024-09-11T12:00:00Z" format="HHmm" />
