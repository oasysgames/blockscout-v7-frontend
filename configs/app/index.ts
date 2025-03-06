import api from './api';
import app from './app';
import chain from './chain';
import * as features from './features';
import meta from './meta';
import services from './services';
import UI from './ui';
import verse from './verse';

const config = Object.freeze({
  app,
  chain,
  api,
  UI,
  features,
  services,
  meta,
  verse,
});

export default config;
