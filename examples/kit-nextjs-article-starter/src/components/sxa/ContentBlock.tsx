import { Text, RichText, Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { JSX } from 'react';

type ContentBlockProps = ComponentProps & {
  fields?: {
    heading?: Field<string>;
    content?: Field<string>;
  };
};

/**
 * A simple Content Block component, with a heading and rich text block.
 * This is the most basic building block of a content site, and the most basic
 * Content SDK component that's useful.
 */
const ContentBlock = ({ fields, rendering }: ContentBlockProps): JSX.Element => {
  if (!fields?.heading || !fields?.content) {
    return <NoDataFallback componentName={rendering?.componentName || 'ContentBlock'} />;
  }

  return (
    <div className="contentBlock">
      <Text tag="h2" className="contentTitle" field={fields.heading} />
      <RichText className="contentDescription" field={fields.content} />
    </div>
  );
};

export default ContentBlock;
