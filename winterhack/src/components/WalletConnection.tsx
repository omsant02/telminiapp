import { useEffect, useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { TOKEN_ADDRESSES } from '../config/wallet';

export default function WalletConnection() {
  const { account, isConnected, connect, disconnect, getBalance } = useWallet();
  const [ethBalance, setEthBalance] = useState('0');
  const [strkBalance, setStrkBalance] = useState('0');

  useEffect(() => {
    if (isConnected && account) {
      const fetchBalances = async () => {
        const eth = await getBalance(TOKEN_ADDRESSES.ETH);
        const strk = await getBalance(TOKEN_ADDRESSES.STRK);
        setEthBalance(eth);
        setStrkBalance(strk);
      };
      fetchBalances();
    }
  }, [isConnected, account, getBalance]);

  const handleConnect = async () => {
    console.log("Connecting wallet...");
    try {
      await connect();
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      {!isConnected ? (
        <button
          onClick={handleConnect}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="space-y-4">
          <div className="break-all">
            <p className="text-sm text-gray-600">Connected Account:</p>
            <p className="font-mono text-sm">{account?.address}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Balances:</p>
            <p className="font-mono text-sm">ETH: {ethBalance}</p>
            <p className="font-mono text-sm">STRK: {strkBalance}</p>
          </div>
          
          <button
            onClick={disconnect}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}