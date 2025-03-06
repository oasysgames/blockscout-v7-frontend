import dynamic from 'next/dynamic';
import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useChainId } from 'wagmi';

import { getChainInfo } from './constants/chains';
import failedAnimation from './lottie/failed.json';
import successAnimation from './lottie/success.json';

const Lottie = dynamic(() => import('lottie-react'), {
  ssr: false,
});

export interface LoadingModalInput {
  loading: boolean;
  hash: string | undefined;
  error: string | undefined;
}

function modalClassName(isOpen: boolean) {
  return (
    (isOpen ? '' : 'hidden ') +
		'flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full'
  );
}

function getHeaderText(loading: boolean, hash: string | undefined, error: string | undefined) {
  if (loading) {
    return 'Pending...';
  }
  if (hash && !error) {
    return 'Bridge Successful!';
  }

  if (error) {
    return 'Request has been failed';
  }
}

// need this so tailwind knows these classes are used when build
const usedClass = {
  '1': 'w-8 h-8 fill-gray-600',
  '2': 'w-28 h-28 fill-green-600',
};

export const LoadingIcon: React.FC<{ w?: number; h?: number; c?: string }> = ({
  w = 8,
  h = 8,
  c = 'gray',
}) => (
  <>
    <svg
      aria-hidden="true"
      className={ `inline w-${ w } h-${ h } text-gray-200 animate-spin fill-${ c }-600` }
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
		&nbsp;
  </>
);

export const LoadingModal: React.FC<LoadingModalInput> = ({ loading, hash, error = '' }) => {
  const [ isOpen, setIsOpen ] = useState(false);

  const chainId = useChainId();
  const chain = useMemo(() => getChainInfo(chainId), [ chainId ]);
  const explorer = chain?.blockExplorers?.default.url;

  useEffect(() => {
    if (loading || hash || error) {
      setIsOpen(true);
    }
  }, [ loading, hash, error ]);

  const headerText = useMemo(() => getHeaderText(loading, hash, error), [ loading, hash, error ]);

  const firstLineErr = useMemo(() => error.slice(0, error.indexOf('\n')), [ error ]);

  return (
    <div id="tx-modal" aria-hidden="true" className={ modalClassName(isOpen) }>
      { /* back drop */ }
      <div
        className="opacity-35 fixed inset-0 z-0 bg-black"
        onClick={ () => setIsOpen(false) }
      ></div>
      { /* content */ }
      <div className="relative p-6 max-h-full bg-white rounded-lg shadow">
        { /* header */ }
        <div className="p-4 md:p-5 rounded-t">
          <h2 className="text-xl w-full font-semibold text-gray-900 text-center">
            { headerText }
          </h2>
        </div>
        { /* body */ }
        <div className="flex flex-col text-gray-900 items-center justify-center relative text-sm">
          <div className="p-4 md:p-5 space-y-4">
            { loading && <LoadingIcon w={ 28 } h={ 28 } c="green"/> }
            { !loading && (
              <Lottie
                animationData={ error ? failedAnimation : successAnimation }
                style={{ width: '150px', height: '150px' }}
              />
            ) }
          </div>
          { !loading && firstLineErr && (
            <p className="max-w-64 text-center">{ firstLineErr }</p>
          ) }
          { !loading && hash && (
            <p className="max-w-64 text-center">
							There can be hours or days of lag since you bridge your token.
            </p>
          ) }
          { Boolean(hash) && (
            <p className="mt-2">
							Go to explorer{ ' ' }
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={ `${ explorer }/tx/${ hash }` }
              >
                <FaExternalLinkAlt className="inline"/>
              </a>
            </p>
          ) }
        </div>
      </div>
    </div>
  );
};
