"use client";

import { useMemo, useState } from "react";

type FixTheCodeProps = {
  title: string;
  broken: string;
  solution: string;
  hint: string;
  /** When provided, used instead of exact string match. */
  validate?: (normalizedAttempt: string) => boolean;
};

function normalize(value: string) {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");
}

export function FixTheCode({ title, broken, solution, hint, validate }: FixTheCodeProps) {
  const [attempt, setAttempt] = useState(broken);
  const [checked, setChecked] = useState(false);
  const isCorrect = useMemo(
    () =>
      checked &&
      (validate ? validate(normalize(attempt)) : normalize(attempt) === normalize(solution)),
    [attempt, checked, solution, validate],
  );

  return (
    <div className="min-w-0 rounded-xl border border-border/70 bg-card/50 p-4">
      <h4 className="mb-3 text-sm font-semibold">{title}</h4>
      <textarea
        value={attempt}
        onChange={(e) => {
          setAttempt(e.target.value);
          setChecked(false);
        }}
        spellCheck={false}
        className="h-56 w-full resize-y rounded-lg border border-border/70 bg-background/60 p-3 font-mono text-sm outline-none ring-ring transition focus:ring-2"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setChecked(true)}
          className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground transition-opacity hover:opacity-90"
        >
          Check
        </button>
        <details className="text-sm text-muted-foreground">
          <summary className="cursor-pointer select-none">Hint</summary>
          <p className="mt-1">{hint}</p>
        </details>
      </div>

      {checked ? (
        <p className={`mt-3 text-sm ${isCorrect ? "text-green-400" : "text-red-400"}`}>
          {isCorrect ? "Correct solution. Great work." : "Not yet. Compare your code with the hint."}
        </p>
      ) : null}
    </div>
  );
}
