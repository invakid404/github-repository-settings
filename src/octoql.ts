import { graphql } from '@octokit/graphql';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

import { Context } from './context';
import { Repository } from './generated/graphql';

export const octoql = graphql.defaults({
  headers: {
    authorization: `token ${Context.token}`,
  },
});

let repositoryId: string;

export const getRepositoryId = async (): Promise<string> => {
  if (repositoryId) {
    return repositoryId;
  }

  const request = {
    query: {
      repository: {
        __args: {
          owner: Context.repo.owner,
          name: Context.repo.repo,
        },
        id: true,
      },
    },
  };

  const query = jsonToGraphQLQuery(request);

  const {
    repository: { id },
  }: {
    repository: Repository;
  } = await octoql(query);

  return (repositoryId = id);
};
