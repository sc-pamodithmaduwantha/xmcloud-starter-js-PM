import type * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/atoms-utils";

type NumberProps = Omit<
  React.ComponentProps<"input">,
  "type" | "min" | "max" | "step" | "children"
> & {
  /** Visible label; associated with the control via nested `<label>` for screen readers and pointer users. */
  label: string;
  /** Inclusive minimum (maps to `min`). */
  min?: number;
  /** Inclusive maximum (maps to `max`). */
  max?: number;
  /** When false, uses integer stepping and blocks decimal separators in keyboard input. */
  decimalsAllowed?: boolean;
};

function NumericInput({
  className,
  label,
  min,
  max,
  decimalsAllowed = true,
  onKeyDown,
  ...props
}: NumberProps) {
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!decimalsAllowed && (e.key === "." || e.key === ",")) {
      e.preventDefault();
    }
    onKeyDown?.(e);
  };

  return (
    <label
      data-slot="number"
      className={cn("flex w-full max-w-full flex-col gap-1.5", className)}
    >
      <span className="text-md font-medium text-neutral-fg leading-none">
        {label}
      </span>
      <Input
        type="number"
        inputMode={decimalsAllowed ? "decimal" : "numeric"}
        min={min}
        max={max}
        step={decimalsAllowed ? "any" : 1}
        onKeyDown={handleKeyDown}
        className="tabular-nums"
        {...props}
      />
    </label>
  );
}

export { NumericInput };
