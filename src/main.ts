import * as core from '@actions/core';

import { processBranches } from './branches';

const run = async (): Promise<void> => {
  try {
    await processBranches();
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
