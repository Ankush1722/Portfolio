"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import Typography from "@/components/utils/Typography";
import devImage from "@/public/image.png";
import { usePointerTilt } from "@/components/utils/usePointerTilt";
import {
  CORE_AREA_COUNT,
  PRIMARY_STACK,
  TECHNOLOGY_COUNT,
} from "./skills.data";

type DeveloperIntroProps = {
  onExplore: () => void;
  reduceMotion: boolean;
};

/** One raised figure in the breadth indicator. */
const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="panel-flat flex-1 rounded-lg border border-line px-5 py-4 transition-[transform,box-shadow] duration-500 ease-out-depth hover:-translate-y-1 hover:shadow-elev-2">
    <dt className="font-mono text-[11px] tracking-[0.22em] text-content-subtle uppercase">
      {label}
    </dt>
    <dd className="mt-2 text-3xl font-semibold text-content tabular-nums 2xl:text-4xl">
      {value}
    </dd>
  </div>
);

const DeveloperIntro = ({ onExplore, reduceMotion }: DeveloperIntroProps) => {
  const { tiltProps, enabled: tiltEnabled } = usePointerTilt({
    maxTilt: 7,
    lift: 18,
  });

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.08,
        delayChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: reduceMotion ? 0 : 0.25, ease: "easeIn" },
    },
  };

  // Items rise *and* come forward, so the section assembles in depth rather
  // than simply sliding up.
  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24, scale: reduceMotion ? 1 : 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: reduceMotion ? 0 : 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      exit="exit"
      viewport={{ once: true, amount: 0.15 }}
      className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[clamp(280px,26vw,460px)_minmax(0,1fr)] lg:gap-x-16 2xl:gap-x-20">
      {/* ---------------- LEFT — the image as the entry point ---------------- */}
      <motion.div variants={item} className="stage">
        <motion.div {...tiltProps} className="preserve-3d">
          <button
            type="button"
            onClick={onExplore}
            aria-label={`Explore ${TECHNOLOGY_COUNT} technologies across ${CORE_AREA_COUNT} core areas`}
            className="group preserve-3d relative block w-full max-w-md cursor-pointer text-left focus:outline-none lg:max-w-none">
            {/* Hairline frame, pushed behind the plate so the gap between them
                is real parallax rather than a painted offset. */}
            <span
              aria-hidden
              className="pointer-events-none absolute -right-3 -bottom-3 h-full w-full rounded-sm border border-line transition-transform duration-500 ease-out-depth group-hover:translate-x-1.5 group-hover:translate-y-1.5"
              style={tiltEnabled ? { transform: "translateZ(-38px)" } : undefined}
            />

            <span
              className="relative block overflow-hidden rounded-sm border border-line-strong bg-surface-raised shadow-elev-2 transition-[transform,box-shadow] duration-500 ease-out-depth group-hover:shadow-elev-3 group-focus-visible:shadow-elev-3 motion-reduce:transform-none"
              style={tiltEnabled ? { transform: "translateZ(0px)" } : undefined}>
              <Image
                src={devImage}
                alt="Satyam, Frontend and Full Stack developer"
                placeholder="blur"
                sizes="(max-width: 1024px) 90vw, (max-width: 1770px) 26vw, 460px"
                className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
              />

              {/* Scrim + label revealed on hover / keyboard focus */}
              <span
                aria-hidden
                className="absolute inset-0 flex items-end justify-center bg-linear-to-t from-surface/90 via-surface/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="mb-8 inline-flex items-center gap-2 rounded-sm border border-line-strong bg-surface-glass px-4 py-2 font-mono text-[11px] tracking-[0.22em] text-content uppercase shadow-elev-2 backdrop-blur-md">
                  Explore skills
                  <span className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none">
                    &#8599;
                  </span>
                </span>
              </span>
            </span>

            {/* Persistent, quiet affordance */}
            <span className="mt-5 flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-content-subtle uppercase transition-colors duration-300 group-hover:text-content group-focus-visible:text-content">
              <span
                aria-hidden
                className="h-px w-8 bg-content-subtle transition-all duration-500 group-hover:w-12 group-hover:bg-accent"
              />
              Click to explore
            </span>
          </button>
        </motion.div>
      </motion.div>

      {/* ---------------- RIGHT — the concise developer summary ---------------- */}
      <div className="max-w-4xl">
        <motion.div variants={item}>
          <Typography as="h2" variant="h2" className="text-content uppercase">
            Satyam
          </Typography>
        </motion.div>

        <motion.div variants={item} className="mt-3 flex items-center gap-4">
          <span aria-hidden className="h-px w-10 bg-accent" />
          <Typography variant="subtitle" className="text-content-muted">
            Frontend / Full Stack Developer
          </Typography>
        </motion.div>

        <motion.div variants={item} className="mt-8 max-w-2xl">
          <Typography variant="body" className="text-content-muted">
            Building modern, performant and scalable web experiences with React,
            Next.js, TypeScript, APIs and AI-assisted development.
          </Typography>
        </motion.div>

        {/* Compact technology line — a preview, not the full list */}
        <motion.ul
          variants={item}
          className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-sm text-content-muted 2xl:text-base">
          {PRIMARY_STACK.map((tech, index) => (
            <li key={tech} className="flex items-center gap-3">
              {index > 0 && (
                <span aria-hidden className="text-content/30">
                  &middot;
                </span>
              )}
              <span>{tech}</span>
            </li>
          ))}
        </motion.ul>

        {/* Breadth indicator */}
        <motion.dl
          variants={item}
          className="mt-12 flex flex-wrap gap-4 sm:flex-nowrap sm:gap-6">
          <Stat label="Technologies" value={TECHNOLOGY_COUNT} />
          <Stat label="Core areas" value={CORE_AREA_COUNT} />
        </motion.dl>

        {/* Secondary text entry point — mirrors the image click for keyboard/mobile */}
        <motion.div variants={item} className="mt-10">
          <button
            type="button"
            onClick={onExplore}
            className="group inline-flex cursor-pointer items-center gap-3 border-b border-line-strong pb-1 font-mono text-xs tracking-[0.22em] text-content-muted uppercase transition-colors duration-300 hover:border-accent hover:text-content">
            Explore skills
            <span
              aria-hidden
              className="transition-transform duration-500 group-hover:translate-x-1 motion-reduce:transform-none">
              &#8594;
            </span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DeveloperIntro;
