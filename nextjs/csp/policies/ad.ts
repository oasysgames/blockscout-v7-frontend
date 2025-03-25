import Base64 from 'crypto-js/enc-base64';
import sha256 from 'crypto-js/sha256';
import type CspDev from 'csp-dev';

import { connectAdbutler, placeAd } from 'ui/shared/ad/adbutlerScript';
import { hypeInit } from 'ui/shared/ad/hypeBannerScript';

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
