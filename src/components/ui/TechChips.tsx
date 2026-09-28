import { cx } from "@/lib/cx";

/** Flat outlined tags — a keyline, no fill, no blur. */
export function TechChips({
  items,
  className,
}: {
  items: readonly string[];
  className?: string;
}) {
  return (
    <ul className={cx("flex flex-wrap gap-1.5", className)}>
      {items.map((item) => (
        <li
          key={item}
          className="rounded-[3px] border border-line-soft bg-paper-2/50 px-2.5 py-1 font-mono text-[0.68rem] tracking-wide text-ink-soft"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
