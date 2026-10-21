"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import devImage from "@/public/image.png";
import SkillGroup from "./SkillGroup";
import {
  CORE_AREA_COUNT,
  SKILL_GROUPS,
  TECHNOLOGY_COUNT,
} from "./skills.data";

type SkillsDetailProps = {
  onBack: () => void;
  reduceMotion: boolean;
};

const BackControl = ({ onBack }: { onBack: () => void }) => (
  <button
    type="button"
    onClick={onBack}
    className="group inline-flex cursor-pointer items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-content-muted uppercase transition-colors duration-300 hover:text-content">
    <span
      aria-hidden
      className="transition-transform duration-500 group-hover:-translate-x-1 motion-reduce:transform-none">
      &#8592;
    </span>
    Back to profile
  </button>
);

const SkillsDetail = ({ onBack, reduceMotion }: SkillsDetailProps) => {
  const container: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.5,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: reduceMotion ? 0 : 0.06,
        delayChildren: reduceMotion ? 0 : 0.12,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: reduceMotion ? 0 : 0.25, ease: "easeIn" },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      exit="exit">
      {/* Header: keeps the profile present so the story stays connected */}
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-line pb-8">
        <div className="flex items-center gap-4">
          <span className="relative block size-11 shrink-0 overflow-hidden rounded-sm border border-line-strong shadow-elev-1">
            <Image
              src={devImage}
              alt=""
              aria-hidden
              placeholder="blur"
              sizes="44px"
              className="h-full w-full object-cover object-top"
            />
          </span>
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] text-content-subtle uppercase">
              Satyam
            </p>
            <p className="mt-1 font-mono text-sm tracking-[0.14em] text-content uppercase 2xl:text-base">
              Skills / Capabilities
            </p>
          </div>
        </div>

        <BackControl onBack={onBack} />
      </div>

      {/* The capabilities map */}
      <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-12 2xl:gap-6">
        {SKILL_GROUPS.map((group, index) => (
          <SkillGroup
            key={group.id}
            group={group}
            index={index}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>

      {/* Closing rule */}
      <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
        <p className="font-mono text-[11px] tracking-[0.22em] text-content-subtle uppercase tabular-nums">
          {TECHNOLOGY_COUNT} Technologies &middot; {CORE_AREA_COUNT} Core areas
        </p>
        <BackControl onBack={onBack} />
      </div>
    </motion.div>
  );
};

export default SkillsDetail;
