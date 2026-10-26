import type { KeyboardEvent } from "react";

import { cn } from "@/lib/atoms-utils";

import type { NumberProps } from "./number.schema";

const inputClassName = cn(
  "flex h-10 w-full min-w-0 rounded-md border border-zinc-300 bg-white px-3 py-1",
  "text-sm outline-none transition-[color]",
  "placeholder:text-zinc-400 selection:bg-zinc-900 selection:text-white dark:bg-zinc-950/30",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  "focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900",
  "aria-invalid:border-red-500 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40",
  "tabular-nums",
);

function labelText(value: string | number | undefined): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return "";
}

function NumericInput({
  className,
  label,
  value,
  min,
  max,
  decimalsAllowed = true,
}: NumberProps) {
  const resolvedLabel = labelText(label?.value);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!decimalsAllowed && (event.key === "." || event.key === ",")) {
      event.preventDefault();
    }
  };

  return (
    <label
      data-slot="number"
      className="flex w-full max-w-full flex-col gap-1.5"
    >
      {resolvedLabel ? (
        <span className="text-sm font-medium text-zinc-800 leading-none">
          {resolvedLabel}
        </span>
      ) : null}
      <input
        type="number"
        data-slot="input"
        inputMode={decimalsAllowed ? "decimal" : "numeric"}
        min={min}
        max={max}
        step={decimalsAllowed ? "any" : 1}
        defaultValue={value}
        onKeyDown={handleKeyDown}
        className={cn(inputClassName, className)}
      />
    </label>
  );
}

export { NumericInput };
