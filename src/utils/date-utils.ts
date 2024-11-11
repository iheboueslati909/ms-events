import { getUnixTime, millisecondsToSeconds } from 'date-fns';

export const toTimestamp = (date: Date) => ({
  seconds: getUnixTime(date),
  nanos: date.getMilliseconds() * 1_000_000, // Convert milliseconds to nanoseconds
});
