import { formatInTimeZone } from "date-fns-tz";
import { FC } from "react";

type DateDisplayProps = {
  date: Date;
  formatString: string;
  useLocalTimeZone?: boolean;
};

const DateDisplay: FC<DateDisplayProps> = ({
  date,
  formatString,
  useLocalTimeZone = false,
}) => {
  const timeZone = useLocalTimeZone
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : "Africa/Nairobi";

  const formattedDate = formatInTimeZone(date, timeZone, formatString);
  return <time dateTime={date.toISOString()}>{formattedDate}</time>;
};

export default DateDisplay;
