import { RestEndpointMethodTypes } from '@octokit/rest';
import { Context } from './context';
import * as yaml from 'yaml';
import * as path from 'path';
import * as fs from 'fs';

export interface Settings {
  branches?: BranchesSettings;
}

export type BranchesSettings = Record<string, BranchSettings>;

export type BranchSettings =
  RestEndpointMethodTypes['repos']['updateBranchProtection']['parameters'];

let settings: Settings;

export const getSettings = (): Settings | undefined => {
  if (settings) {
    return settings;
  }

  if (!Context.githubWorkspace || !Context.settingsPath) {
    return undefined;
  }

  const settingsPath = path.resolve(
    Context.githubWorkspace,
    Context.settingsPath,
  );

  const settingsContent = fs.readFileSync(settingsPath, 'utf-8');

  return (settings = yaml.parse(settingsContent));
};
