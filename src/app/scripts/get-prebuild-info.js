import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let lastUpdated = "";

function getWeekNumber(date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function getMondayOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));

  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, "0");
  const dayOfMonth = String(monday.getDate()).padStart(2, "0");

  return `${year}-${month}-${dayOfMonth}`;
}

try {
  const chartsPath = path.join(__dirname, "../../data/charts.json");

  const chartsContent = fs.readFileSync(chartsPath, "utf-8");
  const charts = JSON.parse(chartsContent);

  const currentDate = new Date();
  const weekNumber = getWeekNumber(currentDate);
  const mondayDate = getMondayOfWeek(currentDate);

  const TARGET_ID = "kt10";

  let foundChart = null;
  let foundDate = null;

  for (const dateKey in charts) {
    if (charts[dateKey].id === TARGET_ID) {
      foundChart = charts[dateKey];
      foundDate = dateKey;
      break;
    }
  }

  if (foundChart && foundDate) {
    foundChart.date = `Week #${weekNumber}`;

    if (foundDate !== mondayDate) {
      charts[mondayDate] = foundChart;

      delete charts[foundDate];

      console.log(`✓ Moved chart from ${foundDate} to ${mondayDate}`);
    } else {
      charts[mondayDate] = foundChart;
      console.log(`✓ Updated chart at ${mondayDate}`);
    }

    fs.writeFileSync(chartsPath, JSON.stringify(charts, null, 2));

    console.log(`✓ Updated charts.json: Week #${weekNumber}`);
  } else {
    console.log(`⚠ Chart with id '${TARGET_ID}' not found in any date node`);
  }
} catch (error) {
  console.error("Error updating charts.json:", error);
}

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
