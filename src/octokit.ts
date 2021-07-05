import { Octokit } from '@octokit/rest';

import { Context } from './context';

export const octokit = new Octokit({
  auth: `token ${Context.token}`,
  userAgent: 'github-repository-settings',
});
