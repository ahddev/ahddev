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
function page() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pt-16 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
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
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="animate-fade-down animate-ease-out text-4xl font-bold">
          <h1>Projects</h1>
          <p className="text-lg text-foreground">
            Here you can find some of my next.js Frontend projects
          </p>
          <div className="mt-6 animate-fade-down animate-ease-out delay-500 flex flex-col  gap-4 md:flex-row">
            <div
              className="w-full md:w-[26rem] h-full hover:underline cursor-pointer border-2 rounded-2xl p-4  shadow-md hover:shadow-lg transition-all  duration-300 hover:bg-foreground/10 hover:scale-105"
              onClick={() => window.open("https://labak-sy.com", "_blank")}
            >
              <Image
                src="/nqsh-3d.png"
                alt="nqsh-3d.com"
                width={500}
                height={500}
                quality={90}
                className="w-full h-full object-cover"
              />
              <h2 className="mt-4 text-2xl font-bold flex items-center gap-2">
                nqsh-3d.com <ExternalLink className="w-5 h-5" />
              </h2>
            </div>
            <div
              className="w-full md:w-[26rem] h-full hover:underline cursor-pointer border-2 rounded-2xl p-4  shadow-md hover:shadow-lg transition-all  duration-300 hover:bg-foreground/10 hover:scale-105"
              onClick={() => window.open("https://labak-sy.com", "_blank")}
            >
              <Image
                src="/labak-sy.png"
                alt="labak-sy.store"
                width={500}
                height={500}
                quality={90}

                className="w-full h-full object-cover"
              />
              <h2 className="mt-4 text-2xl font-bold flex items-center gap-2">
                Labak-sy <ExternalLink className="w-5 h-5" />
              </h2>
            </div>
            <div
              className="w-full md:w-[26rem] h-full hover:underline cursor-pointer border-2 rounded-2xl p-4  shadow-md hover:shadow-lg transition-all  duration-300 hover:bg-foreground/10 hover:scale-105"
              onClick={() => window.open("https://razio.store", "_blank")}
            >
              <Image
                src="/razio.png"
                alt="Razio.store"
                width={500}
                height={500}
                quality={90}

                className="w-full h-full object-cover"
              />
              <h2 className="mt-4 text-2xl font-bold flex items-center gap-2">
                Razio.store <ExternalLink className="w-5 h-5" />
              </h2>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}

export default page;
