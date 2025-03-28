import { useEffect, useState } from 'react';

export function useApiData<T, P extends Array<unknown>>(getData: (...args: P) => Promise<T>, params: P, placeholder?: T) {
  const [ data, setData ] = useState(placeholder);
  const [ isPlaceholderData, setIsPlaceHolderData ] = useState(true);
  const [ isError, setIsError ] = useState(false);

  useEffect(() => {
    (async() => {
      try {
        const data = await getData(...params);
        setData(data);
        setIsPlaceHolderData(false);
        setIsError(false);
      } catch (err) {
        setIsPlaceHolderData(false);
        setIsError(true);
      }
    })();
  }, [ getData, params ]);

  return {
    data, isPlaceholderData, isError,
  };
}
