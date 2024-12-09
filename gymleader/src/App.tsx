import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { usePrivy, useWallets} from '@privy-io/react-auth';

function App() {
  const [count, setCount] = useState(0)
  const { login, logout, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const [address, setAddress] = useState<string>('');

  // ウォレットの接続とアドレス取得
  const connectWallet = async () => {
    try {
      if (wallets && wallets.length > 0) {
        const wallet = wallets[0];
        await wallet.switchChain(11155111); // Sepoliaテストネット
        const provider = await wallet.getEthersProvider();
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAddress(address);
        console.log(user?.discord?.username);
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      
      {authenticated ? (
        <div>
          <button onClick={connectWallet}>Connect Wallet</button>
          {address && <p>Wallet Address: {address}</p>}
          <button onClick={logout}>
            Logout
          </button>
        </div>
      ) : (
        <button onClick={() => login({ loginMethods: ['discord'] })}>
          Login with discord
        </button>
      )}

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App