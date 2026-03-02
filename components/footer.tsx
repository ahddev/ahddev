import Link from "next/link";
import { Github, Instagram, Linkedin, Youtube } from "lucide-react";

const socialLinks = [
  { href: "https://www.instagram.com/realahd/", icon: Instagram },
  { href: "https://www.linkedin.com/in/ahddev/", icon: Linkedin },
  { href: "https://www.github.com/ahddev/", icon: Github },
  { href: "https://www.youtube.com/@ahddev", icon: Youtube },
];

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Ahed Al-Khalaf
        </p>
        <div className="flex gap-6">
          {socialLinks.map(({ href, icon: Icon }) => (
            <Link
              key={href}
              target="_blank"
              href={href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icon className="h-5 w-5" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
