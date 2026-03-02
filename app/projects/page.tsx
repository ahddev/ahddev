"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const projects = [
  {
    name: "NQSH",
    nameAr: "نَقْش",
    description: "A 3D printing shop website",
    url: "https://nqsh-3d.com",
    image: "/nqsh-3d.png",
    status: "live",
  },
  {
    name: "Labak",
    nameAr: "لابَك",
    description: "Free delivery dental tools store for dentists",
    url: "https://labak-sy.com",
    image: "/labak-sy.png",
    status: "live",
  },
  {
    name: "Razio Store",
    nameAr: "رازيو",
    description: "Laptop catalog website",
    url: "https://razio.store",
    image: "/razio.png",
    status: "archived",
  },
];

const techStack = [
  "React & Next.js",
  "Vercel deployment",
  "Supabase Backend-as-a-Service",
  "Tailwind CSS v4 & shadcn/ui",
  "GSAP animations",
  "Modern UI/UX design",
];

export default function ProjectsPage() {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr] gap-8 p-8 pt-24 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-foreground" href="/projects">
              Projects
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <main className="mx-auto w-full max-w-4xl flex flex-col gap-12">
        <header>
          <h1 className="animate-fade-down animate-ease-out text-4xl font-bold">
            Projects
          </h1>
          <p className="mt-4 animate-fade-down animate-delay-200 animate-ease-out text-lg text-muted-foreground leading-relaxed">
            Over the past 12 months of my React & Next.js learning journey, I&apos;ve built 3 real-world web applications — not just tutorials, but projects used by me and actual people and businesses.
          </p>
        </header>

        <section className="animate-fade-down animate-delay-300 animate-ease-out">
          <h2 className="text-xl font-semibold mb-4">During this year I worked with:</h2>
          <ul className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-border/60 bg-muted/50 px-4 py-2 text-sm text-foreground"
              >
                {tech}
              </li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold">Projects</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.name}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border-2 border-border/60 bg-card/50 shadow-md transition-all duration-300 hover:scale-[1.02] hover:border-[var(--chart-1)]/40 hover:shadow-lg hover:shadow-[var(--chart-1)]/10"
                onClick={() => window.open(project.url, "_blank")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && window.open(project.url, "_blank")}
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {project.status === "archived" && (
                    <span className="absolute right-3 top-3 rounded-full bg-muted/90 px-2 py-1 text-xs font-medium">
                      Archived
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="flex items-center gap-2 text-xl font-bold">
                    {project.name}
                    <span className="text-base font-normal text-muted-foreground">
                      {project.nameAr}
                    </span>
                    <ExternalLink className="h-4 w-4 shrink-0 opacity-60" />
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-sm font-medium text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {project.url.replace("https://", "")}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="animate-fade-up rounded-2xl border border-border/50 bg-muted/20 p-6">
          <p className="text-muted-foreground leading-relaxed">
            I&apos;m still learning every day — but I&apos;m proud of how far consistency can take you in one year.
          </p>
          <p className="mt-4 font-medium">
            Next goal: build larger scale apps, join a professional team, and dive deeper into backend.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-sm text-primary hover:underline"
          >
            Back to portfolio
          </Link>
        </section>
      </main>
    </div>
  );
}
