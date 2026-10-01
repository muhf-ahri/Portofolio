import { CalendarDays, Flame, GitCommitVertical, Target } from "lucide-react";

import CountUp from "@/components/ui/CountUp";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import contributions from "@/data/contributions.json";

type Day = { date: string; level: number; count: number };

// Empty days sit nearly flush with the card so the filled ones read as
  // marks rather than noise; the four active steps climb from a faint olive to
  // solid. GitHub uses the same five-bucket idea, just in green.
const LEVELS: Record<number, string> = {
    0: "bg-ink/[0.07]",
    1: "bg-olive/30",
    2: "bg-olive/55",
    3: "bg-olive/80",
    4: "bg-olive",
  };

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function tooltip(day: Day) {
  const date = new Date(`${day.date}T00:00:00`);
  const label = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  if (day.count === 0) return `Tidak ada kontribusi pada ${label}`;
  return `${day.count} kontribusi pada ${label}`;
}

/**
 * GitHub contribution calendar, rendered from a snapshot so the page stays
 * static. Refresh it with `node scripts/fetch-contributions.mjs`.
 *
 * GitHub's own green ramp is swapped for the site's olive so the grid reads as
 * part of the palette instead of an embedded widget.
 */
export function Contributions() {
  const days = contributions.days as Day[];
  const stats = contributions.stats;
  const username = contributions.username;

  // GitHub weeks start on Sunday, so the first cell is offset by its weekday
  // or every row would be shifted one day.
  const offset = new Date(`${days[0].date}T00:00:00`).getDay();

  // Bucket the days into week columns. Both the grid and the month labels are
  // then driven by the same column list, so a label can never drift out of
  // step with the week it names.
  const weeks: (Day | null)[][] = [];
  let week: (Day | null)[] = Array.from({ length: offset }, () => null);
  for (const day of days) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) weeks.push([...week, ...Array.from({ length: 7 - week.length }, () => null)]);

  // A month is labelled on the column holding its first day, and only when
  // that day starts a new week — otherwise labels collide and stack.
  const monthLabels = weeks.map((column) => {
    const first = column.find((day) => day !== null);
    if (!first) return "";
    const date = new Date(`${first.date}T00:00:00`);
    return date.getDate() <= 7 ? MONTHS[date.getMonth()] : "";
  });

  const tiles = [
    { icon: GitCommitVertical, label: "Total Kontribusi", value: stats.totalContributions },
    { icon: Target, label: "Hari Aktif", value: stats.activeDays },
    { icon: Flame, label: "Streak Berjalan", value: stats.currentStreak },
    { icon: CalendarDays, label: "Streak Terpanjang", value: stats.longestStreak },
  ];

  return (
    <SectionShell id="contributions">
      <SectionHeading
        id="contributions-heading"
        eyebrow="GitHub"
        title="Aktivitas Kontribusi"
        description={`Kalender kontribusi publik untuk @${username}, diperbarui ${new Date(contributions.fetchedAt).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}.`}
      />

      <Reveal>
        <div className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map(({ icon: Icon, label, value }) => (
            <Card
              key={label}
              interactive
              className="group flex flex-col gap-1 px-4 py-3.5"
            >
              <span className="flex items-center gap-1.5 text-[0.7rem] leading-tight text-ink-soft transition-colors duration-150 group-hover:text-ink">
                <Icon size={13} aria-hidden="true" />
                {label}
              </span>
              <CountUp
                to={value}
                duration={1.4}
                minIntegerDigits={2}
                className="font-display text-2xl leading-none font-bold tracking-tight text-rust transition-colors duration-150 group-hover:text-rust-bright sm:text-3xl"
              />
            </Card>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <Card className="mt-4 overflow-hidden p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink pb-3">
            <span className="font-mono text-[0.65rem] tracking-[0.2em] text-rust uppercase">
              {days.length} Hari Terakhir
            </span>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noreferrer noopener"
              className="press-lift rounded-[4px] border border-ink bg-card px-3 py-1 font-mono text-[0.65rem] tracking-[0.14em] text-ink uppercase transition-colors duration-150 hover:border-rust"
            >
              @{username}
            </a>
          </div>

          <div className="mt-4 overflow-x-auto pb-1">
            <div className="min-w-max">
              <div className="flex gap-1 pl-11" aria-hidden="true">
                {monthLabels.map((label, i) => (
                  <span
                    key={i}
                    className="w-3 font-mono text-[0.55rem] leading-none whitespace-nowrap text-ink-soft"
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="mt-1.5 flex gap-1">
                <div
                  className="grid w-10 shrink-0 grid-rows-7 gap-1"
                  aria-hidden="true"
                >
                  {DAY_LABELS.map((label, i) => (
                    <span
                      key={label}
                      className="flex items-center font-mono text-[0.55rem] leading-none text-ink-soft"
                    >
                      {i % 2 === 1 ? label : ""}
                    </span>
                  ))}
                </div>

                <div className="flex gap-1" role="img" aria-label={`Kalender kontribusi GitHub untuk ${username}: ${stats.totalContributions} kontribusi dalam ${days.length} hari terakhir.`}>
                  {weeks.map((column, ci) => (
                    <div key={ci} className="grid w-3 grid-rows-7 gap-1">
                      {column.map((day, di) =>
                        day === null ? (
                          <span key={`pad-${di}`} aria-hidden="true" />
                        ) : (
                          <span
                            key={day.date}
                            title={tooltip(day)}
                            className={`size-3 rounded-[2px] border border-ink/25 ${LEVELS[day.level] ?? LEVELS[0]}`}
                          />
                        ),
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1.5">
            <span className="mr-1 font-mono text-[0.55rem] tracking-[0.14em] text-ink-soft uppercase">
              Sedikit
            </span>
            {[0, 1, 2, 3, 4].map((level) => (
              <span
                key={level}
                className={`size-3 rounded-[2px] border border-ink/25 ${LEVELS[level]}`}
              />
            ))}
            <span className="ml-1 font-mono text-[0.55rem] tracking-[0.14em] text-ink-soft uppercase">
              Banyak
            </span>
          </div>
        </Card>
      </Reveal>
    </SectionShell>
  );
}