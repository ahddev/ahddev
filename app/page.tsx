import { Github, Instagram, Linkedin } from "lucide-react";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="animate-fade-down animate-ease-out text-4xl font-bold">
          Welcome to my portfolio, Ahed Al-Khalaf
        </h1>
        <h2 className="animate-fade-down animate-delay-500 animate-ease-out text-2xl ">
          I&apos;m a <span className="font-bold">software engineer</span> with
          a passion for building web applications & mobile apps.  
        </h2>
        <div className="animate-fade-up animate-delay-1000 animate-ease-out flex gap-8">
          <a target="_blank" href="https://www.instagram.com/ahddev/">
            <Instagram className="w-10 h-10 hover:text-blue-500" />
          </a>
          <a target="_blank" href="https://www.linkedin.com/in/ahddev/">
            <Linkedin className="w-10 h-10 hover:text-blue-500" />
          </a>
          <a target="_blank" href="https://www.github.com/ahddev/">
            <Github className="w-10 h-10 hover:text-blue-500" />
          </a>
        </div>
      </main>
    </div>
  );
}
