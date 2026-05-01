"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { IconType } from "react-icons";
import {
  SiAxios,
  SiCss,
  SiDocker,
  SiExpress,
  SiGithub,
  SiGithubactions,
  SiHtml5,
  SiJavascript,
  SiJsonwebtokens,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenapiinitiative,
  SiOpenid,
  SiPostgresql,
  SiPrisma,
  SiRailway,
  SiReact,
  SiReactquery,
  SiRedis,
  SiRedux,
  SiRender,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";

type SkillItem = {
  name: string;
  icon: IconType;
  /** Brand / accent color for icon + border */
  color: string;
};

const categories: { label: string; skills: SkillItem[] }[] = [
  {
    label: "Frontend",
    skills: [
      { name: "HTML", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS", icon: SiCss, color: "#1572B6" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "React.js", icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", icon: SiNextdotjs, color: "#ffffff" },
      // { name: "Redux Toolkit", icon: SiRedux, color: "#764ABC" },
      // { name: "TanStack Query", icon: SiReactquery, color: "#FF4154" },
      // { name: "Axios", icon: SiAxios, color: "#5A29E4" },
    ],
  },
  {
    label: "Backend",
    skills: [
      { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
      { name: "Express.js", icon: SiExpress, color: "#ffffff" },
      { name: "REST APIs", icon: SiOpenapiinitiative, color: "#6BA539" },
      { name: "JWT", icon: SiJsonwebtokens, color: "#FB015B" },
      { name: "OAuth", icon: SiOpenid, color: "#F78C40" },
    ],
  },
  {
    // label: "Database & ORM's",
    label: "Database",
    skills: [
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      // { name: "Mongoose", icon: SiMongodb, color: "#880000" },
      // { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      // { name: "Prisma ORM", icon: SiPrisma, color: "#2D3748" },
      // { name: "Redis", icon: SiRedis, color: "#DC382D" },
    ],
  },
  {
    // label: "DevOps, Cloud & Tools",
    label: "Cloud & Tools",
    skills: [
      // { name: "Docker", icon: SiDocker, color: "#2496ED" },
      // { name: "CI/CD", icon: SiGithubactions, color: "#2088FF" },
      { name: "GitHub", icon: SiGithub, color: "#ffffff" },
      { name: "Vercel", icon: SiVercel, color: "#ffffff" },
      // { name: "Render", icon: SiRender, color: "#46E3B7" },
      // { name: "Railway", icon: SiRailway, color: "#B9C5FF" },
    ],
  },
];

/** Staggers category rows */
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06,
    },
  },
};

/** Row moves in; staggers category title then badge group */
const rowVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      ease: [0.22, 1, 0.36, 1] as const,
      staggerChildren: 0.07,
      delayChildren: 0.03,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/** Badge strip: spring-stagger each pill after the title */
const badgeListVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.032,
      delayChildren: 0.04,
    },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 380,
      damping: 22,
    },
  },
};

function TechBadge({ skill }: { skill: SkillItem }) {
  const Icon = skill.icon;
  return (
    <motion.span
      variants={badgeVariants}
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
      className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1.5 text-sm font-medium text-foreground backdrop-blur-sm"
      style={{
        borderColor: `${skill.color}55`,
        boxShadow: `0 0 0 1px ${skill.color}22 inset`,
      }}
    >
      <Icon className="h-4 w-4 shrink-0" style={{ color: skill.color }} aria-hidden />
      <span className="leading-none">{skill.name}</span>
    </motion.span>
  );
}

export function SkillsGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card/90 via-card/70 to-primary/5 p-5 shadow-lg backdrop-blur-md sm:p-6"
    >
      <div className="mb-4 hidden grid-cols-[minmax(0,7rem)_1fr] gap-4 border-b border-border/50 pb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:grid">
        <span>Category</span>
        <span>Technologies</span>
      </div>

      <motion.div
        className="flex flex-col divide-y divide-border/50"
        variants={listVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.label}
            variants={rowVariants}
            className="grid grid-cols-1 gap-4 py-5 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,7rem)_1fr] sm:items-start sm:gap-6"
          >
            <motion.h4
              variants={titleVariants}
              className="shrink-0 font-[family-name:var(--font-heading)] text-sm font-semibold text-foreground sm:text-base"
            >
              {cat.label}
            </motion.h4>
            <motion.div
              variants={badgeListVariants}
              className="flex flex-wrap gap-2 sm:min-w-0"
            >
              {cat.skills.map((skill) => (
                <TechBadge key={`${cat.label}-${skill.name}`} skill={skill} />
              ))}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
