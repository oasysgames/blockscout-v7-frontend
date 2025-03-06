import type { Feature } from './types';

import stripTrailingSlash from 'lib/stripTrailingSlash';

import { getEnvValue } from '../utils';

const apiEndpoint = getEnvValue('NEXT_PUBLIC_EXPERIMENT_API_URL');

const title = 'Blockchain statistics';

const config: Feature<{ api: { endpoint: string; basePath: string } }> = (() => {
  if (apiEndpoint) {
    return Object.freeze({
      title,
      isEnabled: true,
      api: {
        endpoint: apiEndpoint,
        basePath: stripTrailingSlash(getEnvValue('NEXT_PUBLIC_EXPERIMENT_API_URL') || ''),
      },
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
