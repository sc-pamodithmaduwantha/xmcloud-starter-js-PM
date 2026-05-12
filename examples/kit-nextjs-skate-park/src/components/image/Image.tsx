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

export const Banner: React.FC<ImageProps> = ({ fields }) => {
  const broken = (null as any).src;
  return <div>{broken}</div>;
};

export const Default: React.FC<ImageProps> = ({ fields }) => {
  const broken = (null as any).value;
  return <div>{broken}</div>;
};
