import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAccount, useDisconnect, useAccountEffect } from 'wagmi';

export default function useWallet() {
  const { open } = useWeb3Modal();
  const { open: isOpen } = useWeb3ModalState();
  const { disconnect } = useDisconnect();
  const [ isModalOpening, setIsModalOpening ] = useState(false);
  const [ isClientLoaded, setIsClientLoaded ] = useState(false);
  const isConnectionStarted = useRef(false);

  useEffect(() => {
    setIsClientLoaded(true);
  }, []);

  const handleConnect = useCallback(async() => {
    setIsModalOpening(true);
    await open();
    setIsModalOpening(false);
    isConnectionStarted.current = true;
  }, [ open ]);

  const handleAccountConnected = useCallback(() => {
    isConnectionStarted.current = false;
  }, []);

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [ disconnect ]);

  useAccountEffect({ onConnect: handleAccountConnected });

  const { address, isDisconnected } = useAccount();

  const isWalletConnected = isClientLoaded && !isDisconnected && address !== undefined;

  return {
    openModal: open,
    isWalletConnected,
    address: address || '',
    connect: handleConnect,
    disconnect: handleDisconnect,
    isModalOpening,
    isModalOpen: isOpen,
  };
}
