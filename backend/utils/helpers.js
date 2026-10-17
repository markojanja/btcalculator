// Shifts run from 23:00 to 23:00 Belgrade time, whatever the server's timezone.
const SHIFT_TIME_ZONE = "Europe/Belgrade";
const SHIFT_START_HOUR = 23;

// Wall-clock date and time of `date` in `timeZone`.
const getZonedParts = (date, timeZone) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  const get = (type) => Number(parts.find((part) => part.type === type).value);

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
  };
};

// How far `timeZone` is ahead of UTC at `date`, in milliseconds.
const getOffset = (date, timeZone) => {
  const p = getZonedParts(date, timeZone);
  const wallClockAsUtc = Date.UTC(
    p.year,
    p.month - 1,
    p.day,
    p.hour,
    p.minute,
    p.second,
  );
  return wallClockAsUtc - Math.floor(date.getTime() / 1000) * 1000;
};

// The instant at which the wall clock in `timeZone` shows the given time.
const zonedTimeToUtc = (year, month, day, hour, timeZone) => {
  const wallClockAsUtc = Date.UTC(year, month - 1, day, hour);
  // Near a DST change the offset at the result can differ from the offset at
  // the first guess, so take it again from the first estimate.
  const estimate =
    wallClockAsUtc - getOffset(new Date(wallClockAsUtc), timeZone);
  return new Date(wallClockAsUtc - getOffset(new Date(estimate), timeZone));
};

// Half-open [startOfDay, endOfDay) range of the shift containing `now`.
export const getShiftDayRange = (now = new Date()) => {
  const p = getZonedParts(now, SHIFT_TIME_ZONE);
  const startDayOffset = p.hour >= SHIFT_START_HOUR ? 0 : -1;

  const shiftBoundary = (dayOffset) => {
    const day = new Date(Date.UTC(p.year, p.month - 1, p.day + dayOffset));
    return zonedTimeToUtc(
      day.getUTCFullYear(),
      day.getUTCMonth() + 1,
      day.getUTCDate(),
      SHIFT_START_HOUR,
      SHIFT_TIME_ZONE,
    );
  };

  return {
    startOfDay: shiftBoundary(startDayOffset),
    endOfDay: shiftBoundary(startDayOffset + 1),
  };
};
