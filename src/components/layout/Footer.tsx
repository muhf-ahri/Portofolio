import { GithubIcon } from "@/components/ui/BrandIcons";
import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="relative mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 lg:px-10">
      <div className="rule h-0.5" />

      <div className="flex flex-col items-center justify-between gap-4 pt-8 sm:flex-row">
        <p className="text-sm text-ink-soft">
          &copy; {new Date().getFullYear()} {profile.name}. Built with Next.js
          &amp; TypeScript.
        </p>
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`${profile.name} on GitHub`}
          className="press grid size-10 place-items-center rounded-[4px] border-2 border-ink bg-card text-ink"
        >
          <GithubIcon size={17} />
        </a>
      </div>
    </footer>
  );
}
