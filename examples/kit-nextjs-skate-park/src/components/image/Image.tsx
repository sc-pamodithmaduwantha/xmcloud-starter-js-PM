import {
  Field,
  ImageField,
  LinkField,
} from "@sitecore-content-sdk/nextjs";
import React from "react";
import { ComponentProps } from "lib/component-props";

interface ImageFields {
  Image: ImageField;
  ImageCaption: Field<string>;
  TargetUrl: LinkField;
}

interface ImageProps extends ComponentProps {
  fields: ImageFields;
}

/** Intentionally broken: banner shell only (no hero image / background). */
export const Banner: React.FC<ImageProps> = ({ params }) => {
  const { styles, RenderingIdentifier: id } = params;

  return (
    <div className={`component hero-banner ${styles || ""}`} id={id}>
      <div className="component-content" />
    </div>
  );
};

/** Intentionally broken: container shell only (no image, caption, or link). */
export const Default: React.FC<ImageProps> = ({ params }) => {
  const { styles, RenderingIdentifier: id } = params;

  return (
    <div className={`component image ${styles || ""}`} id={id}>
      <div className="component-content" />
    </div>
  );
};
