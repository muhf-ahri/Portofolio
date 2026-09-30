import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Rotating statement band. Sits between sections to break the rhythm —
 * oversized display type instead of another grid of cards.
 */
export function Manifesto() {
  return (
    <section
      aria-labelledby="manifesto-heading"
      className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10"
    >
      <Reveal>
        <Card className="overflow-hidden p-8 sm:p-12 lg:p-16">
          <p
            id="manifesto-heading"
            className="font-mono text-[0.7rem] tracking-[0.24em] text-rust uppercase"
          >
            Filosofi
          </p>

          <p className="mt-6 max-w-4xl text-2xl leading-[1.25] font-semibold tracking-tight text-balance text-ink sm:text-3xl lg:text-[2.5rem] lg:leading-[1.2]">
            Saya membangun untuk orang di seberang layar —{" "}
            <span className="text-rust">
              antarmuka yang jelas, kode yang jujur, dan sistem yang bertahan
              lama setelah diserahterimakan.
            </span>
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            {["Aksesibel sejak awal", "Pola pikir database-first", "Kirim, lalu perbaiki"].map(
              (item) => (
                <span
                  key={item}
                  className="flex items-center gap-2 text-sm text-ink-soft"
                >
                  <span aria-hidden="true" className="size-2 bg-olive" />
                  {item}
                </span>
              ),
            )}
          </div>
        </Card>
      </Reveal>
    </section>
  );
}
