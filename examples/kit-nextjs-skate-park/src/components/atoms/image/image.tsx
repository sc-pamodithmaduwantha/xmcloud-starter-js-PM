"use client";

import * as React from "react";

import { cn } from "@/lib/atoms-utils";

const IMAGE_SOURCE_TYPES = ["url", "mediaLibrary", "upload"] as const;
const IMAGE_SHAPES = ["none", "rounded", "circle"] as const;
const IMAGE_ASPECT_RATIOS = ["auto", "1:1", "4:3", "16:9", "3:4", "21:9"] as const;

type ImageSourceType = (typeof IMAGE_SOURCE_TYPES)[number];
type ImageShape = (typeof IMAGE_SHAPES)[number];
type ImageAspectRatio = (typeof IMAGE_ASPECT_RATIOS)[number];

export type ResponsiveImageSource = {
  srcSet: string;
  media?: string;
  type?: string;
};

export type ImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt" | "loading"
> & {
  src: string;
  sourceType?: ImageSourceType;
  showAltText?: boolean;
  altText?: string;
  altTextRequired?: boolean;
  shape?: ImageShape;
  aspectRatio?: ImageAspectRatio;
  fallbackSrc?: string;
  lazyLoad?: boolean;
  responsiveSources?: ResponsiveImageSource[];
};

const shapeClasses: Record<ImageShape, string> = {
  none: "",
  rounded: "rounded-md",
  circle: "rounded-full aspect-square object-cover",
};

const aspectRatioClasses: Record<ImageAspectRatio, string> = {
  auto: "",
  "1:1": "aspect-square",
  "4:3": "aspect-[4/3]",
  "16:9": "aspect-video",
  "3:4": "aspect-[3/4]",
  "21:9": "aspect-[21/9]",
};

function Image({
  className,
  src,
  sourceType = "url",
  showAltText = true,
  altText,
  altTextRequired = true,
  shape = "none",
  aspectRatio = "auto",
  fallbackSrc,
  lazyLoad = true,
  responsiveSources,
  onError,
  ...props
}: ImageProps) {
  const [currentSrc, setCurrentSrc] = React.useState(src);

  React.useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  const resolvedAlt = showAltText ? (altText ?? "") : "";

  if (process.env.NODE_ENV !== "production" && showAltText && altTextRequired && !resolvedAlt.trim()) {
    // Accessibility guard for authoring time when alt text is required.
    console.warn(
      "Image atom is configured to require alt text, but no alt text was provided."
    );
  }

  const handleError: React.ReactEventHandler<HTMLImageElement> = (event) => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
    onError?.(event);
  };

  const imageElement = (
    <img
      data-slot="image"
      data-source-type={sourceType}
      className={cn(
        "block h-auto w-full",
        aspectRatioClasses[aspectRatio],
        shapeClasses[shape],
        className
      )}
      src={currentSrc}
      alt={resolvedAlt}
      loading={lazyLoad ? "lazy" : "eager"}
      onError={handleError}
      {...props}
    />
  );

  if (!responsiveSources?.length) {
    return imageElement;
  }

  return (
    <picture data-slot="image-picture">
      {responsiveSources.map((source) => (
        <source
          key={`${source.srcSet}-${source.media ?? "all"}-${source.type ?? "default"}`}
          srcSet={source.srcSet}
          media={source.media}
          type={source.type}
        />
      ))}
      {imageElement}
    </picture>
  );
}

export { Image };
