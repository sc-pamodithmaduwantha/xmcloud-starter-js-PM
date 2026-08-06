"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/atoms-utils";

const BUTTON_VARIANTS = ["default", "outline", "ghost", "link"] as const;
const BUTTON_SIZES = [
  "default",
  "lg",
  "sm",
  "xs",
  "icon",
  "icon-lg",
  "icon-sm",
  "icon-xs",
] as const;
const BUTTON_COLOR_SCHEMES = [
  "default",
  "secondary",
  "success",
  "danger",
] as const;

export type ButtonAtomVariant = (typeof BUTTON_VARIANTS)[number];
export type ButtonAtomSize = (typeof BUTTON_SIZES)[number];
export type ButtonAtomColorScheme = (typeof BUTTON_COLOR_SCHEMES)[number];

export type ButtonAtomProps = Omit<
  React.ComponentProps<"button">,
  "color" | "children"
> & {
  /** Visible label text (Design Studio “Display name”). */
  displayName?: string;
  /** Placeholder text used when no label/children exists. */
  placeHolderText?: string;

  /** Visual variant (maps to UI Button variant). */
  variant?: ButtonAtomVariant;
  /** Size token (md maps to UI Button default). */
  size?: ButtonAtomSize;
  /** Color scheme (default/secondary map to UI primary/neutral). */
  colorScheme?: ButtonAtomColorScheme;

  /** Optional navigation URL. When set, renders an accessible link-style button. */
  href?: string;
  /** Link target when `href` is set. */
  target?: React.HTMLAttributeAnchorTarget;
  /** Rel attribute when `href` is set (auto-adds noopener/noreferrer for _blank). */
  rel?: string;
  /** Accessible name override if the visible label is not descriptive. */
  ariaLabel?: string;

  /** Optional children text/icon; when empty, `displayName`/placeholder is used. */
  children?: React.ReactNode;
};

function isEmptyChildren(node: React.ReactNode): boolean {
  if (node == null || node === false || node === true) return true;
  if (typeof node === "string") return node.trim().length === 0;
  if (typeof node === "number") return false;
  if (Array.isArray(node))
    return node.length === 0 || node.every(isEmptyChildren);
  return false;
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function mapVariant(variant: ButtonAtomVariant | undefined) {
  switch (variant) {
    case "outline":
      return "outline" as const;
    case "ghost":
      return "ghost" as const;
    case "link":
      return "link" as const;
    default:
      return "default" as const;
  }
}

function mapSize(size: ButtonAtomSize | undefined) {
  switch (size) {
    case "lg":
      return "lg" as const;
    case "sm":
      return "sm" as const;
    case "xs":
      return "xs" as const;
    case "icon":
      return "icon" as const;
    case "icon-lg":
      return "icon-lg" as const;
    case "icon-sm":
      return "icon-sm" as const;
    case "icon-xs":
      return "icon-xs" as const;
    default:
      return "default" as const;
  }
}

function mapColorScheme(colorScheme: ButtonAtomColorScheme | undefined) {
  switch (colorScheme) {
    case "secondary":
      return "neutral" as const;
    case "success":
      return "success" as const;
    case "danger":
      return "danger" as const;
    case "default":
    default:
      return "primary" as const;
  }
}

function ButtonAtomComponent({
  className,
  displayName,
  placeHolderText,
  variant = "default",
  size = "default",
  colorScheme = "default",
  href,
  target,
  rel,
  ariaLabel,
  children,
  disabled,
  onClick,
  ...rest
}: ButtonAtomProps) {
  let resolvedChildren: React.ReactNode = children;
  if (isEmptyChildren(children)) {
    if (displayName != null && displayName.trim() !== "") {
      resolvedChildren = displayName;
    } else if (placeHolderText != null && placeHolderText.trim() !== "") {
      resolvedChildren = (
        <span className="text-muted-foreground" data-button-placeholder>
          {placeHolderText}
        </span>
      );
    }
  }

  const uiVariant = mapVariant(variant);
  const uiSize = mapSize(size);
  const uiColorScheme = mapColorScheme(colorScheme);

  const resolvedAriaLabel =
    ariaLabel ??
    (typeof resolvedChildren === "string" && resolvedChildren.trim()
      ? resolvedChildren
      : undefined);

  // If href is set, render a link-like button for navigation.
  if (href && href.trim()) {
    const external = isExternalHref(href);
    const finalTarget = target ?? (external ? "_blank" : undefined);
    const shouldNoopener = finalTarget === "_blank";
    const finalRel =
      rel ?? (shouldNoopener ? "noopener noreferrer" : undefined);

    const content = (
      <Button
        asChild
        variant={uiVariant}
        size={uiSize}
        colorScheme={uiColorScheme}
        className={cn(className)}
        aria-label={resolvedAriaLabel}
      >
        {external ? (
          <a href={href} target={finalTarget} rel={finalRel}>
            {resolvedChildren}
          </a>
        ) : (
          <Link href={href} target={finalTarget} rel={finalRel}>
            {resolvedChildren}
          </Link>
        )}
      </Button>
    );

    return content;
  }

  return (
    <Button
      data-slot="button-atom"
      variant={uiVariant}
      size={uiSize}
      colorScheme={uiColorScheme}
      className={cn(className)}
      aria-label={resolvedAriaLabel}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {resolvedChildren}
    </Button>
  );
}

export { ButtonAtomComponent as Button };
