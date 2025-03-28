import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const Bridge = dynamic(() => {
  return import('bridge/BridgePage');
});

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/bridge">
      <Bridge/>
    </PageNextJs>
  );
};

export default Page;
