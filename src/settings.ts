import { RestEndpointMethodTypes } from '@octokit/rest/dist-types';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

import { Context } from './context';
import { CreateBranchProtectionRuleInput } from './generated/graphql';

export type SettingsType<T> = Omit<T, 'owner' | 'repo'>;
export type GraphQLSettingsType<T> = Omit<
  T,
  'repositoryId' | 'clientMutationId'
>;

export interface Settings {
  repository?: SettingsType<RepositorySettings>;
  branches?: GraphQLSettingsType<BranchesSettings>;
}

export type RepositorySettings =
  RestEndpointMethodTypes['repos']['update']['parameters'];

export type BranchesSettings = Record<string, BranchSettings>;

export type BranchSettings = CreateBranchProtectionRuleInput;

let settings: Settings;

export const getSettings = (): Settings => {
  if (settings) {
    return settings;
  }

  if (!Context.githubWorkspace || !Context.settingsPath) {
    throw new Error('Settings path not specified!');
  }

  const settingsPath = path.resolve(
    Context.githubWorkspace,
    Context.settingsPath,
  );

  const settingsContent = fs.readFileSync(settingsPath, 'utf-8');

  return (settings = yaml.parse(settingsContent));
};
