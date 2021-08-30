import * as core from '@actions/core';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

import { Context } from './context';
import { BranchProtectionRule, Maybe, Repository } from './generated/graphql';
import { getRepositoryId, octoql } from './octoql';
import { BranchSettings, getSettings } from './settings';
import { getUserId } from './users';
import { notEmpty } from './utils';

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
    await createProtectionRule(branchName, protectionRules);
  } catch (error) {
    core.warning(`Branch protection update failed: ${String(error)}`);
  }
};

let protectionRulePatternMap: Map<string, string>;

const getProtectionRules = async (
  cursor?: Maybe<string>,
): Promise<BranchProtectionRule[]> => {
  const request = {
    query: {
      repository: {
        __args: {
          owner: Context.repo.owner,
          name: Context.repo.repo,
        },
        branchProtectionRules: {
          __args: {
            first: 100,
            ...(cursor && { after: cursor }),
          },
          pageInfo: {
            endCursor: true,
            hasNextPage: true,
          },
          nodes: {
            pattern: true,
            id: true,
          },
        },
      },
    },
  };

  const {
    repository: { branchProtectionRules },
  }: { repository: Repository } = await octoql(jsonToGraphQLQuery(request));

  const results = branchProtectionRules.nodes?.filter(notEmpty) ?? [];

  if (branchProtectionRules.pageInfo.hasNextPage) {
    const recurse = await getProtectionRules(
      branchProtectionRules.pageInfo.endCursor,
    );

    results.push(...recurse);
  }

  return results;
};

const getProtectionRuleMap = async (): Promise<Map<string, string>> => {
  if (protectionRulePatternMap) {
    return protectionRulePatternMap;
  }

  const protectionRules = await getProtectionRules();

  protectionRulePatternMap = new Map(
    protectionRules?.map(({ id, pattern }) => [pattern, id]),
  );

  return protectionRulePatternMap;
};

const createProtectionRule = async (
  branchName: string,
  protectionRules: BranchSettings,
): Promise<{ branchProtectionRule: BranchProtectionRule }> => {
  const protectionRuleMap = await getProtectionRuleMap();
  const branchProtectionRuleId = protectionRuleMap?.get(branchName);

  const mutationType = branchProtectionRuleId
    ? 'updateBranchProtectionRule'
    : 'createBranchProtectionRule';

  const request = {
    mutation: {
      [mutationType]: {
        __args: {
          input: {
            ...protectionRules,
            pushActorIds: await Promise.all(
              protectionRules.pushActorIds?.map(async (login) =>
                getUserId(login),
              ) ?? [],
            ),
            pattern: branchName,
            ...(branchProtectionRuleId
              ? { branchProtectionRuleId }
              : { repositoryId: await getRepositoryId() }),
          },
        },
        branchProtectionRule: {
          id: true,
        },
      },
    },
  };

  return octoql(jsonToGraphQLQuery(request));
};
