import type CspDev from 'csp-dev';

export function ad(): CspDev.DirectiveDescriptor {
  return {
    'frame-src': [
      // coinzilla
      'https://request-global.czilladx.com',
    ],
    'script-src': [
      // coinzilla
      'coinzillatag.com',
    ],
    'img-src': [
      // coinzilla
      'cdn.coinzilla.io',
    ],
    'font-src': [
      // coinzilla
      'https://request-global.czilladx.com',
    ],
  };
}
