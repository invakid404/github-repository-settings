import { jsonToGraphQLQuery } from 'json-to-graphql-query';

import { octoql } from './octoql';

const userMap: Record<string, string> = {};

export const getUserId = async (login: string): Promise<string> => {
  const cachedId = userMap[login];
  if (cachedId) {
    return cachedId;
  }

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

  return (userMap[login] = id);
};
