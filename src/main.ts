import * as core from '@actions/core';
import { octokit } from './octokit';
import { Context } from './context';

const run = async (): Promise<void> => {
  const { data } = await octokit.repos.getBranchProtection({
    ...Context.repo,
    branch: 'main',
  });

  core.info(JSON.stringify(data));
};

run();
