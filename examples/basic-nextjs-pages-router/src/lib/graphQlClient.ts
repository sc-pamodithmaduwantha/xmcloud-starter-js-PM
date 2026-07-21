import { GraphQLRequestClient } from '@sitecore-content-sdk/nextjs/client';
import scConfig from 'sitecore.config';

export const getGraphQlClient = (): GraphQLRequestClient => {
  return new GraphQLRequestClient(scConfig.api.edge.edgeUrl, {
    apiKey: scConfig.api.edge.contextId,
  });
};
