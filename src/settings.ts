import { RestEndpointMethodTypes } from '@octokit/rest';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

import { Context } from './context';

export interface Settings {
  repository?: RepositorySettings;
  branches?: BranchesSettings;
}

export type RepositorySettings =
  RestEndpointMethodTypes['repos']['update']['parameters'];

export type BranchesSettings = Record<string, BranchSettings>;

export type BranchSettings =
  RestEndpointMethodTypes['repos']['updateBranchProtection']['parameters'];

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
