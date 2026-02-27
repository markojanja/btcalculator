export const getShiftDayRange = () => {
  const now = new Date();

  // Create start at 23:01 Belgrade local
  const start = new Date(now);
  start.setHours(23, 1, 0, 0);

  // If start is in the future (before 23:01 today), shift back a day
  if (now < start) start.setDate(start.getDate() - 1);

  // End is next day at 23:00 local
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  end.setHours(23, 0, 0, 0);

  // Convert to UTC for Prisma/Postgres
  const startUTC = new Date(
    start.getTime() - start.getTimezoneOffset() * 60 * 1000,
  );
  const endUTC = new Date(end.getTime() - end.getTimezoneOffset() * 60 * 1000);

  return { startOfDay: startUTC, endOfDay: endUTC };
};
