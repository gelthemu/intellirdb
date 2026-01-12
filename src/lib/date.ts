export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Africa/Kampala",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(date);

    const month = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;
    const year = parts.find((p) => p.type === "year")?.value;
    const hour = parts.find((p) => p.type === "hour")?.value;
    const minute = parts.find((p) => p.type === "minute")?.value;

    if (month && day && year && hour && minute) {
      return `${month} ${day}, ${year} at ${hour}:${minute}`;
    } else {
      return dateString;
    }
  }
  return dateString;
};
