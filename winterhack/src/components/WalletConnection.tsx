import { useWallet } from '../context/WalletContext';

export default function WalletConnection() {
  const { account, isConnected, connect, disconnect } = useWallet();

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      {!isConnected ? (
        <button
          onClick={connect}
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