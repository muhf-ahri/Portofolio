import { Reveal } from "@/components/ui/Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  id: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  id,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={
        align === "center"
          ? "mx-auto flex max-w-2xl flex-col items-center text-center"
          : "flex max-w-2xl flex-col items-start"
      }
    >
      <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.24em] text-rust uppercase">
        <span aria-hidden="true" className="h-px w-6 bg-rust" />
        {eyebrow}
      </span>
      <h2
        id={id}
        className="mt-4 text-3xl font-semibold tracking-tight text-balance text-ink sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-pretty text-ink-soft sm:text-[1.0625rem]">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
