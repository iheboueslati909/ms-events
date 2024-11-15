import { BadRequestException } from '@nestjs/common';
import { getUnixTime, isValid, millisecondsToSeconds, parseISO } from 'date-fns';

export const toTimestamp = (date: Date) => ({
  seconds: getUnixTime(date),
  nanos: date.getMilliseconds() * 1_000_000, // Convert milliseconds to nanoseconds
});

export const validateAndParseDates = (dateStart: string, dateEnd: string)=> {
  const start = new Date(dateStart);
  const end = new Date(dateEnd);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
    throw new BadRequestException('Invalid date format or range');
  }
  return { start, end };
}