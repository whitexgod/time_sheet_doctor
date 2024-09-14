import { toZonedTime, format } from "date-fns-tz";

export default function convertUtcToTimeZone(
  utcDateStr: string,
  timeZone: string
) {
  // Convert the UTC string to a JavaScript Date object
  const utcDate = new Date(utcDateStr);

  // Convert the UTC date to the target time zone
  const zonedDate = toZonedTime(utcDate, timeZone);

  // Format the date in the target time zone
  const pattern = "yyyy-MM-dd HH:mm";
  const output = format(zonedDate, pattern, { timeZone });

  return output;
}
