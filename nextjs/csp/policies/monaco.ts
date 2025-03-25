import type CspDev from 'csp-dev';

import { KEY_WORDS } from '../utils';

export function monaco(): CspDev.DirectiveDescriptor {
  return {
    'script-src': [
      KEY_WORDS.BLOB,
    ],
    'style-src': [
      'https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs/editor/editor.main.css',
    ],
    'font-src': [
      'https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs/base/browser/ui/codicons/codicon/codicon.ttf',
    ],
  };
}
