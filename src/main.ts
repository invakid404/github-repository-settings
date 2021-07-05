import * as core from '@actions/core';
import { getSettings } from './settings';

const run = async (): Promise<void> => {
  const settings = getSettings();
  core.info(JSON.stringify(settings, null, 4));
};

run();
