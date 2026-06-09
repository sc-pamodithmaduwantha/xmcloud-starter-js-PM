/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field, ImageField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps, GraphQLField } from '@/lib/component-props';
import { AuthorReferenceField } from '@/types/AuthorTaxonomy.props';

export interface ArticleHeaderParams {
  [key: string]: any;
}

export interface ArticleHeaderFields {
  imageRequired?: GraphQLField<ImageField>;
  eyebrowOptional?: GraphQLField<Field<string>>;
}

export interface ArticleHeaderExternalFields {
  pageHeaderTitle?: GraphQLField<Field<string>>;
  pageReadTime?: GraphQLField<Field<string>>;
  pageDisplayDate?: GraphQLField<Field<string>>;
  pageAuthor?: GraphQLField<AuthorReferenceField>;
}

export interface ArticleHeaderProps extends ComponentProps {
  params: ArticleHeaderParams;
  fields?: {
    data?: {
      datasource?: ArticleHeaderFields;
      externalFields?: ArticleHeaderExternalFields;
    };
  };
}
