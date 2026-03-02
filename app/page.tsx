import { Github, Instagram, Linkedin, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SkillsGrid } from "@/components/skills-grid";
import { CopyEmailButton } from "@/components/copy-email-button";

const EMAIL = "reach.ahed@gmail.com";

function SocialLinks() {
  const links = [
    { href: "https://www.instagram.com/realahd/", icon: Instagram },
    { href: "https://www.linkedin.com/in/ahddev/", icon: Linkedin },
    { href: "https://www.github.com/ahddev/", icon: Github },
    { href: "https://www.youtube.com/@ahddev", icon: Youtube },
  ];

  return (
    <div className="flex gap-8">
      {links.map(({ href, icon: Icon }, i) => (
        <Link
          key={href}
          target="_blank"
          href={href}
          className="transition-transform duration-200 hover:scale-110 hover:text-[var(--chart-1)]"
          style={{ animationDelay: `${1000 + i * 100}ms` }}
        >
          <Icon className="h-10 w-10" />
        </Link>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen pt-20 pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="mx-auto max-w-3xl px-6 sm:px-8">
        {/* Hero */}
        <section className="flex flex-col gap-8 py-12 sm:py-16">
          <h1
            className="animate-fade-down animate-ease-out font-[family-name:var(--font-syne)] text-5xl font-bold leading-tight sm:text-6xl"
            style={{
              background: "linear-gradient(135deg, oklch(0.985 0 0) 0%, oklch(0.708 0 0) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Ahed Al-Khalaf
          </h1>
          <h2 className="animate-fade-down animate-delay-300 animate-ease-out text-2xl font-medium text-muted-foreground">
            I&apos;m a junior <span className="font-semibold text-foreground">software engineer</span>{" "}
            based in Damascus, Syria — building web applications & mobile apps.
          </h2>
          <div className="animate-fade-up animate-delay-500 animate-ease-out">
            <SocialLinks />
          </div>
          <div className="animate-fade-up animate-delay-700 animate-ease-out flex flex-wrap gap-4">
            <Button className="rounded-full" asChild>
              <Link href="/projects">See projects</Link>
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/resume.pdf" target="_blank" download>
                Download Resume
              </Link>
            </Button>
          </div>
        </section>

        {/* About */}
        <section className="animate-fade-up animate-delay-900 animate-ease-out border-t border-border/50 py-12">
          <h3 className="mb-4 font-[family-name:var(--font-syne)] text-xl font-semibold">About</h3>
          <p className="text-muted-foreground leading-relaxed">
            I build modern web experiences with clean code and attention to detail. 
            Over the past year I&apos;ve shipped real projects used by actual people and businesses — 
            and I&apos;m still learning every day. Next goal: build larger-scale apps and join a professional team.
          </p>
        </section>

        {/* Skills */}
        <section className="animate-fade-up animate-delay-1000 animate-ease-out border-t border-border/50 py-12">
          <h3 className="mb-4 font-[family-name:var(--font-syne)] text-xl font-semibold">Skills</h3>
          <SkillsGrid />
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="animate-fade-up animate-delay-1100 animate-ease-out border-t border-border/50 py-12"
        >
          <h3 className="mb-4 font-[family-name:var(--font-syne)] text-xl font-semibold">
            Get in touch
          </h3>
          <p className="mb-6 text-muted-foreground">
            I&apos;m open to opportunities and collaboration. Reach out via email or connect on social.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <a
              href={`mailto:${EMAIL}`}
              className="text-primary hover:underline"
            >
              {EMAIL}
            </a>
            <CopyEmailButton email={EMAIL} />
          </div>
          <div className="mt-6">
            <SocialLinks />
          </div>
        </section>
      </main>
    </div>
  );
}
