import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import config from 'configs/app';
const rollupFeature = config.features.rollup;
const beaconChainFeature = config.features.beaconChain;
const experiment = config.verse.experiment;

export const CHAIN_INFO: { [key: string]: { id: number; name: string } } = {
  '248': { id: 248, name: 'Oasys' },
  '2400': { id: 2400, name: 'TCGVerse' },
  '7225878': { id: 7225878, name: 'SaakuruVerse' },
  '29548': { id: 29548, name: 'MCHVerse' },
  '7300': { id: 7300, name: 'XPLAVerse' },
  '19011': { id: 19011, name: 'HOMEVerse' },
  '16116': { id: 16116, name: 'DefiVerse' },
  '50006': { id: 50006, name: 'YooldoVerse' },
  '75512': { id: 75512, name: 'GeekVerse' },
  '5555': { id: 5555, name: 'ChainVerse' },
  '428': { id: 428, name: 'GesoVerse' },
};

export const getChainName = () => {
  const networkId = config.chain.id;
  if (!networkId || !CHAIN_INFO[networkId]) {
    return 'Unknown Chain';
  }
  return CHAIN_INFO[networkId].name;
};

const Withdrawals = dynamic(() => {
  if (rollupFeature.isEnabled && rollupFeature.type === 'optimistic') {
    return import('ui/pages/OptimisticL2Withdrawals');
  }

  if (rollupFeature.isEnabled && rollupFeature.type === 'arbitrum') {
    return import('ui/pages/ArbitrumL2Withdrawals');
  }

  if (rollupFeature.isEnabled && rollupFeature.type === 'shibarium') {
    return import('ui/pages/ShibariumWithdrawals');
  }

  if (rollupFeature.isEnabled && rollupFeature.type === 'zkEvm') {
    return import('ui/pages/ZkEvmL2Withdrawals');
  }

  if (rollupFeature.isEnabled && rollupFeature.type === 'scroll') {
    return import('ui/pages/ScrollL2Withdrawals');
  }

  if (rollupFeature.isEnabled && rollupFeature.type === 'oasys') {
    return import('ui/pages/OasysL2ChainWithdrawals');
  }

  if (beaconChainFeature.isEnabled && experiment.api) {
    return import('ui/pages/OasysL1ChainWithdrawals');
  }

  if (beaconChainFeature.isEnabled) {
    return import('ui/pages/BeaconChainWithdrawals');
  }

  throw new Error('Withdrawals feature is not enabled.');
}, { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/withdrawals">
      <Withdrawals/>
    </PageNextJs>
  );
};

export default Page;

export { withdrawals as getServerSideProps } from 'nextjs/getServerSideProps';
