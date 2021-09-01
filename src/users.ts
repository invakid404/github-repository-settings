import { jsonToGraphQLQuery } from 'json-to-graphql-query';

import { octoql } from './octoql';

const userMap: { [login: string]: string } = {};
const teamMap: { [team: string]: string } = {};

export const getActorId = async (login: string): Promise<string> => {
  const parts = login.split('/');
  if (parts.length === 1) {
    return getUserId(login);
  }

  const [organization, slug] = parts;

  return getTeamId(organization, slug);
};

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

export const getTeamId = async (
  organization: string,
  slug: string,
): Promise<string> => {
  const teamKey = `${organization}/${slug}`;
  const cachedId = teamMap[teamKey];

  if (cachedId) {
    return cachedId;
  }

  const request = {
    query: {
      organization: {
        __args: {
          login: organization,
        },
        team: {
          __args: {
            slug,
          },
          id: true,
        },
      },
    },
  };

  const {
    organization: {
      team: { id },
    },
  } = await octoql(jsonToGraphQLQuery(request));

  return (teamMap[teamKey] = id);
};
