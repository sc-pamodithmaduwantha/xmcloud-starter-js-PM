import {
  Field,
  ImageField,
  NextImage as ContentSdkImage,
  LinkField,
  Text,
} from "@sitecore-content-sdk/nextjs";
import React from "react";
import { ComponentProps } from "lib/component-props";
import { CompatibleLink } from "components/content-sdk/CompatibleLink";

interface ImageFields {
  Image: ImageField;
  ImageCaption: Field<string>;
  TargetUrl: LinkField;
}

interface ImageProps extends ComponentProps {
  fields: ImageFields;
}

const ImageWrapper: React.FC<{
  className: string;
  id?: string;
  children: React.ReactNode;
}> = ({ className, id, children }) => (
  <figure className={className.trim()} id={id}>
    <div className="component-content">{children}</div>
  </figure>
);

const ImageDefault: React.FC<ImageProps> = ({ params }) => (
  <ImageWrapper className={`component image ${params.styles}`}>
    <span className="is-empty-hint">Image</span>
  </ImageWrapper>
);

export const Banner: React.FC<ImageProps> = ({ params, fields }) => {
  const { styles, RenderingIdentifier: id } = params;
  const imageField = fields.Image && {
    ...fields.Image,
    value: {
      ...fields.Image.value,
      style: { objectFit: "cover", width: "100%", height: "100%" },
    },
  };

  const altText =
    typeof fields?.Image?.value?.alt === "string"
      ? fields.Image.value.alt
      : "Hero banner";

  // Use pixel caps per breakpoint so the browser picks the next-lowest srcset width
  // instead of 100vw (which with DPR can still request 1920px on ~1319px viewport).
  // This fixes mobile/tablet overserving (e.g. 1920px image when displayed at 1319px).
  const bannerSizes =
    "(max-width: 640px) 100vw, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1440px) 1280px, 1920px";

  return (
    <figure className={`component hero-banner ${styles}`.trim()} id={typeof id === "string" ? id : undefined}>
      <div className="component-content sc-sxa-image-hero-banner">
        <ContentSdkImage
          field={imageField}
          loading="eager"
          fetchPriority="high"
          sizes={bannerSizes}
          alt={altText}
        />
      </div>
    </figure>
  );
};

// INTENTIONAL ERROR STATE: for Playwright testing - restore original to fix
export const Default: React.FC<ImageProps> = ({ params }) => {
  const { styles, RenderingIdentifier: id } = params;

  return (
    <figure className={`component image ${styles}`.trim()} id={typeof id === "string" ? id : undefined}>
      <div className="component-content">
        <div style={{
          padding: '24px',
          backgroundColor: '#FEF2F2',
          border: '1px solid #FCA5A5',
          borderRadius: '8px',
          color: '#991B1B',
          fontFamily: 'monospace',
          fontSize: '14px',
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>⚠ Error loading component</p>
          <p>Image component failed to render. There was a problem loading page content.</p>
          <p style={{ marginTop: '8px', fontSize: '12px', color: '#B91C1C' }}>
            TypeError: Cannot read properties of undefined (reading &apos;Image&apos;)
          </p>
        </div>
      </div>
    </figure>
  );
};
