import type { ReactNode } from "react";

type SectionIntroProps = {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  align?: "start" | "center";
};

export function SectionIntro({
  eyebrow,
  title,
  children,
  align = "start",
}: SectionIntroProps) {
  return (
    <div
      className={[
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-start",
      ].join(" ")}
    >
      {eyebrow ? (
        <p className="mb-4 font-display text-sm tracking-[0.24em] text-[var(--color-accent)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-balance font-display text-3xl leading-[1.05] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {children ? (
        <div className="mt-5 space-y-3 text-lg leading-8 text-[var(--color-secondary)]">
          {children}
        </div>
      ) : null}
    </div>
  );
}
