"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Typography from "@/components/utils/Typography";
import BrandTagline from "./Hero/BrandTagline";
import GlassPanel from "./Hero/GlassPanel";
import HeroBackdrop from "./Hero/HeroBackdrop";
import { STACK_LAYERS } from "./Hero/scene.palette";

const Heropage = () => {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = Boolean(prefersReducedMotion);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Panel and backdrop travel at different rates, so the hero gains depth as
  // it leaves rather than sliding away as one flat plane.
  const depth = (distance: number) => (reduceMotion ? 0 : distance);
  const panelY = useTransform(scrollYProgress, [0, 1], [0, depth(-70)]);
  const panelOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const reveal = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
    show: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.75,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  return (
    <section
      ref={ref}
      data-theme-surface
      className="ambient-field relative isolate flex min-h-screen flex-col overflow-hidden bg-surface text-content">
      <HeroBackdrop eventSource={ref} />

      {/* --------------------------------------------------- Top bar */}
      <BrandTagline className="relative z-10 px-6 pt-6 sm:px-8 md:px-16 md:pt-8 2xl:px-26" />

      <motion.button
        type="button"
        initial="hidden"
        animate="show"
        custom={0.1}
        variants={reveal}
        whileHover={reduceMotion ? undefined : { y: -2 }}
        whileTap={reduceMotion ? undefined : { y: 0, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className="absolute top-6 right-20 z-50 inline-flex h-9 cursor-pointer items-center rounded-md bg-invert px-5 text-sm font-semibold text-on-invert shadow-elev-2 transition-shadow duration-300 hover:shadow-elev-3">
        Resume
      </motion.button>

      {/* --------------------------------------------------- The glass panel */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1800px] flex-1 items-center px-4 py-6 sm:px-8 sm:py-10 md:px-16 2xl:px-26">
        <motion.div
          style={{ y: panelY, opacity: panelOpacity }}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0 : 0.9,
            delay: reduceMotion ? 0 : 0.25,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="w-full lg:max-w-[40rem] 2xl:max-w-[46rem]">
          <GlassPanel className="rounded-2xl px-7 py-9 sm:px-10 sm:py-12 lg:rounded-3xl lg:px-14 lg:py-16 2xl:px-16 2xl:py-18">
            <motion.p
              initial="hidden"
              animate="show"
              custom={0.35}
              variants={reveal}
              className="font-mono text-[11px] tracking-[0.3em] text-content-subtle uppercase 2xl:text-xs">
              Satyam
            </motion.p>

            <motion.div
              initial="hidden"
              animate="show"
              custom={0.42}
              variants={reveal}
              className="mt-5">
              <Typography
                as="h1"
                variant="display"
                className="text-content [text-shadow:var(--display-shadow)]">
                Full{" "}
                <motion.span
                  className="inline-block"
                  initial={{ rotate: reduceMotion ? 0 : 180 }}
                  animate={{ rotate: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 1,
                    ease: "easeOut",
                  }}>
                  S
                </motion.span>
                tack
                <br />
                Engineer
              </Typography>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="show"
              custom={0.52}
              variants={reveal}
              className="mt-7 sm:mt-8">
              <span aria-hidden className="mb-6 block h-px w-12 bg-accent" />
              <Typography
                variant="subtitle"
                className="max-w-lg text-content-muted">
                Crafting digital experiences with code and creativity.
              </Typography>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="show"
              custom={0.62}
              variants={reveal}
              className="mt-9 sm:mt-11">
              <a
                href="#about"
                className="group inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-content-subtle uppercase transition-colors duration-300 hover:text-content 2xl:text-xs">
                <span
                  aria-hidden
                  className="h-px w-8 bg-content-subtle transition-all duration-500 group-hover:w-12 group-hover:bg-accent"
                />
                Scroll to explore
              </a>
            </motion.div>
          </GlassPanel>
        </motion.div>
      </div>

      {/* ------------------------------------- Bottom — what the stack means */}
      <motion.ol
        initial="hidden"
        animate="show"
        custom={0.75}
        variants={reveal}
        className="relative z-10 mx-auto grid w-full max-w-[1800px] grid-cols-2 gap-2 px-4 pb-8 sm:px-8 sm:pb-10 md:px-16 lg:grid-cols-4 lg:gap-3 2xl:px-26">
        {STACK_LAYERS.map((layer, index) => (
          <li
            key={layer.id}
            className="glass flex items-baseline gap-2.5 rounded-lg px-3.5 py-3 transition-transform duration-500 ease-out-depth hover:-translate-y-0.5">
            <span
              aria-hidden
              className="font-mono text-[10px] text-accent tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0">
              <span className="block font-mono text-[11px] tracking-[0.18em] text-content uppercase">
                {layer.label}
              </span>
              <span className="mt-0.5 block truncate font-mono text-[10px] text-content-subtle">
                {layer.note}
              </span>
            </span>
          </li>
        ))}
      </motion.ol>
    </section>
  );
};

export default Heropage;
