import type React from 'react';
import { Fragment } from 'react';
import { BreadcrumbsPage, BreadcrumbsProps } from 'components/breadcrumbs/breadcrumbs.props';
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

export const Default: React.FC<BreadcrumbsProps> = (props) => {
  const datasource = getDatasource(props.fields);
  const { ancestors, name } = datasource ?? {};

  if (datasource) {
    if (ancestors?.length) {
      return (
        <Breadcrumb>
          <BreadcrumbList>
            {ancestors.map((ancestor: BreadcrumbsPage, index) => {
              const title =
                getFieldValue(ancestor.navigationTitle)?.value ||
                getFieldValue(ancestor.title)?.value;

              return (
                <Fragment key={index}>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={ancestor.url?.href || ''}>{title}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </Fragment>
              );
            })}
            <BreadcrumbItem>
              <BreadcrumbPage>{truncate(name || '')}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
    }

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

  return <NoDataFallback componentName="Breadcrumbs" />;
};
