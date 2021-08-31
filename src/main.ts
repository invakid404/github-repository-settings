import * as core from '@actions/core';

import { processBranches } from './branches';
import { processRepository } from './repository';

(async (): Promise<void> => {
  try {
    await Promise.all([processRepository(), processBranches()]);
  } catch (error) {
    core.setFailed(String(error));
  }
})();
