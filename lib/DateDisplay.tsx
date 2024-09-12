import { DateTime } from 'luxon';
import { format } from 'date-fns';
import { FC } from 'react';

type DateDisplayProps = {
  date: Date;
  formatString: string;
};
const DateDisplay: FC<DateDisplayProps> = ({ date, formatString }) => {
  const dt = DateTime.fromJSDate(date).setZone('local');
  const jsDate = dt.toJSDate();
  const formattedDate = format(jsDate, formatString);
  const isoString = dt.toISO() ?? undefined;

  return <time dateTime={isoString}>{formattedDate}</time>;
};

export default DateDisplay;
