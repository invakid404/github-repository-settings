import * as core from '@actions/core';

import { Context } from './context';
import { octokit } from './octokit';
import { getSettings } from './settings';

export const processRepository = async (): Promise<void> => {
  const { repository } = getSettings();
  if (!repository) {
    core.warning('No repository settings specified!');

    return;
  }

  await octokit.repos.update({ ...Context.repo, repository });
};
