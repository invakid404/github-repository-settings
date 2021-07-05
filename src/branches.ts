import * as core from '@actions/core';

import { Context } from './context';
import { octokit } from './octokit';
import { BranchSettings, getSettings } from './settings';

export const processBranches = async (): Promise<void> => {
  const { branches } = getSettings();
  if (!branches) {
    core.warning('No branch protection rules specified!');

    return;
  }

  await Promise.all(
    Object.entries(branches).map(async ([branchName, protectionRules]) =>
      setProtectionRules(branchName, protectionRules),
    ),
  );
};

const setProtectionRules = async (
  branchName: string,
  protectionRules: BranchSettings,
): Promise<void> => {
  const branchQuery = {
    ...Context.repo,
    branch: branchName,
  };

  await octokit.repos.updateBranchProtection({
    ...branchQuery,
    ...protectionRules,
  });
};
