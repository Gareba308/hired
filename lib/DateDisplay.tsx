import { formatInTimeZone } from 'date-fns-tz';

interface DateDisplayProps {
  date: Date;
  format: string;
}

export const DateDisplay = ({ date, format }: DateDisplayProps) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formattedDate = formatInTimeZone(new Date(date), userTimeZone, format);

  return (
    <time dateTime={new Date(date).toISOString()}>{formattedDate}</time>
  );
};



// <DateDisplay date="2024-09-11T12:00:00Z" format="PPP" />
// <DateDisplay date="2024-09-11T12:00:00Z" format="HHmm" />
