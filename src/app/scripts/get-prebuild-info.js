import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXTERNAL_CHART_URLS = [
  "https://assets.cfmpulse.com/intellirdb/charts/kt10-2025.json",
  "https://assets.cfmpulse.com/intellirdb/charts/at40-2025.json",
  "https://assets.cfmpulse.com/intellirdb/charts/kt10-2024.json",
  "https://assets.cfmpulse.com/intellirdb/charts/at40-2024.json",
  "https://assets.cfmpulse.com/intellirdb/charts/at40-with-casey.json",
];

const TARGET_ID = "kt10";

let lastUpdated = "";

function getWeekNumber(date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
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

async function fetchExternalCharts() {
  const allExternalCharts = {};

  for (const url of EXTERNAL_CHART_URLS) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        continue;
      }

      const chartData = await response.json();

      for (const key in chartData) {
        if (chartData[key].id) {
          console.log(`✓ Fetched ${chartData[key].id}`);
          break;
        }
      }

      Object.assign(allExternalCharts, chartData);
    } catch (error) {
      console.error(`❌ Error fetching ${url}:`, error.message, "\n\n");
    }
  }

  console.log(
    `✓ ${Object.keys(allExternalCharts).length} external chart entries fetched: \n\n`,
  );
  return allExternalCharts;
}

function mergeCharts(localCharts, externalCharts) {
  if (!externalCharts || Object.keys(externalCharts).length === 0) {
    console.log("⚠ No external charts to merge \n\n");
    return localCharts;
  }

  const merged = { ...localCharts };
  let addedCount = 0;
  let skippedCount = 0;

  const localEntries = new Map();
  for (const [dateKey, chart] of Object.entries(localCharts)) {
    const key = `${chart.id}-${dateKey}`;
    localEntries.set(key, true);
  }

  for (const [dateKey, chart] of Object.entries(externalCharts)) {
    const key = `${chart.id}-${dateKey}`;

    if (!localEntries.has(key)) {
      merged[dateKey] = chart;
      addedCount++;
    } else {
      skippedCount++;
    }
  }

  console.log(
    `✓ Merge complete: ${addedCount} added, ${skippedCount} skipped (already exist) \n\n`,
  );
  return merged;
}

async function main() {
  try {
    const chartsPath = path.join(__dirname, "../../data/charts.json");

    let charts = {};
    try {
      const chartsContent = fs.readFileSync(chartsPath, "utf-8");
      charts = JSON.parse(chartsContent);
      console.log(
        `✓ Loaded ${Object.keys(charts).length} local chart entries \n\n`,
      );
    } catch (error) {
      console.log("⚠ No existing charts.json found, starting fresh \n\n");
    }

    const externalCharts = await fetchExternalCharts();
    charts = mergeCharts(charts, externalCharts);

    const currentDate = new Date();
    const weekNumber = getWeekNumber(currentDate);
    const mondayDate = getMondayOfWeek(currentDate);

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
        console.log(`✓ Moved chart from ${foundDate} to ${mondayDate} \n\n`);
      } else {
        charts[mondayDate] = foundChart;
        console.log(`✓ Updated chart at ${mondayDate} \n\n`);
      }

      console.log(`✓ Updated ${TARGET_ID}: Week #${weekNumber} \n\n`);
    } else {
      console.log(
        `⚠ Chart with id '${TARGET_ID}' not found in any date node \n\n`,
      );
    }

    fs.writeFileSync(chartsPath, JSON.stringify(charts, null, 2));
    console.log(
      `✓ Saved charts.json with ${Object.keys(charts).length} total entries \n\n`,
    );
  } catch (error) {
    console.error("❌ Error updating charts.json:", error, "\n\n");
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
    console.error(error, "\n\n");
  }

  const data = {
    "last-updated": lastUpdated,
    timestamp: Date.now(),
  };

  const content = JSON.stringify(data, null, 2);
  const outputPath = path.join(__dirname, "../../data/webapp-info.json");
  fs.writeFileSync(outputPath, content);

  console.log("✓ Last Updated:", data["last-updated"], "\n\n");
}

main();
