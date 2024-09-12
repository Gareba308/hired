import { DateTime } from 'luxon';
import { FC } from 'react';

type DateDisplayProps = {
  date: Date;
  formatString: string;
};

const DateDisplay: FC<DateDisplayProps> = ({ date, formatString }) => {
  const dt = DateTime.fromJSDate(date).setZone('local');
  const formattedDate = dt.toFormat(formatString);
  const isoString = dt.toISO() ?? undefined;

  return <time dateTime={isoString}>{formattedDate}</time>;
};

export default DateDisplay;