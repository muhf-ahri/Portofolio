"use client";

import { AnimatePresence, motion, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { profile, navLinks } from "@/data/profile";
import { cx } from "@/lib/cx";
import { EASE } from "@/lib/motion";

export function Navbar() {
  const { scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // One observer for every section beats six scroll handlers.
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.2, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Lock the page and close on Escape while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cx(
          "border-b-2 border-ink bg-paper transition-shadow duration-200",
          scrolled || open ? "shadow-hard-sm" : "shadow-none",
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:h-[4.5rem] sm:px-8 lg:px-10"
        >
          <a
            href="#home"
            className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight"
          >
            <span className="grid size-8 place-items-center rounded-[4px] border-2 border-ink bg-ochre font-mono text-[0.7rem] text-ink transition-transform duration-150 group-hover:-rotate-3">
              {profile.initials}
            </span>
            <span className="text-ink">{profile.name}</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={active === link.id ? "true" : undefined}
                  className={cx(
                    "block rounded-[3px] border-2 px-3.5 py-1.5 text-sm transition-colors duration-150",
                    active === link.id
                      ? "border-ink bg-ink text-paper"
                      : "border-transparent text-ink-soft hover:border-ink hover:text-ink",
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="press grid size-10 place-items-center rounded-[4px] border-2 border-ink bg-card text-ink md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
      </div>

      {/* Scroll progress reads as a printed rule, not a neon bar. */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: scrollYProgress }}
        className="h-1 origin-left bg-rust"
      />

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="border-b-2 border-ink bg-paper-2 md:hidden"
          >
            <ul className="mx-auto flex w-full max-w-6xl flex-col gap-1.5 px-5 py-5 sm:px-8">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, ease: EASE, delay: index * 0.04 }}
                >
                  <a
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active === link.id ? "true" : undefined}
                    className={cx(
                      "flex items-center justify-between rounded-[4px] border-2 px-4 py-2.5 text-base transition-colors duration-150",
                      active === link.id
                        ? "border-ink bg-ink text-paper"
                        : "border-ink-soft/30 text-ink-soft hover:border-ink hover:text-ink",
                    )}
                  >
                    {link.label}
                    <span className="font-mono text-[0.65rem] opacity-60">
                      0{index + 1}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
