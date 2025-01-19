import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SessionAccountInterface } from '@argent/tma-wallet';
import { argentTMA, TOKEN_ADDRESSES } from '../config/wallet';
import { Contract, RpcProvider } from 'starknet';

interface WalletContextType {
  account: SessionAccountInterface | undefined;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  getBalance: (tokenAddress: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const provider = new RpcProvider({ nodeUrl: 'https://starknet-sepolia.public.blastapi.io' });

const ERC20_ABI = [
  {
    "name": "balanceOf",
    "type": "function",
    "inputs": [{ "name": "account", "type": "felt" }],
    "outputs": [{ "name": "balance", "type": "Uint256" }]
  }
];

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<SessionAccountInterface>();
  const [isConnected, setIsConnected] = useState(false);

  const connect = async () => {
    try {
      console.log("Requesting connection...");
      await argentTMA.requestConnection({
        callbackData: 'connect_callback',
        approvalRequests: [
          {
            tokenAddress: TOKEN_ADDRESSES.ETH,
            amount: '1000000000000000000', // 1 ETH
            spender: account?.address || '',
          }
        ]
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

  const getBalance = async (tokenAddress: string): Promise<string> => {
    if (!account) return '0';
    
    try {
      const contract = new Contract(ERC20_ABI, tokenAddress, provider);
      const balance = await contract.balanceOf(account.address);
      return balance.toString();
    } catch (error) {
      console.error('Failed to get balance:', error);
      return '0';
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log("Checking connection...");
        const res = await argentTMA.connect();
        
        if (!res) {
          console.log("No connection found");
          setIsConnected(false);
          return;
        }

        const { account: connectedAccount } = res;
        console.log("Connected account:", connectedAccount);
        
        if (connectedAccount.getSessionStatus() !== "VALID") {
          console.log("Session invalid");
          setAccount(connectedAccount);
          setIsConnected(false);
          return;
        }

        setAccount(connectedAccount);
        setIsConnected(true);
        console.log("Successfully connected");
      } catch (error) {
        console.error('Failed to check connection:', error);
        setIsConnected(false);
      }
    };

    checkConnection();
  }, []);

  return (
    <WalletContext.Provider value={{ 
      account, 
      isConnected, 
      connect, 
      disconnect,
      getBalance
    }}>
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