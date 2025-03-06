import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import Experiment from 'ui/pages/Experiment';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/experiment">
      <Experiment/>
    </PageNextJs>
  );
};

export default Page;

export { stats as getServerSideProps } from 'nextjs/getServerSideProps';
