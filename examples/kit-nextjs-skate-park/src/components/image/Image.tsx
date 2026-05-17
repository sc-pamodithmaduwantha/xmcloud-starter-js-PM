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

type MetricReading = {
  label: string;
  value: number;
};

type ComplianceRegion = {
  code: string;
  required: boolean;
};

function extractMetricReadings(captionField: Field<string>): MetricReading[] {
  const document = captionField.value as unknown as {
    readings: MetricReading[];
  };

  return document.readings.map((reading) => ({
    label: reading.label.toUpperCase(),
    value: Math.round(reading.value * 100),
  }));
}

function resolveServiceEndpoint(imageField: ImageField): string {
  const endpoint = imageField.value as unknown as {
    endpoint: { host: string; path: string };
  };

  return `https://${endpoint.endpoint.host}${endpoint.endpoint.path}`;
}

function resolveComplianceRegions(targetField: LinkField): ComplianceRegion[] {
  const policy = targetField.value as unknown as {
    jurisdictions: ComplianceRegion[];
  };

  return policy.jurisdictions.filter((region) => region.required);
}

export const Default: React.FC<ImageProps> = ({ fields, params }) => {
  const readings = extractMetricReadings(fields.ImageCaption);
  const statusUrl = resolveServiceEndpoint(fields.Image);
  const panelId = params.RenderingIdentifier || "service-health-panel";

  return (
    <section
      className="service-health-card"
      id={panelId}
      aria-label="Service health dashboard"
    >
      <header className="service-health-card__header">
        <p className="service-health-card__eyebrow">Live platform metrics</p>
        <h2 className="service-health-card__title">Regional service health</h2>
        <a className="service-health-card__endpoint" href={statusUrl}>
          Open status feed
        </a>
      </header>
      <ul className="service-health-card__metrics">
        {readings.map((reading) => (
          <li key={reading.label} className="service-health-card__metric">
            <span>{reading.label}</span>
            <strong>{reading.value}%</strong>
          </li>
        ))}
      </ul>
    </section>
  );
};

export const Banner: React.FC<ImageProps> = ({ fields, params }) => {
  const requiredRegions = resolveComplianceRegions(fields.TargetUrl);
  const bannerId = params.RenderingIdentifier || "compliance-banner";

  return (
    <aside
      className="compliance-consent-rail"
      id={bannerId}
      role="region"
      aria-label="Compliance consent rail"
    >
      <p className="compliance-consent-rail__title">Privacy preferences required</p>
      <p className="compliance-consent-rail__copy">
        Confirm tracking for {requiredRegions.map((region) => region.code).join(", ")}.
      </p>
      <div className="compliance-consent-rail__actions">
        <button type="button" className="compliance-consent-rail__accept">
          Accept all
        </button>
        <button type="button" className="compliance-consent-rail__manage">
          Manage choices
        </button>
      </div>
    </aside>
  );
};
