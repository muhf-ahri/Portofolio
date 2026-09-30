"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { profile, navLinks } from "@/data/profile";
import { cx } from "@/lib/cx";
import { EASE } from "@/lib/motion";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("home");
  const [hidden, setHidden] = useState(false);

  // Hide the bar while scrolling down, bring it back on scroll up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY && y > 96 && !open) setHidden(true);
      else if (y < lastY) setHidden(false);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

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

  // Lock the page and close on Escape while the nav is open.
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
    <motion.header
      initial={false}
      animate={{ y: hidden && !open ? "-120%" : 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5 lg:px-10"
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
        {/* Name card: its own floating card, separate from the nav. */}
        <a
          href="#home"
          className="press card flex items-center rounded-[6px] px-4 py-2.5"
        >
          <span className="font-display text-base leading-none font-bold tracking-tight text-ink sm:text-lg">
            {profile.name}
          </span>
        </a>

        {/* Nav cluster: the link row lives at the button's own level and grows
            out of it to the left, so opening feels like the menu unfolding. */}
        <div className="relative flex items-center justify-end gap-2">
          <AnimatePresence>
            {open ? (
              <motion.nav
                id="site-nav"
                aria-label="Utama"
                initial={{ opacity: 0, scaleX: 0.4, scaleY: 0.6, x: 12 }}
                animate={{ opacity: 1, scaleX: 1, scaleY: 1, x: 0 }}
                exit={{ opacity: 0, scaleX: 0.6, scaleY: 0.8, x: 12 }}
                transition={{ duration: 0.32, ease: EASE }}
                style={{ transformOrigin: "right center" }}
                className="card shadow-hard-sm flex rounded-[6px] p-1.5"
              >
                <ul className="flex flex-wrap items-center justify-end gap-1 md:flex-nowrap md:gap-1">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.id}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.22, ease: EASE, delay: index * 0.04 }}
                    >
                      <a
                        href={`#${link.id}`}
                        onClick={() => setOpen(false)}
                        aria-current={active === link.id ? "true" : undefined}
                        className={cx(
                          "block whitespace-nowrap rounded-[4px] border-2 px-3 py-2 text-sm transition-colors duration-150",
                          active === link.id
                            ? "border-ink bg-ink text-paper"
                            : "border-transparent text-ink-soft hover:border-ink hover:text-ink",
                        )}
                      >
                        {link.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.nav>
            ) : null}
          </AnimatePresence>

          {/* Menu / Close: swaps its label and icon, and anchors the nav. */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="site-nav"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="press card relative z-10 flex items-center gap-2 rounded-[6px] px-4 py-2.5 font-mono text-sm tracking-[0.14em] text-ink uppercase"
          >
            {open ? (
              <>
                Close
                <X size={16} aria-hidden="true" />
              </>
            ) : (
              <>
                Menu
                <Menu size={16} aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.header>
  );
}