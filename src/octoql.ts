import { graphql } from '@octokit/graphql';

import { Context } from './context';

export const octoql = graphql.defaults({
  headers: {
    authorization: `token ${Context.token}`,
  },
});
