import { Link, LinkField, Text, TextField, useSitecore } from '@sitecore-content-sdk/nextjs';
import React, { type JSX } from 'react';

interface Fields {
  data: {
    datasource: {
      url: {
        path: string;
        siteName: string;
      };
      field: {
        jsonValue: {
          value: string;
          metadata?: { [key: string]: unknown };
        };
      };
    };
    contextItem: {
      url: {
        path: string;
        siteName: string;
      };
      field: {
        jsonValue: {
          value: string;
          metadata?: { [key: string]: unknown };
        };
      };
    };
  };
}

type TitleProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type ComponentContentProps = {
  id: string;
  styles: string;
  children: JSX.Element;
};

const ComponentContent = (props: ComponentContentProps) => {
  const id = props.id;
  return (
    <div className={`component title ${props.styles}`} id={id ? id : undefined}>
      <div className="component-content">
        <div className="field-title">{props.children}</div>
      </div>
    </div>
  );
};

export const Default = (props: TitleProps): JSX.Element => {
  const datasource = props.fields?.data?.datasource || props.fields?.data?.contextItem;
  const { page } = useSitecore();
  const { mode } = page;

  // Use datasource field instead of context item field
  const titleField: TextField = datasource?.field?.jsonValue as TextField;
  const link: LinkField = {
    value: {
      href: datasource?.url?.path,
      title: titleField?.value ? String(titleField.value) : '',
    },
  };

  if (!mode.isNormal) {
    link.value.querystring = `sc_site=${datasource?.url?.siteName}`;
    if (!titleField?.value) {
      // Create a fallback field for editing mode
      const fallbackField: TextField = { value: 'Title field' };
      return (
        <ComponentContent styles={props.params.styles} id={props.params.RenderingIdentifier}>
          <Text field={fallbackField} />
        </ComponentContent>
      );
    }
  }

  return (
    <ComponentContent styles={props.params.styles} id={props.params.RenderingIdentifier}>
      <>
        {mode.isEditing ? (
          <Text field={titleField} />
        ) : (
          <Link field={link}>
            <Text field={titleField} />
          </Link>
        )}
      </>
    </ComponentContent>
  );
};
