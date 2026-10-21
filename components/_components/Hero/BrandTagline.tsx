"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import clsx from "clsx";

const WORDS = ["Build", "Ship", "Scale"] as const;

type BrandTaglineProps = { className?: string };

/**
 * The brand mark in the top-left slot: the three words stagger in, the
 * separators bloom between them, and an accent rule draws itself underneath.
 *
 * Everything animates transform/opacity only, and the separators reserve their
 * width from the first frame, so the sequence cannot shift the layout under
 * the navigation controls beside it.
 */
const BrandTagline = ({ className }: BrandTaglineProps) => {
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = Boolean(prefersReducedMotion);

  const list: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.09,
        delayChildren: reduceMotion ? 0 : 0.15,
      },
    },
  };

  const word: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.55,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const dot: Variants = {
    hidden: { opacity: 0, scale: reduceMotion ? 1 : 0.4 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: reduceMotion ? 0 : 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div className={clsx("inline-flex flex-col gap-2", className)}>
      <motion.p
        variants={list}
        initial="hidden"
        animate="show"
        className="flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.3em] text-content-muted uppercase sm:gap-2.5 sm:text-xs 2xl:text-sm">
        {WORDS.map((entry, index) => (
          <motion.span key={entry} variants={word} className="contents">
            {index > 0 && (
              <motion.span
                aria-hidden
                variants={dot}
                className="inline-block size-1 shrink-0 rounded-full bg-accent"
              />
            )}
            <motion.span variants={word} className="inline-block">
              {entry}
            </motion.span>
          </motion.span>
        ))}
      </motion.p>

      {/* Accent rule, drawn left-to-right once the words have landed. */}
      <motion.span
        aria-hidden
        initial={{ scaleX: reduceMotion ? 1 : 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: reduceMotion ? 0 : 0.8,
          delay: reduceMotion ? 0 : 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="h-px w-16 origin-left bg-linear-to-r from-accent to-transparent sm:w-20"
      />
    </div>
  );
};

export default BrandTagline;
