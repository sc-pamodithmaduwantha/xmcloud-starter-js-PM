import { cn } from "@/lib/atoms-utils";

import type { ImageProps } from "./image.schema";

function Image({ className, image }: ImageProps) {
  const value = image?.value;
  const src = value?.src?.trim() ?? "";

  if (!src) {
    return null;
  }

  const alt = value?.alt ?? "";

  if (!alt.trim()) {
    console.warn("Image atom is missing alt text.");
  }

  return (
    <img
      data-slot="image"
      className={cn("block h-auto w-full", value?.class, className)}
      src={src}
      alt={alt}
      width={value?.width}
      height={value?.height}
    />
  );
}

export { Image };
