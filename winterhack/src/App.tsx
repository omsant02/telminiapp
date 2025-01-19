import { WalletProvider } from './context/WalletContext';
import WalletConnection from './components/WalletConnection';
import "./index.css"
import "./App.css"

function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-white p-4"> {/* Changed bg-gray-100 to bg-white */}
        <h1 className="text-2xl font-bold mb-4 text-black">Winterhack Mini App</h1> {/* Added text-black */}
        <WalletConnection />
      </div>
    </WalletProvider>
  );
}

export default App;