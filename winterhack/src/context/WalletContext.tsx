import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SessionAccountInterface } from '@argent/tma-wallet';
import { argentTMA } from '../config/wallet';

interface WalletContextType {
  account: SessionAccountInterface | undefined;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<SessionAccountInterface>();
  const [isConnected, setIsConnected] = useState(false);

  const connect = async () => {
    try {
      await argentTMA.requestConnection({
        callbackData: 'connect_callback'
      });
    } catch (error) {
      console.error('Failed to request connection:', error);
    }
  };

  const disconnect = async () => {
    await argentTMA.clearSession();
    setAccount(undefined);
    setIsConnected(false);
  };

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await argentTMA.connect();
        
        if (!res) {
          setIsConnected(false);
          return;
        }

        const { account: connectedAccount } = res;
        
        if (connectedAccount.getSessionStatus() !== "VALID") {
          setAccount(connectedAccount);
          setIsConnected(false);
          return;
        }

        setAccount(connectedAccount);
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to check connection:', error);
        setIsConnected(false);
      }
    };

    checkConnection();
  }, []);

  return (
    <WalletContext.Provider value={{ account, isConnected, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}