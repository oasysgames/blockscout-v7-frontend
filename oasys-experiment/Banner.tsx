import React from 'react';
import Image from 'next/image';
import { getEnvValue } from '../configs/app/utils';
import { useAppContext } from '../lib/contexts/app';
import * as cookies from '../lib/cookies';

interface BannerConfig {
  imageUrl: string;
  linkUrl: string;
}

const Banner: React.FC = () => {
  const [ isMounted, setIsMounted ] = React.useState(false);
  const appProps = useAppContext();
  const cookiesString = appProps.cookies;
  const isNavBarCollapsedCookie = cookies.get(cookies.NAMES.NAV_BAR_COLLAPSED, cookiesString);
  const isNavBarCollapsed = isNavBarCollapsedCookie === 'true';

  // 3つのバナー設定を取得
  const bannerConfigs = [
    {
      imageUrl: getEnvValue('NEXT_PUBLIC_BANNER_IMAGE_URL_1'),
      linkUrl: getEnvValue('NEXT_PUBLIC_BANNER_LINK_URL_1') ?? '#',
    },
    {
      imageUrl: getEnvValue('NEXT_PUBLIC_BANNER_IMAGE_URL_2'),
      linkUrl: getEnvValue('NEXT_PUBLIC_BANNER_LINK_URL_2') ?? '#',
    },
    {
      imageUrl: getEnvValue('NEXT_PUBLIC_BANNER_IMAGE_URL_3'),
      linkUrl: getEnvValue('NEXT_PUBLIC_BANNER_LINK_URL_3') ?? '#',
    },
  ];

  const banners: Array<BannerConfig> = bannerConfigs
    .filter((config): config is BannerConfig =>
      typeof config.imageUrl === 'string' && config.imageUrl !== '');

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || isNavBarCollapsed || banners.length === 0) return null;

  return (
    <div style={{
      margin: '0',
      padding: '0',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      backgroundColor: 'transparent',
      lineHeight: '0',
      marginTop: 'auto',
    }}>
      { banners.map((banner, index) => (
        <a
          key={ index }
          href={ banner.linkUrl }
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', lineHeight: '0' }}
        >
          <Image
            src={ banner.imageUrl }
            alt={ `Banner ${ index + 1 }` }
            width={ 160 }
            height={ 80 }
            priority
            unoptimized
            style={{
              maxWidth: '160px',
              maxHeight: '80px',
              display: 'block',
              margin: '0',
              padding: '0',
              lineHeight: '0',
            }}
          />
        </a>
      )) }
    </div>
  );
};

export default Banner;
