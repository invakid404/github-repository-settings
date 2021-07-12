import * as core from '@actions/core';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

import { getRepositoryId, octoql } from './octoql';
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

    const request = {
      mutation: {
        createBranchProtectionRule: {
          __args: {
            input: {
              ...protectionRules,
              repositoryId,
              pattern: branchName,
            },
          },
          branchProtectionRule: {
            id: true,
          },
        },
      },
    };

    await octoql(jsonToGraphQLQuery(request));
  } catch (error) {
    core.warning(`Branch protection update failed: ${error.message}`);
  }
};
