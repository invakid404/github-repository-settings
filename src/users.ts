import { jsonToGraphQLQuery } from 'json-to-graphql-query';

import { octoql } from './octoql';

export const getUserId = async (login: string): Promise<string> => {
  const request = {
    query: {
      user: {
        __args: {
          login,
        },
        id: true,
      },
    },
  };

  const {
    user: { id },
  } = await octoql(jsonToGraphQLQuery(request));

  return id;
};
