import React, { type JSX } from 'react';
import {
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  RichText as ContentSdkRichText,
} from '@sitecore-content-sdk/nextjs';
import type { PromoProps } from './sxa-promo.props';

const PromoDefaultComponent = (props: PromoProps): JSX.Element => (
  <div className={`component promo ${props.params?.styles?.trimEnd() ?? ''}`}>
    <div className="component-content">
      <span className="is-empty-hint">Promo</span>
    </div>
  </div>
);

export const Default = (props: PromoProps): JSX.Element => {
  const { params, fields } = props;
  const id = params?.RenderingIdentifier;
  const styles = params?.styles?.trimEnd() ?? '';

  if (fields) {
    return (
      <div className={`component promo ${styles}`} id={id ? id : undefined}>
        <div className="component-content">
          <div className="field-promoicon">
            <ContentSdkImage field={fields.PromoIcon} />
          </div>
          <div className="promo-text">
            <div>
              <div className="field-promotext">
                <ContentSdkRichText field={fields.PromoText} />
              </div>
            </div>
            <div className="field-promolink">
              {fields.PromoLink && <ContentSdkLink field={fields.PromoLink} />}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <PromoDefaultComponent {...props} />;
};

export const WithText = (props: PromoProps): JSX.Element => {
  const { params, fields } = props;
  const id = params?.RenderingIdentifier;
  const styles = params?.styles?.trimEnd() ?? '';

  if (fields) {
    return (
      <div className={`component promo ${styles}`} id={id ? id : undefined}>
        <div className="component-content">
          <div className="field-promoicon">
            <ContentSdkImage field={fields.PromoIcon} />
          </div>
          <div className="promo-text">
            <div>
              <div className="field-promotext">
                <ContentSdkRichText className="promo-text" field={fields.PromoText} />
              </div>
            </div>
            <div className="field-promotext">
              <ContentSdkRichText className="promo-text" field={fields.PromoText2} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <PromoDefaultComponent {...props} />;
};
