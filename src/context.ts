import * as github from '@actions/github';

export const Context = {
  repo: github.context.repo,
  token: process.env.GITHUB_TOKEN,
  settingsPath: process.env.SETTINGS_PATH,
  githubWorkspace: process.env.GITHUB_WORKSPACE,
};
