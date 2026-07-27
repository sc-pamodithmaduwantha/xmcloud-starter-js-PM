import type React from 'react';
import { Fragment } from 'react';
import {
  BreadcrumbsDatasource,
  BreadcrumbsPage,
  BreadcrumbsProps,
} from 'components/breadcrumbs/breadcrumbs.props';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from 'components/ui/breadcrumb';
import { getDatasource, getFieldValue } from 'lib/component-props';
import { NoDataFallback } from 'utils/NoDataFallback';

const truncate = (str: string): string =>
  str?.length > 25 ? str.replace(/(.{24})..+/, '$1').trim().concat('...') : str;

const getPageTitle = (page: BreadcrumbsPage): string =>
  getFieldValue(page.navigationTitle)?.value || getFieldValue(page.title)?.value || page.name || '';

interface BreadcrumbsTrailProps {
  datasource: BreadcrumbsDatasource;
  /** Renders the current page as a link instead of static text. */
  currentPageAsLink?: boolean;
}

const BreadcrumbsTrail: React.FC<BreadcrumbsTrailProps> = ({ datasource, currentPageAsLink }) => {
  const { ancestors, name, url } = datasource;

  if (!ancestors?.length) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  const currentTitle = truncate(name || '');

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {ancestors.map((ancestor, index) => (
          <Fragment key={`${ancestor.name}-${index}`}>
            <BreadcrumbItem>
              <BreadcrumbLink href={ancestor.url?.href || ''}>
                {getPageTitle(ancestor)}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </Fragment>
        ))}
        <BreadcrumbItem>
          {currentPageAsLink && url?.href ? (
            <BreadcrumbLink aria-current="page" href={url.href}>
              {currentTitle}
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{currentTitle}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export const Default: React.FC<BreadcrumbsProps> = (props) => {
  const datasource = getDatasource(props.fields);

  if (!datasource) {
    return <NoDataFallback componentName="Breadcrumbs" />;
  }

  return <BreadcrumbsTrail datasource={datasource} />;
};

export const Link: React.FC<BreadcrumbsProps> = (props) => {
  const datasource = getDatasource(props.fields);

  if (!datasource) {
    return <NoDataFallback componentName="Breadcrumbs" />;
  }

  return <BreadcrumbsTrail datasource={datasource} currentPageAsLink />;
};

export const Banner: React.FC<BreadcrumbsProps> = () => <h1>Banner</h1>;
