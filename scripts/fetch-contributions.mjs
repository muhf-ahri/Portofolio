// Fetches the GitHub contribution calendar once and writes it to
// src/data/contributions.json. Run it, commit the result:
//
//   node scripts/fetch-contributions.mjs
//
// Why a script instead of fetching at render time: the calendar only exists as
// an HTML fragment on github.com/users/:user/contributions — there is no
// public API for it. Scraping per request would be slow, fragile, and would
// break the static export. One fetch at authoring time keeps the site static
// and the numbers honest to whenever the file was last refreshed.

import { writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const USERNAME = "muhf-ahri";
const DAYS = 371; // 53 weeks + a day, so every column is a full week
const OUT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../src/data/contributions.json",
);

const iso = (d) => d.toISOString().slice(0, 10);
const now = new Date();
const from = new Date(now.getTime() - DAYS * 86400000);

const url = `https://github.com/users/${USERNAME}/contributions?from=${iso(from)}&to=${iso(now)}`;
const res = await fetch(url, {
  headers: { "User-Agent": "Mozilla/5.0 (contribution calendar fetch)" },
});
if (!res.ok) {
  console.error(`fetch failed: ${res.status} ${res.statusText}`);
  process.exit(1);
}
const html = await res.text();

// Each day cell carries the date and a 0-4 intensity bucket:
//   <td id="contribution-day-component-0-1" data-date="2026-01-04" data-level="0">
// Its tooltip is joined by the same id and holds the only exact count:
//   <tool-tip for="contribution-day-component-0-1">3 contributions on January 5th.</tool-tip>
const dayRe = /<td[^>]*id="contribution-day-component-\d+-\d+"[^>]*>/g;
const tipRe = /<tool-tip[^>]*for="contribution-day-component-\d+-\d+"[^>]*>([^<]*)<\/tool-tip>/g;

const tipById = new Map();
for (const m of html.matchAll(tipRe)) {
  const id = /for="([^"]+)"/.exec(m[0])[1];
  const count = Number(/(\d+) contribution/.exec(m[1])?.[1] ?? 0);
  tipById.set(id, count);
}

const days = [];
for (const m of html.matchAll(dayRe)) {
  const tag = m[0];
  const id = /id="([^"]+)"/.exec(tag)[1];
  const date = /data-date="([^"]+)"/.exec(tag)[1];
  const level = Number(/data-level="(\d)"/.exec(tag)[1]);
  days.push({ date, level, count: tipById.get(id) ?? 0 });
}

days.sort((a, b) => a.date.localeCompare(b.date));

// The endpoint ignores from/to and always returns the whole calendar year, so
// it includes days that have not happened yet. Drop them: a phantom trailing
// day would break the current-streak count and draw empty cells to the right.
const today = iso(now);
const past = days.filter((d) => d.date <= today);
days.length = 0;
days.push(...past);

/* --------------------------- derived stats ------------------------------ */

const totalContributions = days.reduce((sum, d) => sum + d.count, 0);
const activeDays = days.filter((d) => d.count > 0).length;

// A streak tolerates a gap on the final day: if today is still empty the run
// is counted back through yesterday, matching GitHub's own behaviour.
let currentStreak = 0;
const tail = days[days.length - 1]?.count === 0 ? days.slice(0, -1) : days;
for (let i = tail.length - 1; i >= 0; i--) {
  if (tail[i].count === 0) break;
  currentStreak++;
}

let longestStreak = 0;
let run = 0;
for (const d of days) {
  run = d.count > 0 ? run + 1 : 0;
  longestStreak = Math.max(longestStreak, run);
}

const payload = {
  username: USERNAME,
  fetchedAt: now.toISOString(),
  stats: { totalContributions, activeDays, currentStreak, longestStreak },
  days,
};

await writeFile(OUT, JSON.stringify(payload) + "\n", "utf8");
console.log(`wrote ${days.length} days -> ${OUT}`);
console.log(
  `total=${totalContributions} activeDays=${activeDays} ` +
    `currentStreak=${currentStreak} longestStreak=${longestStreak}`,
);