import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let lastUpdated = "";

try {
  const date = new Date();
  if (!isNaN(date.getTime())) {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Africa/Kampala",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(date);

    const month = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;
    const year = parts.find((p) => p.type === "year")?.value;
    const hour = parts.find((p) => p.type === "hour")?.value;
    const minute = parts.find((p) => p.type === "minute")?.value;
    const second = parts.find((p) => p.type === "second")?.value;

    if (month && day && year && hour && minute && second) {
      lastUpdated = `${month} ${day}, ${year} at ${hour}:${minute}:${second}`;
    }
  }
} catch (error) {
  console.error(error);
}

const data = {
  "last-updated": lastUpdated,
  timestamp: Date.now(),
};

const content = JSON.stringify(data, null, 2);

const outputPath = path.join(__dirname, "../../data/webapp-info.json");

fs.writeFileSync(outputPath, content);

console.log("✓ Last Updated:", data["last-updated"]);
