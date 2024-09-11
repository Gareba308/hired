"use client";

import { useSyncExternalStore } from "react";
import { format } from "date-fns";

type DateDisplayProps = {
  date: Date;
  formatString: string;
};

const dummyStore = () => () => {};

export function DateDisplay({ date, formatString }: DateDisplayProps) {
  const display = useSyncExternalStore(
    dummyStore,
    () => format(new Date(date), formatString),
    () => new Date(date).toISOString() 
  );

  return (
    <time dateTime={new Date(date).toISOString()}>{display}</time>
  );
}




// <DateDisplay date="2024-09-11T12:00:00Z" format="PPP" />
// <DateDisplay date="2024-09-11T12:00:00Z" format="HHmm" />
