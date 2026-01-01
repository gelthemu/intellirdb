const FORMAT_TIMESTAMP = (timestamp: number): string => {
  const now = new Date();

  const inputDate = new Date(timestamp);

  const ugandaOptions = { timeZone: "Africa/Kampala" };

  const ugandaNowStr = now.toLocaleString("en-US", ugandaOptions);
  const ugandaInputStr = inputDate.toLocaleString("en-US", ugandaOptions);

  const ugandaNow = new Date(ugandaNowStr);
  const ugandaInput = new Date(ugandaInputStr);

  const ugandaMidnightToday = new Date(ugandaNow);
  ugandaMidnightToday.setHours(0, 0, 0, 0);

  const ugandaMidnightYesterday = new Date(ugandaMidnightToday);
  ugandaMidnightYesterday.setDate(ugandaMidnightYesterday.getDate() - 1);

  const second = 1000;
  const minute = 60 * second;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const year = 365.25 * day;

  if (ugandaInput >= ugandaMidnightToday) {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "Africa/Kampala",
    }).format(inputDate);
  } else if (ugandaInput >= ugandaMidnightYesterday) {
    return "yesterday";
  } else {
    const diff = ugandaNow.getTime() - ugandaInput.getTime();

    if (diff < week) {
      const daysAgo = Math.floor(diff / day);
      return `${daysAgo}d ago`;
    } else if (diff < 52 * week) {
      const weeksAgo = Math.floor(diff / week);
      return `${weeksAgo}wk ago`;
    } else if (diff < 20 * year) {
      const yearsAgo = Math.floor(diff / year);
      return `${yearsAgo}yr ago`;
    } else {
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "Africa/Kampala",
      }).format(inputDate);

      const [month, day, year] = formattedDate.split("/");
      return `${day}.${month}.${year.replace(",", "")}`;
    }
  }
};

export { FORMAT_TIMESTAMP };
