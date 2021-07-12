import * as core from '@actions/core';

import { getRepositoryId } from './octoql';
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
  try {
    const repositoryId = await getRepositoryId();

    core.info(repositoryId);
    core.info(branchName);
    core.info(JSON.stringify(protectionRules, null, 2));
  } catch (error) {
    core.warning(`Branch protection update failed: ${error.message}`);
  }
};
