"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import Typography from "@/components/utils/Typography";
import DeveloperIntro from "./About/DeveloperIntro";
import SkillsDetail from "./About/SkillsDetail";

type View = "intro" | "skills";

/** The three beats of the section, surfaced as a quiet progress marker. */
const STORY: { label: string; activeOn: View }[] = [
  { label: "Profile", activeOn: "intro" },
  { label: "Explore", activeOn: "intro" },
  { label: "Capabilities", activeOn: "skills" },
];

const Aboutsection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [view, setView] = useState<View>("intro");
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = Boolean(prefersReducedMotion);

  const goTo = useCallback(
    (next: View) => {
      setView(next);
      sectionRef.current?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    },
    [reduceMotion],
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About and developer skills"
      data-theme-surface
      className="ambient-field relative isolate overflow-hidden bg-surface text-content">
      {/* Hairline seam where the hero's light falls off into this section. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-line"
      />
      <div className="mx-auto w-full max-w-[1800px] px-6 py-20 sm:px-8 md:px-16 md:py-28 2xl:px-26 2xl:py-32">
        {/* Section header */}
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6 md:mb-20">
          <div>
            <Typography variant="overline" className="text-content-subtle">
              About
            </Typography>
            <span aria-hidden className="mt-4 block h-1 w-10 bg-accent" />
          </div>

          {/* PROFILE -> EXPLORE -> CAPABILITIES */}
          <ol
            aria-hidden
            className="flex items-center gap-3 font-mono text-[10px] tracking-[0.22em] uppercase 2xl:text-[11px]">
            {STORY.map((step, index) => (
              <li key={step.label} className="flex items-center gap-3">
                {index > 0 && (
                  <span className="text-content/25">&#8594;</span>
                )}
                <span
                  className={clsx(
                    "transition-colors duration-500",
                    step.activeOn === view
                      ? "text-accent"
                      : "text-content-subtle",
                  )}>
                  {step.label}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* The section morphs its own height between the two views */}
        <motion.div
          layout={!reduceMotion}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <AnimatePresence mode="popLayout" initial={false}>
            {view === "intro" ? (
              <DeveloperIntro
                key="intro"
                reduceMotion={reduceMotion}
                onExplore={() => goTo("skills")}
              />
            ) : (
              <SkillsDetail
                key="skills"
                reduceMotion={reduceMotion}
                onBack={() => goTo("intro")}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Aboutsection;
