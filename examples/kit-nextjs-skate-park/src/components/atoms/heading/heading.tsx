import type { HeadingProps } from "./heading.schema";

function Heading({ className, text }: HeadingProps) {
  const value = text?.value;

  if (typeof value !== "string" || value === "") {
    return null;
  }

  return (
    <div
      data-slot="heading"
      className={className}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
}

export { Heading };
