"use client";

import { useState } from "react";

type QuizCardProps = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export function QuizCard({ question, options, answer, explanation }: QuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="rounded-xl border border-border/70 bg-card/50 p-4">
      <p className="mb-3 font-medium">{question}</p>
      <div className="space-y-2">
        {options.map((option, index) => {
          const isPicked = selected === index;
          const isRight = showAnswer && index === answer;
          const isWrong = showAnswer && isPicked && index !== answer;
          return (
            <label
              key={option}
              className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                isRight
                  ? "border-green-500/60 bg-green-500/10"
                  : isWrong
                    ? "border-red-500/60 bg-red-500/10"
                    : "border-border/60 hover:bg-muted/40"
              }`}
            >
              <input
                type="radio"
                name={question}
                checked={isPicked}
                onChange={() => setSelected(index)}
                className="accent-primary"
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setShowAnswer(true)}
        className="mt-3 rounded-md border border-border/60 bg-muted/30 px-3 py-1.5 text-sm transition-colors hover:bg-muted/60"
      >
        Show Answer
      </button>

      {showAnswer ? <p className="mt-3 text-sm text-muted-foreground">{explanation}</p> : null}
    </div>
  );
}
