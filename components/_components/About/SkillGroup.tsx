"use client";

import clsx from "clsx";
import { motion, type Variants } from "framer-motion";
import type { SkillGroupData } from "./skills.data";

type SkillGroupProps = {
  group: SkillGroupData;
  index: number;
  reduceMotion: boolean;
};

const groupVariants = (reduceMotion: boolean): Variants => ({
  hidden: { opacity: 0, y: reduceMotion ? 0 : 22, scale: reduceMotion ? 1 : 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] },
  },
});

const SkillGroup = ({ group, index, reduceMotion }: SkillGroupProps) => {
  const isPrimary = group.tier === "primary";

  return (
    <motion.article
      variants={groupVariants(reduceMotion)}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className={clsx(
        "group/skillgroup panel-flat rounded-xl border border-line p-6 transition-shadow duration-500 ease-out-depth hover:shadow-elev-2 2xl:p-7",
        group.span,
      )}>
      {/* Group header: index — title — hairline — count */}
      <header className="flex items-baseline gap-4">
        <span
          aria-hidden
          className="font-mono text-[11px] text-accent tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>

        <h3
          className={clsx(
            "font-mono tracking-[0.18em] text-content uppercase",
            isPrimary ? "text-sm 2xl:text-base" : "text-xs 2xl:text-sm",
          )}>
          {group.title}
        </h3>

        <span
          aria-hidden
          className="h-px min-w-6 flex-1 bg-line transition-colors duration-500 group-hover/skillgroup:bg-accent"
        />

        <span className="font-mono text-[11px] text-content-subtle tabular-nums">
          {group.skills.length}
        </span>
      </header>

      {/* Skills as an editorial text run, not badges */}
      <ul
        className={clsx(
          "mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-2.5",
          isPrimary
            ? "text-base text-content 2xl:text-lg"
            : "text-sm text-content-muted 2xl:text-base",
        )}>
        {group.skills.map((skill, skillIndex) => (
          <li key={`${group.id}-${skill}`} className="flex items-center gap-2.5">
            {skillIndex > 0 && (
              <span aria-hidden className="text-content/25 select-none">
                &middot;
              </span>
            )}
            <span className="cursor-default decoration-accent decoration-1 underline-offset-4 transition-colors duration-300 hover:text-content hover:underline">
              {skill}
            </span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
};

export default SkillGroup;
